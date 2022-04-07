const mongoose = require('mongoose')
const {Schema} = mongoose

  const exerciseSchema = new Schema({
      description: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      date: {
        type: String,
        required: true
      }
  })
  
  const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    count: {
        type: Number
    },
    _id: {
      type: String,
      required: true
    },
    log: [exerciseSchema]
  })

  userSchema.pre('save', function(next){
      this.count = this.log.length
      next()
  })
  
  module.exports.User = mongoose.model("User", userSchema)