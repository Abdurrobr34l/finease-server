const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    // await client.connect();
    //? Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("FinEase is successfully connected to MongoDB!");

    const db = client.db("fin_ease");
    const collection = db.collection("transactions");

    //* -----------ROUTES-----------
    app.get("/", (req, res) => {
      res.send("Server running")
    })

    //* -----------ADD TRANSACTION (POST)-----------
    app.post("/add-transaction", async (req, res) => {
      const transaction = {
        ...req.body,
        userEmail: req.body.userEmail,
        createdAt: new Date(),
      };
      try {
        const result = await collection.insertOne(transaction);
        res.send(result);
      }
      catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to add transaction" });
      }
    });

    //* -----------GET TRANSACTION DATA BY ID FROM DB (GET)-----------
    app.get("/my-transactions/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await collection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch transaction data by id" });
      }
    });

    //* -----------GET ALL TRANSACTION FROM DB (GET)-----------
    app.get("/my-transactions", async (req, res) => {
      try {
        const { email, sortBy = "createdAt", order = "desc" } = req.query;
        if (!email) return res.status(400).send({ message: "User email is required" });

        const sortOrder = order === "asc" ? 1 : -1;

        const transactions = await collection
          .find({ userEmail: { $regex: `^${email.trim()}$`, $options: "i" } }) // case-insensitive
          .sort({ [sortBy]: sortOrder })
          .toArray();

        res.send(transactions);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch transactions" });
      }
    });

    //* -----------DELETE TRANSACTION (DELETE)-----------
    app.delete("/delete-transaction/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      }
      catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete transaction" });
      }
    })

    //* -----------UPDATE TRANSACTION (PUT)-----------
    app.put("/update-transaction/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        delete updatedData._id;

        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update transaction" });
      }
    });

  }
  finally {

  }
}
run().catch(console.dir)

//* START SERVER
app.listen(port, () => {
  console.log(`FinEase Server is running on port: ${port}`);
});