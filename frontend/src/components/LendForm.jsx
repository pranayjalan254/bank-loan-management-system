import React, { useState } from "react";
import axios from "axios";

const LendForm = () => {
  const [customerId, setCustomerId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/lend", {
        customerId,
        loanAmount,
        loanPeriod,
        interestRate,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error lending money:", error);
    }
  };

  return (
    <div>
      <h2>Lend Money</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Loan Period (Years)"
          value={loanPeriod}
          onChange={(e) => setLoanPeriod(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Interest Rate (%)"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <p>Total Amount: {result.totalAmount}</p>
          <p>Monthly EMI: {result.monthlyEMI}</p>
        </div>
      )}
    </div>
  );
};

export default LendForm;
