const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
require('dotenv').config()
const app = express()
const jwt = require('jsonwebtoken')
const port = process.env.port || 3000;

// Middleware 
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}))
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




const dbConnect = async () => {
    try {

        // console.log('Database use is Connect');

        const Db_gadgetShop_User = client.db('GadgetShop').collection('user');
        const Db_gadgetShop_Product = client.db('GadgetShop').collection('Product');


        app.post('/jwt', async (req, res) => {
            const userEmail = req.body;
            console.log('Hit', userEmail, process.env.Access_Token);
            const token = jwt.sign(userEmail, process.env.Access_Token, { expiresIn: '1h' })
            res.send({ token });
        })


        app.post('/user', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            existingUser = await Db_gadgetShop_User.findOne(query)
            if (existingUser) {
                return res.send({ message: "User Exist" });
            }
            user.wishlist = [];
            const result = await Db_gadgetShop_User.insertOne(user);
            res.status(200).send(result);
        })

        app.get('/Product', async (req, res) => {

            const { Category, Brand, Short } = req.query;
            const query = {};
            let sort;

            if (Category) {
                query.Category = { $regex: Category, $options: "i" }
 
            }
            if (Brand) {
                query.Brand = { $regex: Brand, $options: "i" }
                
            }
            if (Short) {
                sort = Short === 'DESC' ? -1 : 1 ;
                
            } 



            const ProductInfo = await Db_gadgetShop_Product.find({}, { projection: { category: 1, brand: 1 } }).toArray();


            const allCategory = [...new Set(ProductInfo.map(p => p.category))]

            const allBrand = [...new Set(ProductInfo.map(p => p.brand))]

            const Product = await Db_gadgetShop_Product.find(query).sort({ price: sort }).toArray();
            res.send({ Product, allCategory, allBrand })

        })



        app.get('/', (req, res) => {
            res.send('Hello World!')
        })


        await client.connect();

    } catch (error) {
        console.log(error.name, error.message)
    }
}

dbConnect();

//API



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})