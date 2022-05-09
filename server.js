const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const schemas = require('./schemas');
const {User, Exercise} = schemas

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// parser middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// solution

// database

mongoose.connect(
  process.env.MONGO_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true }, 
  () => {console.log('Connection to DB successful')}, 
  error => console.log(error.message)
);

const createAndSaveUser = async (userNameString) => {
  const user = new User ({
    username : userNameString
  })
  await user.save()
  return {
    _id: user._id, 
    username: user.username  
  }
}

const updateUser = async (id, description, duration, date) => {
  User.findOne({_id: id}, (error, user) => {
    if (error) {
      throw new Error(error)
    }
    const exercise = new Exercise ({
      description,
      duration,
      dateObj:date
    })
    await exercise.save()
    await user.log.push(exercise._id)
    await user.save()
    return {
      username: user.username, 
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
      _id: user._id
    }
  })
}

const getAllUsers = async () => {
  const users = await User.find({})
  return users
}

// handlers

app
  .post('/api/users', async (req, res) => {
    try {
      const user = await createAndSaveUser(req.body.username)
      res.json(user)
    }
    catch (error) {
      res.json(error.message)
    }
  })
  .get('/api/users', async (req, res) => {
    try {
      const users = await getAllUsers()
      res.json(users)
    }
    catch (error) {
      res.json(error.message)
    }   
  })
  .post('/api/users/:id/exercises', async (req, res) => {
    try {
      const {_id, description, duration, date} = req.body
      const validatedDate = new Date(!date?'':date)
      const exercise = await updateUser(_id, description, parseInt(duration), validatedDate)
      res.json(exercise)
    }
    catch (error) {
      res.json(error.message)
    }
  })
  .get('/api/users/:id/logs', async (req, res) => {
    try {
      const populateObj = {
        path: 'log',
        select: '-dateObj -_id -__v'
      }
      // add filtering options from query, if applicable
      if (req.query.from){
        const match = {}
        if(req.query.to){
          match.dateObj = {$gte:new Date(req.query.from), $lte:new Date(req.query.to)}
        } else {
          match.dateObj = {$gte:new Date(req.query.from)}
        }
        populateObj.match = match
      }
      if (req.query.limit){
        populateObj.options = { limit: req.query.limit }
      }
      // get user and populate log
      const user = await User
        .findOne({"_id": req.params.id}, '-__v')
        .populate(populateObj)
      // return user
      res.json(user)
    }
    catch (error) {
      res.json(error.message)
    }
  })



  