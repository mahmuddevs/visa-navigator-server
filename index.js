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
        const visaCollection = visaDB.collection('visaCollection')
        const applicationCollection = visaDB.collection('applicationCollection')

        app.get('/users', async (req, res) => {

            const users = userCollection.find();
            const result = await users.toArray()

            res.send(result)
        })
        // app.get('/:id', async (req, res) => {
        //     const id = req.params.id

        //     const query = { _id: new ObjectId(id) }

        //     const result = await userCollection.findOne(query);

        //     res.send(result)
        // })




        //Visa Routes

        //Get All Visas
        app.get('/all-visas', async (req, res) => {
            const visas = visaCollection.find();
            const result = await visas.toArray()

            return res.send(result)
        })


        //Get Latest Visas
        app.get('/latest-visas', async (req, res) => {
            const latestVisas = await visaCollection
                .find()
                .sort({ createdAt: -1 })
                .limit(6).toArray();

            return res.send(latestVisas)
        })


        //Add visa
        app.post('/add-visa', async (req, res) => {
            const data = req.body
            const { user, countryName, visaType } = data

            const query = { user, countryName, visaType };

            const existing = await visaCollection.findOne(query)

            if (existing) {
                return res.send({ message: "Already Exists" })
            }

            const result = await visaCollection.insertOne({ ...data, createdAt: new Date() })
            return res.send(result)
        })

        //Get Visas By Email
        app.post('/my-visas', async (req, res) => {
            const { email } = req.body

            const query = { user: email }

            const visas = visaCollection.find(query);
            const result = await visas.toArray()

            return res.send(result)
        })

        //Get Single Visa
        app.get('/visas/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await visaCollection.findOne(query);
            return res.send(result)
        })

        //Update Visa
        app.put('/visas/:id', async (req, res) => {
            const id = req.params.id
            const updatedData = req.body

            const { countryName, countryImg, visaType, processingTime, requiredDocuments, description, minAge, fee, validity, applicationMethod, user } = updatedData

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {

                $set: {
                    countryName,
                    countryImg,
                    visaType,
                    processingTime,
                    requiredDocuments,
                    description,
                    minAge,
                    fee,
                    validity,
                    applicationMethod,
                    user
                },

            };

            const result = await movies.updateOne(filter, updateDoc, options);

        })

        app.delete('/visas/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await visaCollection.deleteOne(query);
            return res.send(result)
        })

        //Add Visa Application

        app.post('/application/add', async (req, res) => {
            const data = req.body
            const { countryName, email, firstName, lastName, appliedDate, fee } = data

            const query = { countryName, email, firstName, lastName, appliedDate, fee };

            const existing = await applicationCollection.findOne(query)

            if (existing) {
                return res.send({ message: "Already Exists" })
            }

            const result = await applicationCollection.insertOne({ ...data, createdAt: new Date() })
            return res.send(result)

        })

        await client.db("userDB").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// app.get('/', (req, res) => {
//     res.send('hello world')
// })

app.listen(port, () => {
    console.log(`Linstening to port ${port}`)
})