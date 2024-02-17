const { MongoClient, ObjectId } = require("mongodb");

const express = require("express");
const bp = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bp.urlencoded({ extended: true }));
app.set("views engine", "ejs");

const uri =
  "mongodb+srv://22pa5a1211:db123@cluster0.cy64wo2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.get("/", async (req, res) => {
  // const x = await db.collection("Mycollection").find().toArray();
  const x = await getData();
  res.render("todo.ejs", {
    list: x,
  });
});

app.post("/", async (req, res) => {
  const val = req.body.task;
  try {
    const res = await client.connect();
    if (res.topology.isConnected()) {
      console.log("Connection is Established");
      console.log(val);
      const db = client.db("Mydb");
      const collection = db.collection("Mycollection");
      const doc = {
        task: val,
      };
      const result = await collection.insertOne(doc);
      console.log(result);
    } else {
      console.log("Failed To Connect");
    }
  } catch (err) {
    console.log(err.message);
  }
  res.redirect("/");
});

async function getData() {
  const data = await client
    .db("Mydb")
    .collection("Mycollection")
    .find()
    .toArray();
  return data;
}

app.post("/delet", async (req, res) => {
  const id = req.body.taskId;
  const db = client.db("Mydb");
  const collection = db.collection("Mycollection");
  try {
    const delRes = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    console.log(delRes);
  } catch (err) {
    console.error(err.message);
  }
  res.redirect("/");
});

app.listen(3000);
