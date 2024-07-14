import React, { useState, useEffect } from "react";
import axios from "axios";

const Ledger = ({ loanId }) => {
  const [ledger, setLedger] = useState(null);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ledger/${customerId}`
        );
        setLedger(response.data);
      } catch (error) {
        console.error("Error fetching ledger:", error);
      }
    };

    fetchLedger();
  }, [loanId]);

  if (!ledger) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Ledger for Loan ID: {customerId}</h2>
      <ul>
        {ledger.transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.type}: ${transaction.amount} on{" "}
            {new Date(transaction.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <p>Balance: {balance}</p>
      <p>Monthly EMI: {monthlyEMI}</p>
      <p>EMIs Left: {EMIsLeft}</p>
    </div>
  );
};

export default Ledger;
