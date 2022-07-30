const express = require('express')
const app = express()
require("dotenv").config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufgzb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    await client.connect()
    const servicesCollection = client.db('justgo').collection('services')
    const orderCollection = client.db('justgo').collection('orders')
    

// post api
app.post('/services', async(req, res)=>{
  const order = req.body
  console.log('hit the post api', order);
  const result = await orderCollection.insertOne(order)
  console.log(result);
  res.json(result)
})

// GET API
app.get('/services', async (req, res) => {
  const cursor = servicesCollection.find({});
  const services = await cursor.toArray();
  res.send(services);
})

    // GET API for Orders
    app.get('/manage-order', async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    })

     // GET Single Service
    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await servicesCollection.findOne(query);
      res.json(service);

    })
    
    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log('Hit the post api', service)
      const result = await servicesCollection.insertOne(service);
      console.log(result)
      res.json(result)

  });


   // UPDATE API
    // Approve The Pending
    app.put('/approve/:id', async (req, res) => {
      const id = req.params.id;
      // console.log('updating.... ', id)
      const status = req.body.status;
      console.log(status);
      const query = { _id: ObjectId(id) }; // filtering user's object
      const options = { upsert: true }; // update and insert
    

      const updateDoc = { // set data
          $set: {
              status: status
          },
      };
      const result = await orderCollection.updateOne(query, updateDoc, options)
      res.json(result)
  })




  app.delete('/order/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)}
    const result = await orderCollection.deleteOne(query)
  })

}
finally{

}

}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello Just go!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})