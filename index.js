import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const uri = `mongodb+srv://Mahmud:UwXjArDawlIoAKgg@merncluster.qifq6.mongodb.net/?retryWrites=true&w=majority&appName=MernCluster`;

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
        // await client.connect();
        const visaDB = client.db("VisaNavigation")
        const visaCollection = visaDB.collection('visaCollection')
        const applicationCollection = visaDB.collection('applicationCollection')

        app.get('/', (req, res) => {
            res.send('Server Is Running Fine')
        })

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
                .limit(5).toArray();

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

        //Get Visas By Visa Type
        app.post('/visas/filter-by-visa-type', async (req, res) => {
            const { visaType } = req.body

            const query = { visaType }

            if (visaType === "") {
                const visas = visaCollection.find();
                const result = await visas.toArray()
                return res.send(result)
            }

            const visas = visaCollection.find(query);
            const result = await visas.toArray()

            return res.send(result)
        })

        //sort visa
        app.post('/visas/sort-by-price', async (req, res) => {
            const { sort } = req.body

            if (sort === "") {
                const visas = visaCollection.find();
                const result = await visas.toArray()
                return res.send(result)
            }

            const visas = await visaCollection.find().sort({ fee: sort }).toArray()
            return res.send(visas)
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

            const result = await visaCollection.updateOne(filter, updateDoc, options);
            return res.send(result)
        })

        app.delete('/visas/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await visaCollection.deleteOne(query);
            return res.send(result)
        })


        //Get All Visa Application By Email
        app.post('/application/my-applications', async (req, res) => {

            const { email } = req.body

            const query = { email }

            const applications = applicationCollection.find(query);
            const result = await applications.toArray()

            return res.send(result)
        })

        //Add Visa Application

        app.post('/application/add', async (req, res) => {
            const data = req.body
            const { countryName, countryImg, visaType, processingTime, fee, validity, applicationMethod, email, appliedDate } = data
            const applicantsName = data.firstName + " " + data.lastName
            const formData = { countryName, countryImg, visaType, processingTime, fee, validity, applicationMethod, applicantsName, email, appliedDate }


            const query = { countryName, email, applicantsName, appliedDate, fee };

            const existing = await applicationCollection.findOne(query)

            if (existing) {
                return res.send({ message: "Already Exists" })
            }

            const result = await applicationCollection.insertOne({ ...formData, createdAt: new Date() })
            return res.send(result)

        })

        app.delete('/application/my-applications/:id', async (req, res) => {
            const id = req.params.id

            const query = { _id: new ObjectId(id) }
            const result = await applicationCollection.deleteOne(query);
            return res.send(result)
        })

        // await client.db("visaDB").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Linstening to port ${port}`)
})