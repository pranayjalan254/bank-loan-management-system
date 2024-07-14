const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const loanRoutes = require("./routes/loanRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", loanRoutes);

mongoose
  .connect("mongodb://localhost:27017/bank-loan-management-system")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
