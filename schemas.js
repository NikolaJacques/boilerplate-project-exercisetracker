const mongoose = require('mongoose')
const {Schema} = mongoose
  
  const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    count: {
        type: Number
    },
    log: {
      type: [
        {
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
      }
    ],
      default: []
    }
  })

  userSchema.pre('save', function(next){
      this.count = this.log.length
      next()
  })
  
  module.exports.User = mongoose.model("User", userSchema)