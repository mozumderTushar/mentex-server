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
  console.log('db connected');


  app.post('/addProfessionalAppointment', (req, res) => { /** professional Appointments post from front end*/
    const appointment = req.body;
    professionalAppointmentCollection.insertOne(appointment)
      .then(result => {
        res.send(result)
      })
  });

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

  app.get('/allAppointment', (req, res) => { /** all appointment collection */
    professionalAppointmentCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/addAdmin', (req, res) => { /** add admin to server */
    const event = req.body;
    adminCollection.insertOne(event)
      .then(result => {
        console.log(result)
        res.send(result)
      })
  })

  app.post('/addExpert', (req, res) => { /** add expert to server */
    const event = req.body;
    expertsCollection.insertOne(event)
      .then(result => {
        console.log(result)
        res.send(result)
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

});


app.get('/', (req, res) => {
  res.send('Welcome to MenTex')
})

app.listen(process.env.PORT || port)