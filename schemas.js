const mongoose = require('mongoose')
const {Schema} = mongoose
  
  const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    count: Number,
    log: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }],
      default: []
    }
  })

  const exerciseSchema = new Schema({
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    dateObj: {
      type: Date,
      required: true
    },
    date: String
  })

  userSchema.pre('save', function(next){
    this.count = this.log.length
    next()
  })
  exerciseSchema.pre('save', function(next){
    this.date = this.dateObj.toDateString()
    next()
  })
  
  module.exports.User = mongoose.model("User", userSchema)
  module.exports.Exercise = mongoose.model("Exercise", exerciseSchema)