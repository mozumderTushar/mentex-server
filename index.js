const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jos17.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const professionalAppointmentCollection = client.db("mentex").collection("professionalAppointments");
  const expertsCollection = client.db("mentex").collection("experts");
  const adminCollection = client.db("mentex").collection("admins");
  const userCollection = client.db("mentex").collection("user");
  const prescriptionCollection = client.db("mentex").collection("prescription");
  const postCollection = client.db("mentex").collection("post");
  console.log('db connected');


  app.post('/addProfessionalAppointment', (req, res) => { /** professional Appointments post from front end*/
    const appointment = req.body;
    professionalAppointmentCollection.insertOne(appointment)
      .then(result => {
        res.send(result)
      })
  });

  app.post('/addPrescription', (req, res) => { /** prescription post from front end*/
    const prescription = req.body;
    prescriptionCollection.insertOne(prescription)
      .then(result => {
        res.send(result)
      })
  });

  app.post('/addAdmin', (req, res) => { /** add admin to server */
    const event = req.body;
    adminCollection.insertOne(event)
      .then(result => {
        res.send(result)
      })
  })

  app.post('/addExpert', (req, res) => { /** add expert to server */
    const event = req.body;
    expertsCollection.insertOne(event)
      .then(result => {
        res.send(result)
      })
  })

  app.post('/addPost', (req, res) => { /** add post to server */
    const event = req.body;
    postCollection.insertOne(event)
      .then(result => {
        res.send(result)
      })
  })

  app.get('/allExperts', (req, res) => { /** all experts collection */
    expertsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });

  app.get('/allUser', (req, res) => { /** all user collection */
    userCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });

  app.get('/allAdmins', (req, res) => { /** all admin collection */
    adminCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/Admin/:id', (req, res) => { /** single admin collection */
    adminCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/Expert/:id', (req, res) => { /** single expert collection */
    expertsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/allAppointment', (req, res) => { /** all appointment collection */
    professionalAppointmentCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/allPrescription', (req, res) => { /** all Prescription collection */
    prescriptionCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/allPost', (req, res) => { /** all post collection */
    postCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.delete('/deleteAdmin/:id', (req, res) => { /**  delete admin from server */
    adminCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

  app.delete('/deleteExpert/:id', (req, res) => { /**  delete expert from server */
    expertsCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

  app.delete('/deletePost/:id', (req, res) => { /**  delete post from server */
    postCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

  app.put('/AdminUpdate/:id', (req, res) => { /**  update admin info */
    adminCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: {
          fullName: req.body.fullName,
          email: req.body.email,
          mobile: req.body.mobile,
          gender: req.body.gender,
          age: req.body.age
        },
        $currentDate: { lastModified: true }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })

  app.put('/ExpertUpdate/:id', (req, res) => { /**  update expert info */
    expertsCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: {
          fullName: req.body.fullName,
          email: req.body.email,
          mobile: req.body.mobile,
          occupation: req.body.occupation,
          gender: req.body.gender,
          details: req.body.details,
          img: req.body.img,
        },
        $currentDate: { lastModified: true }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })

});


app.get('/', (req, res) => {
  res.send('Welcome to MenTex')
})

app.listen(process.env.PORT || port)