const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PoolSchema = new Schema(
  {
    poolMember: String,
    poolMemberPairee: String,
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
  }
)

module.exports = mongoose.model('Pool', PoolSchema)
