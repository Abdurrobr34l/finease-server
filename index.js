const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//* MIDDLEWARE
app.use(cors());
app.use(express.json());

//* MONOGODB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@abdurrobr34l.wemtyvn.mongodb.net/?appName=Abdurrobr34l`;

//* MONGODB CLIENT
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//* MONGODB
async function run() {
  try {
    //? Connect the client to the server
    await client.connect();
    //? Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("FinEase is successfully connected to MongoDB!");
  }
  finally {

  }
}
run().catch(console.dir)

//* -----------ROUTES-----------
app.get("/", (req, res) => {
  res.send("FinEase Server is running.....");
});

//* -----------ADD TRANSACTION (POST)-----------
app.post("/add-transaction", async (req, res) => {
  const transaction = req.body;

  try {
    const db = client.db("fin_ease");
    const collection = db.collection("transactions");
    const result = await collection.insertOne(transaction);
      res.send(result);
  }
  catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to add transaction" });
  }
})

//* START SERVER
app.listen(port, () => {
  console.log(`FinEase Server is running on port: ${port}`);
});