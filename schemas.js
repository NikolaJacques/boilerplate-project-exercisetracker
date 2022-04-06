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
    username: {
      type: SchemaTypes.ObjectId,
      ref: "User"
    },
    count: {
        type: Number,
        default: function(){
            return this.log.length
        }
    },
    _id: {
      type: String,
      required: true
    },
    log: [{
      type: SchemaTypes.ObjectId,
      ref: "Exercise"
   }]
  })
  
  module.exports.User = mongoose.model("User", userSchema)
  module.exports.Exercise = mongoose.model("Exercise", exerciseSchema)
  module.exports.Log = mongoose.model("Log", logSchema)