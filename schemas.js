const mongoose = require('mongoose')
const {Schema, SchemaTypes} = mongoose

const userSchema = new Schema({
    username: {
      type: String,
      required: true
    }
  })
  
  const exerciseSchema = new Schema({
    username: {
      type: SchemaTypes.ObjectId,
      ref: "User"
    },
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
    },
    _id: {
      type: String,
      required: true
    }
  })

  const logSchema = new Schema({
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
  
  const userLogSchema = new Schema({
    username: {
      type: SchemaTypes.ObjectId,
      ref: "User"
    },
    count: {
        type: Number
    },
    _id: {
      type: String,
      required: true
    },
    log: [logSchema]
  })

  userLogSchema.pre('save', function(next){
      this.count = this.log.length
      next()
  })
  
  module.exports.User = mongoose.model("User", userSchema)
  module.exports.Exercise = mongoose.model("Exercise", exerciseSchema)
  module.exports.Log = mongoose.model("Log", userLogSchema)