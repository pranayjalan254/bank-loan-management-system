import React, { useState, useEffect } from "react";
import axios from "axios";

const AccountOverview = ({ customerId }) => {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/overview/${customerId}`
        );
        setOverview(response.data);
      } catch (error) {
        console.error("Error fetching account overview:", error);
      }
    };

    fetchOverview();
  }, [customerId]);

  if (!overview) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Account Overview for Customer ID: {customerId}</h2>
      <ul>
        {overview.map((loan) => (
          <li key={loan._id}>
            <p>Principal: ₹{loan.principal}</p>
            <p>Total Amount: ₹{loan.totalAmount}</p>
            <p>EMI: ₹{loan.EMI}</p>
            <p>Total Interest: ₹{loan.totalInterest}</p>
            <p>Amount Paid: ₹{loan.amountPaid}</p>
            <p>EMIs Left: {loan.EMIsLeft}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountOverview;
