const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId, } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config()

// middleware 
app.use(cors());
app.use(express.json());



// mongodb connect 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.fycfdwn.mongodb.net/?retryWrites=true&w=majority`;



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
    // await client.connect();
    const taskCollection = client.db("taskDB").collection("tasks");

    app.get('/tasks', async (req, res) => {
      console.log(req.query.email);
      
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })
    app.post('/tasks', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// server runnig
app.get('/', (req, res) => {
  res.send('Task manager is on')
})
app.listen(port, () => {
  console.log('server runnig at port', port);
})
