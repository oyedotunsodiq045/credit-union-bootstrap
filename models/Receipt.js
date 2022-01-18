const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const Schema = mongoose.Schema

var connection = mongoose.createConnection('mongodb://localhost/shopify')
autoIncrement.initialize(connection)

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

ReceiptSchema.plugin(autoIncrement.plugin, {
  model: 'Receipt',
  field: 'receiptNumber',
  startAt: 1,
  incrementBy: 1,
})

module.exports = mongoose.model('Receipt', ReceiptSchema)
