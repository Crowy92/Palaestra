const PORT = 8000;
const express = require('express');
const { MongoClient } = require('mongodb');

const { v1: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const uri = process.env.URI
const cors = require('cors')
const bcrypt = require('bcrypt')

const app = express();
app.use(cors())
app.use(express.json())

app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri);
    //console.log(req.body.formData);
    const { email, password, dob_day, dob_month, dob_year,
        url, about, interests, fname } = req.body.formData;

    const generateduserId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const existingUser = await users.findOne({ email })

        if (existingUser) {
            return res.status(409).send('User already exists. Please Login')
        }

        const sanitisedEmail = email.toLowerCase()
        const data = {
            user_id: generateduserId,
            hashedPassword: hashedPassword,
            first_name: fname,
            dob_day: dob_day,
            dob_month: dob_month,
            dob_year: dob_year,
            email: sanitisedEmail,
            url: url,
            about: about,
            interests: interests,
            matches: []
        }

        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitisedEmail, {
            expiresIn: 60 * 24,
        })
        res.status(201).json({ token, userId: generateduserId })
    } catch (err) {
        console.log(err)
    }
})

app.post('/login', async (req, res) => {
    const client = new MongoClient(uri);
    const { email, password } = req.body.formData;

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const user = await users.findOne({ email })
        const hashedPassword = user ? user.hashedPassword : null;

        // if (user) {
        bcrypt.compare(password, hashedPassword).then((match) => {
            if (user && match) {
                const token = jwt.sign(user, email, {
                    expiresIn: 60 * 24
                })
                res.status(201).json({ token, userId: user.user_id })
                return;
            }
            res.status(400).send('Invalid Credentials')
            return;
        }).catch(() => {
            res.status(400).send('Invalid Credentials')
            return;
        })

    } catch (err) {
        console.log(err)
    }

})

app.get('/matchedUsers', async (req, res) => {
    const client = new MongoClient(uri);
    const userIds = JSON.parse(req.query.userIds)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]
        const foundUsers = await users.aggregate(pipeline).toArray()
        res.send(foundUsers)
    } finally {
        await client.close()
    }
})

app.get('/users', async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } finally {
        await client.close()
    }
})

app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId ? req.query.userId : req.query.matchId

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        const user = await users.findOne(query)
        res.send(user)
    } finally {
        await client.close()
    }
})

app.put('/addmatch', async (req, res) => {
    const client = new MongoClient(uri)
    const { userId, matchedUserId } = req.body

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        const updateDocument = {
            $push: { matches: matchedUserId },
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
})

app.get('/messages', async (req, res) => {
    const client = new MongoClient(uri)
    const { userId, correspondingUserId } = req.query

    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')

        const query = {
            from_userId: userId, to_userId: correspondingUserId
        }

        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})

app.post('/message', async (req, res) => {
    const client = new MongoClient(uri)
    const message = req.body.message
    console.log(message)
    try {
        await client.connect()
        const database = client.db('app-data')
        const messages = database.collection('messages')
        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})

app.get('/', (req, res) => {
    res.json("Hello to my app")
})

app.listen(PORT, () => console.log("Server running on PORT " + PORT))