const express = require("express");
const {
  lendMoney,
  makePayment,
  getLedger,
  getAccountOverview,
} = require("../controllers/loanController");

const router = express.Router();

router.post("/lend", lendMoney);
router.post("/payment", makePayment);
router.get("/ledger/:loanId", getLedger);
router.get("/overview/:customerId", getAccountOverview);

module.exports = router;
