const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zgm5tdq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const taskCollection = client.db("taskManagement").collection("task");

    app.post('/task', async (req, res) => {
      const task = req.body;
      console.log(task)
      const result = await taskCollection.insertOne(task);
      res.send(result);
    })

    app.get('/task/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email)
      const query = { email: email }
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })

    app.patch('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            tab: "ongoing"
          }
        }
        const result = await taskCollection.updateOne(query, updateDoc);
        res.send(result);
    })
    app.put('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            tab: "todo"
          }
        }
        const result = await taskCollection.updateOne(query, updateDoc);
        res.send(result);
    })

    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Dtask server is running...');
})

app.listen(port, () => {
  console.log(`Dtask server is running on port ${port}`)
})