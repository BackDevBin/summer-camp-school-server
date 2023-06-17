const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Mongodb start 


const uri = `mongodb+srv://${process.env.DB_CampUser}:${process.env.DB_CampPass}@cluster0.64cauca.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const classCollection = client.db("SummerCamp").collection("classCollection");
    const userClassCollection = client.db("SummerCamp").collection("userClassCollection");
    const usersCollection = client.db("SummerCamp").collection("users");



    app.get('/popular', async(req, res) =>{
        const cursor = classCollection.find().sort({"total_students":-1}).limit(6);
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/classes', async(req, res) =>{
        const cursor = classCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      // Class collection api
      
      app.get('/class', async(req, res) =>{

        const email = req.query.email;
        
        if(!email){
          res.send([]);
        }

        const query = {email: email};
        const result = await userClassCollection.find(query).toArray();
        res.send(result);
        
      })
      
      app.post('/class', async(req, res) =>{
        const item = req.body;
        const result = await userClassCollection.insertOne(item);
        console.log('users:', item);
        res.send(result);
  
      })

      app.delete('/class/:id',async(req, res) =>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
  
        const deleteItem = await userClassCollection.deleteOne(query);
        res.send(deleteItem);
  
  
      })

      // user collections Api

      app.post('/users', async(req, res) =>{

        const user = req.body;
        const result = await usersCollection.insertOne(user);
        // console.log('users:', user);
        res.send(result);
      })
  
  
  


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// Mongodb stop

app.get('/',(req,res)=>{
    res.send('Summer-Camp-Server');
})
app.listen(port,()=>{
    console.log('Ha Ha Server Is Running');
})