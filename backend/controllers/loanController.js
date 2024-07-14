const Loan = require("../models/Loan");

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
    const totalInterest = (loanAmount * loanPeriod * interestRate) / 100;
    const totalAmount = loanAmount + totalInterest;
    const monthlyEMI = calculateEMI(loanAmount, interestRate, loanPeriod);

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
      loan.balance -= loan.monthlyEMI;
      loan.EMIsLeft -= 1;
    } else {
      loan.balance -= amount;
    }

    loan.transactions.push({ type, amount });
    await loan.save();

    res.json({ balance: loan.balance });
  } catch (error) {
    console.error("Error in makePayment:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getLedger = async (req, res) => {
  try {
    const { loanId } = req.params;
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
      amountPaid: loan.principal + loan.totalAmount - loan.balance,
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
