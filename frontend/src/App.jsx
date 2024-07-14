import React, { useState } from "react";
import LendForm from "./components/LendForm";
import PaymentForm from "./components/PaymentForm";
import Ledger from "./components/Ledger";
import AccountOverview from "./components/AccountOverview";

function App() {
  const [view, setView] = useState("lend");
  const [loanId, setLoanId] = useState("");
  const [customerId, setCustomerId] = useState("");

  return (
    <div>
      <h1>Bank Loan Management System</h1>
      <nav>
        <button onClick={() => setView("lend")}>Lend Money</button>
        <button onClick={() => setView("payment")}>Make Payment</button>
        <button onClick={() => setView("ledger")}>View Ledger</button>
        <button onClick={() => setView("overview")}>Account Overview</button>
      </nav>
      <div>
        {view === "lend" && <LendForm />}
        {view === "payment" && <PaymentForm />}
        {view === "ledger" && (
          <div>
            <input
              type="text"
              placeholder="Loan ID"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
            />
            {loanId && <Ledger loanId={loanId} />}
          </div>
        )}
        {view === "overview" && (
          <div>
            <input
              type="text"
              placeholder="Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
            {customerId && <AccountOverview customerId={customerId} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
