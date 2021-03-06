// https://www.npmjs.com/package/mongoose-auto-increment
const crypto = require('crypto')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const autoIncrement = require('mongoose-auto-increment')

const connection = mongoose.createConnection('mongodb://localhost/creditunion')
autoIncrement.initialize(connection)

const UserSchema = new Schema(
  {
    sequence: {
      type: Number,
      required: [true, 'Please add a user sequence'],
      unique: true,
    },
    firstname: {
      type: String,
      trim: true,
      required: [true, 'Please add a firstname'],
      minlength: [2, 'firstname must be at least two characters'],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, 'Please add a lastname'],
      minlength: [2, 'lastname must be at least two characters'],
    },
    username: {
      type: String,
      trim: true,
      required: [true, 'Please add a username'],
      unique: [true, 'Username is already taken'],
      minlength: [2, 'Username must be at least two characters'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please add an email'],
      unique: [true, 'Email is already registered'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // what this will do is when we get a user through our API it's not going to show the password
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    role: {
      type: String,
      trim: true,
      enum: ['user', 'marketer', 'account', 'audit', 'legal'],
      default: 'user',
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    poolMonthNumber: {
      type: Number,
      // required: [true, 'Please add a pool month number'],
    },
    poolMonth: {
      type: String,
      // required: [true, 'Please add a pool month'],
    },
    poolPaireeMonthNumber: {
      type: Number,
      // required: [true, 'Please add a pool pairee month number'],
    },
    poolPaireeMonth: {
      type: String,
      // required: [true, 'Please add a pool pairee month'],
    },
    userCommunityNumber: {
      type: Number,
      // required: [true, 'Please add a pool pairee month number'],
    },
    communityId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Community',
      // required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
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

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'sequence',
  startAt: 1,
  incrementBy: 1,
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  )
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

// Reverse populate with virtuals
UserSchema.virtual('communities', {
  ref: 'Community',
  localField: '_id',
  foreignField: 'userRef',
  justOne: false,
})

// Reverse populate with virtuals
UserSchema.virtual('pools', {
  ref: 'Pool',
  localField: '_id',
  foreignField: 'userRef',
  justOne: false,
})

// Reverse populate with virtuals
UserSchema.virtual('receipts', {
  ref: 'Receipt',
  localField: '_id',
  foreignField: 'userRef',
  justOne: false,
})

module.exports = mongoose.model('User', UserSchema)
