const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const schemas = require('./schemas')
const {User} = schemas

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
  const {_id, username} = user
  return {
    _id: _id, 
    username: username  
  }
}

const updateUser = async (id, description, duration, date) => {
  const user = await User.findOne({_id: id})
  const exercise = {
    description,
    duration,
    date
  }
  await user.log.push(exercise)
  await user.save()
  return {username: user.username, ...exercise, _id: user._id}
}

const getAllUsers = async () => {
  const users = await User.find({})
  return users
}

const filterLogs = (logs, params) => {
  return logs
    // from filter
    .filter( (log) => {
      if (!params.from) {
        return log
      } else {
        if (new Date(logs.date) >= new Date(params.from)){
          return log
        }
      }
    })
    // to filter
    .filter( (log) => { 
      if (!params.to) {
        return log
      } else {
        if (new Date(logs.date) <= new Date(params.to)){
          return log
        }
      }
    })
    // limit filter
    .filter( (log, index) => {
      if (!params.limit) {
        return log
      } else {
        if (index < params.limit) {
          return log
        }
      }
    })
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
      const validatedDate = new Date(!date?'':date).toDateString()
      const exercise = await updateUser(_id, description, parseInt(duration), validatedDate)
      res.json(exercise)
    }
    catch (error) {
      res.json(error.message)
    }
  })
  .get('/api/users/:id', async (req,res) => {
    try {
      const user = await User.findOne({_id: req.params.id})
      res.json(user)
    }
    catch (error) {
      res.json(error.message)
    }
  })
  .get('/api/users/:id/logs', async (req, res) => {
    try {
      const user = await User.findOne({"_id": req.params.id}).select('-__v')
      res.json(user)
      /* if (Object.keys(req.query).length) {
        res.json(user)
      } else {
        res.json({
          ...user,
          log: filterLogs(user.log, req.query)
        })
      } */
    }
    catch (error) {
      res.json(error.message)
    }
  })



  