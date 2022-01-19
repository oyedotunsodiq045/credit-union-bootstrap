const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const Schema = mongoose.Schema

var connection = mongoose.createConnection('mongodb://localhost/shopify')
autoIncrement.initialize(connection)

const PaymentSchema = new Schema(
  {
    forMonth: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    modeOfPayment: {
      // Array of Strings
      type: [String],
      required: true,
      enum: [
        'Direct Deposit',
        'Cash',
        'Check',
        'Money Order',
        'Debit Card',
        'Credit Card',
      ],
    },
    receiptNumber: {
      type: Number,
      required: [true, 'Please add a receipt number'],
      unique: true,
    },
    photo: {
      type: String,
      default: 'no-photo.jpg',
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

module.exports = mongoose.model('Payment', PaymentSchema)
