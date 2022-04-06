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

const createAndSaveExercise = async (id, description, duration, date) => {
  const exercise = new Exercise ({
    _id: id,
    description,
    duration,
    date
  })
  await exercise.populate({path: "username", select: {username: 1}})
  await exercise.save()
  return exercise
}

const updateLogs = async (exercise) => {
  let log = await Log.findOne({'_id': exercise._id})
  if (!log) {
    let exercises = await Exercise.find({'_id': exercise._id}).select({'username': -1, '_id': -1})
    log = await new Log({
      _id: exercise._id,
      log: exercises
    })
    await log.populate({path: "username", select: {username: 1}})
    await log.save()
  } else {
    const {description, duration, date} = exercise
    log.log.append({
      description: description,
      duration: duration,
      date: date
    })
    await log.save()
  }
}

const getAllUsers = async () => {
  const users = await User.find()
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
    try {
      const {_id, description, duration, date} = req.body
      const validatedDate = !date?new Date().toDateString():date
      const exercise = await createAndSaveExercise(_id, description, duration, validatedDate)
      await updateLogs(exercise)
      res.json(exercise)
    }
    catch (error) {
      console.log(error.message)
    }
  })
  