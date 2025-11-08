const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//* MIDDLEWARE
app.use(cors());
app.use(express.json());


//* ROUTS
app.get("/", (req, res) => {
  res.send("FinEase Server is running.....");
});

//* START SERVER
app.listen(port, () => {
  console.log(`FinEase Server is running on port: ${port}`);
});