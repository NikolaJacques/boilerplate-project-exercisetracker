const mongoose = require('mongoose')
const {Schema} = mongoose
  
  const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: {
      type: String,
      required: true
    },
    count: {
        type: Number
    },
    log: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
      default: []
    }
  })

  const exerciseSchema = new Schema({
    _id: Schema.Types.ObjectId,
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

  userSchema.pre('save', function(next){
      this.count = this.log.length
      next()
  })
  
  module.exports.User = mongoose.model("User", userSchema)
  module.exports.Exercise = mongoose.model("Exercise", exerciseSchema)