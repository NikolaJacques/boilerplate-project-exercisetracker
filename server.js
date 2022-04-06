const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const schemas = require('./schemas')
const {User, Exercise, Log} = schemas

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

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
  return user
}

const getAllUsers = async () => {
  const users = await User.find()
  return users
}

// handlers

app
  .post('/api/users', async (req, res) => {
    try {
      const user = await createAndSaveUser(req.username)
      res.json(user)
    }
    catch (error) {
      console.log(error.message)
    }
  })
  .get('api/users', async (req, res) => {
    try {
      const users = await getAllUsers()
      res.json(users)
    }
    catch (error) {
      console.log(error.message)
    }
  })
  .post('/api/users/:id/exercises', async (req, res) => {

  })
  