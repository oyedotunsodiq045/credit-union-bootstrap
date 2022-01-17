const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReceiptSchema = new Schema(
  {
    receiptNumber: {
      type: Number,
      required: [true, 'Please add a receipt number'],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    modeOfPayment: {
      // Array of Strings
      type: [String],
      required: true,
      enum: ['Direct Deposit', 'Cash', 'Check', 'Money Order', 'Debit Card'],
    },
    userRef: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Receipt', ReceiptSchema)
