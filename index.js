const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.port || 3000;

// Middleware 
app.use(cors());
app.use(express.json())


// mongodb 
const url = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.kssadct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const Db_gadgetShop = client.db('GadgetShop').collection('user');


const dbConnect = async () => {
    try {
        await client.connect();
        console.log('Database use is Connect');

        app.post('/user', async (req, res) => {
            const user = req.body
            console.log(user);
            const result = await Db_gadgetShop.insertOne(user);
            res.status(200).send(result);
        })


    } catch (error) {
        console.log(error.name, error.message)
    }
}

dbConnect();

//API
app.get('/', (req, res) => {
    res.send('Hello World!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})