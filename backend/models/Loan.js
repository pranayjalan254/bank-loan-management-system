const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

const loanSchema = new mongoose.Schema({
  customerId: Number,
  principal: Number,
  loanPeriod: Number,
  interestRate: Number,
  totalAmount: Number,
  monthlyEMI: Number,
  transactions: [transactionSchema],
  balance: Number,
  EMIsLeft: Number,
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
