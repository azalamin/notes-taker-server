const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxgvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("Note takers is running");
});

async function run() {
  try {
    await client.connect();
    const noteCollection = client.db("notesTaker").collection("notes");

    // Read Data
    app.get("/notes", async (req, res) => {
      const query = {};
      const cursor = noteCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST Data
    app.post("/notes", async (req, res) => {
      const newNote = req.body;
      const result = await noteCollection.insertOne(newNote);
      res.send(result);
    });

    // Update Data
    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          user_name: data.user_name,
          text: data.text,
        },
      };
      const result = await noteCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // DELETE Data
    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await noteCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    //   await client.close()
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Listening to the", port);
});
