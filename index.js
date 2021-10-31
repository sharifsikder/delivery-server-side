
const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbufa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      console.log('databse thik ase');
      
      const database = client.db('food_delivery');
      const itemsCollection = database.collection('items');
      const orderCollection = database.collection('orders')

    //GET API ALL DATA  
     app.get('/items', async(req, res) => {
         const cursor = itemsCollection.find({});
         const items = await cursor.toArray();
         res.send(items)
     });

     // GET API SINGLE DATA
     app.get('/items/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const item = await itemsCollection.findOne(query)
      res.json(item) 

     });
    // add orders api
     app.post('/orders', async(req, res) => {
         const order = req.body;
         const result = await orderCollection.insertOne(order);
         res.json(result)
     })

     // order get api 
     app.get('/orders', async(req, res) => {
         const cursor = orderCollection.find({});
         const orders = await cursor.toArray();
         res.send(orders)
     })

     // delete api 
     app.delete('/orders/:id', async(req, res) => {
         const id = req.params.id;
         const query = {_id:ObjectId(id)};
         const result = await orderCollection.deleteOne(query)
         res.json(result)

     })
     //post api 
     app.post('/items', async(req, res) => {
         const item = req.body;
         console.log('hit the post api', item);
         const result = await itemsCollection.insertOne(item);
         console.log(result)
         res.send (result)
     })
     
    } finally {
     // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})