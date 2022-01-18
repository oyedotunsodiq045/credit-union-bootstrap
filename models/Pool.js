const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PoolSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    userRef: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

module.exports = mongoose.model('Pool', PoolSchema)
