import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@merncluster.qifq6.mongodb.net/?retryWrites=true&w=majority&appName=MernCluster`;

const app = express()

const port = process.env.PORT || 3002

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        const visaDB = client.db("VisaNavigation")
        const userCollection = visaDB.collection('userCollection')
        const visaCollection = visaDB.collection('visaCollection')

        app.get('/users', async (req, res) => {

            const users = userCollection.find();
            const result = await users.toArray()

            res.send(result)
        })
        app.get('/:id', async (req, res) => {
            const id = req.params.id

            const query = { _id: new ObjectId(id) }

            const result = await userCollection.findOne(query);

            res.send(result)
        })

        app.post('/add-visa', async (req, res) => {
            const data = req.body
            const { user, countryName, visaType } = data

            const query = { user, countryName, visaType };

            const existing = await visaCollection.findOne(query)

            if (existing) {
                return res.send({ message: "Already Exists" })
            }

            const result = await visaCollection.insertOne(data)
            res.send(result)
        })

        await client.db("userDB").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`Linstening to port ${port}`)
})