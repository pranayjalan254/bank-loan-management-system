const Loan = require("../models/Loan");
const mongoose = require("mongoose");

const calculateEMI = (principal, rate, period) => {
  const monthlyRate = rate / (12 * 100);
  const months = period * 12;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
};

const lendMoney = async (req, res) => {
  try {
    const { customerId, loanAmount, loanPeriod, interestRate } = req.body;
    const monthlyEMI = calculateEMI(loanAmount, interestRate, loanPeriod);
    const totalInterest = monthlyEMI * loanPeriod * 12 - loanAmount;
    const totalAmount = Number(loanAmount) + Number(totalInterest);

    const loan = new Loan({
      customerId,
      principal: loanAmount,
      loanPeriod,
      interestRate,
      totalAmount,
      monthlyEMI,
      transactions: [],
      balance: totalAmount,
      EMIsLeft: loanPeriod * 12,
    });

    await loan.save();
    res.json({ totalAmount, monthlyEMI });
  } catch (error) {
    console.error("Error in lendMoney:", error);
    res.status(500).send("Internal Server Error");
  }
};

const makePayment = async (req, res) => {
  try {
    const { loanId, amount, type } = req.body;
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).send("Loan not found");
    }

    if (type === "EMI") {
      loan.balance -= amount;
      loan.EMIsLeft -= 1;
    } else {
      loan.balance -= amount;
    }

    loan.monthlyEMI = calculateEMI(
      loan.balance,
      loan.interestRate,
      loan.loanPeriod
    );

    loan.transactions.push({ type, amount });
    await loan.save();

    res.json({ balance: loan.balance, monthlyEMI: loan.monthlyEMI });
  } catch (error) {
    console.error("Error in makePayment:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getLedger = async (req, res) => {
  try {
    const { loanId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).send("Invalid loanId");
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).send("Loan not found");
    }

    res.json({
      transactions: loan.transactions,
      balance: loan.balance,
      monthlyEMI: loan.monthlyEMI,
      EMIsLeft: loan.EMIsLeft,
    });
  } catch (error) {
    console.error("Error in getLedger:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAccountOverview = async (req, res) => {
  try {
    const { customerId } = req.params;
    const loans = await Loan.find({ customerId });

    if (!loans.length) {
      return res.status(404).send("No loans found for this customer");
    }

    const overview = loans.map((loan) => ({
      principal: loan.principal,
      totalAmount: loan.totalAmount,
      EMI: loan.monthlyEMI,
      totalInterest: loan.totalAmount - loan.principal,
      amountPaid: loan.totalAmount - loan.balance,
      EMIsLeft: loan.EMIsLeft,
    }));

    res.json(overview);
  } catch (error) {
    console.error("Error in getAccountOverview:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  lendMoney,
  makePayment,
  getLedger,
  getAccountOverview,
};
