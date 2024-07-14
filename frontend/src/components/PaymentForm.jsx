import React, { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [loanId, setLoanId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EMI");
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/payment", {
        loanId,
        amount,
        type,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Loan ID"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="EMI">EMI</option>
          <option value="LUMP_SUM">Lump Sum</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <p>Balance: {result.balance}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
