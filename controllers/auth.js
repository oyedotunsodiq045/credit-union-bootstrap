const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const Community = require('../models/Community')
const sendEmail = require('../utils/sendEmail')
// const { clearKey } = require('../middleware/cache')

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, username, email, password, phone } = req.body

  let userCommunityNumber, communityId, communityNumber, communityName
  const communityModulo = 12
  let query = await User.findOne()
  if (query) {
    const userExist = await User.findOne({ username, email })

    if (userExist) {
      return next(new ErrorResponse(`User already exist`, 404))
    }
    // there is user
    console.log('there is user')
    // refactor using object destructuring later
    console.log(query)
    console.log(query.sequence)
    // console.log(query.communityId)
    userCommunityNumber = query.userCommunityNumber
    communityId = query.communityId
    let existingUser
    // create another community
    if (query.sequence % communityModulo == 1) {
      // if (
      //   query.userCommunityNumber != 1 &&
      //   query.sequence % communityModulo == 1
      // ) {
      // printing another communityId
      console.log('printing another communityId')
      // add 1 to community
      communityNumber = userCommunityNumber + 1
      communityName = 'Community ' + communityNumber
      userCommunityNumber = communityNumber
      console.log('create a new community')
      communityId = await Community.create({
        communityNumber,
        communityName,
      })
      communityId = communityId._id

      console.log('there is user userCommunityNumber', userCommunityNumber)
      console.log('there is user communityId', communityId)
      // Create user
      console.log('creating user')
      existingUser = await User.create({
        firstname,
        lastname,
        username,
        email,
        password,
        phone,
        userCommunityNumber,
        communityId,
      })
    } else {
      console.log('there is user userCommunityNumber', userCommunityNumber)
      console.log('there is user communityId', communityId)
      // Create user
      console.log('creating user')
      existingUser = await User.create({
        firstname,
        lastname,
        username,
        email,
        password,
        phone,
        userCommunityNumber,
        communityId,
      })
    }

    //   console.log(user)
    console.log(existingUser.sequence)
    let sequence = existingUser.sequence

    console.log('fetching sequence')
    // get registered user sequence
    //   const sequence = await User.findOne({ username, email }).select('sequence')
    console.log(sequence)

    // Start Assign User poolMonthNumber, poolMonth, poolPaireeMonthNumber, poolPaireeMonth
    let poolMonthNumber, poolMonth, poolPaireeMonthNumber, poolPaireeMonth
    const monthModulo = 6

    // Reformat to Switch Case
    if (sequence % monthModulo == 1) {
      poolMonth = 'January'
      poolMonthNumber = 1
      poolPaireeMonth = 'July'
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
    } else if (sequence % monthModulo == 2) {
      poolMonth = 'February'
      poolMonthNumber = 2
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'August'
    } else if (sequence % monthModulo == 3) {
      poolMonth = 'March'
      poolMonthNumber = 3
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'September'
    } else if (sequence % monthModulo == 4) {
      poolMonth = 'April'
      poolMonthNumber = 4
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'October'
    } else if (sequence % monthModulo == 5) {
      poolMonth = 'May'
      poolMonthNumber = 5
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'November'
    } else {
      poolMonth = 'June'
      poolMonthNumber = 6
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'December'
    }

    // Update other User details
    existingUser.poolMonthNumber = poolMonthNumber
    existingUser.poolMonth = poolMonth
    existingUser.poolPaireeMonthNumber = poolPaireeMonthNumber
    existingUser.poolPaireeMonth = poolPaireeMonth
    await existingUser.save()
    console.log(existingUser)
    // End Assign User poolMonthNumber, poolMonth, poolPaireeMonthNumber, poolPaireeMonth

    //   clearKey(User.collection.collectionName)

    sendTokenResponse(existingUser, 200, res)
  } else {
    // there is no user
    console.log('there is no user')
    communityNumber = 1
    userCommunityNumber = communityNumber
    communityName = 'Community ' + communityNumber
    communityId = await Community.create({
      communityNumber,
      communityName,
    })
    // printing new communityId
    console.log('printing new communityId')
    console.log(communityId)

    // Create user
    console.log('creating user')
    const noExistingUser = await User.create({
      firstname,
      lastname,
      username,
      email,
      password,
      phone,
      userCommunityNumber,
    })
    // Update communityId in user
    noExistingUser.communityId = communityId
    await noExistingUser.save()

    //   console.log(user)
    console.log(noExistingUser.sequence)
    let sequence = noExistingUser.sequence

    console.log('fetching sequence')
    // get registered user sequence
    //   const sequence = await User.findOne({ username, email }).select('sequence')
    console.log(sequence)

    // Start Assign User poolMonthNumber, poolMonth, poolPaireeMonthNumber, poolPaireeMonth
    let poolMonthNumber, poolMonth, poolPaireeMonthNumber, poolPaireeMonth
    const monthModulo = 6

    // Reformat to Switch Case
    if (sequence % monthModulo == 1) {
      poolMonth = 'January'
      poolMonthNumber = 1
      poolPaireeMonth = 'July'
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
    } else if (sequence % monthModulo == 2) {
      poolMonth = 'February'
      poolMonthNumber = 2
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'August'
    } else if (sequence % monthModulo == 3) {
      poolMonth = 'March'
      poolMonthNumber = 3
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'September'
    } else if (sequence % monthModulo == 4) {
      poolMonth = 'April'
      poolMonthNumber = 4
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'October'
    } else if (sequence % monthModulo == 5) {
      poolMonth = 'May'
      poolMonthNumber = 5
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'November'
    } else {
      poolMonth = 'June'
      poolMonthNumber = 6
      poolPaireeMonthNumber = poolMonthNumber + monthModulo
      poolPaireeMonth = 'December'
    }

    // Update other User details
    noExistingUser.poolMonthNumber = poolMonthNumber
    noExistingUser.poolMonth = poolMonth
    noExistingUser.poolPaireeMonthNumber = poolPaireeMonthNumber
    noExistingUser.poolPaireeMonth = poolPaireeMonth
    await noExistingUser.save()
    console.log(noExistingUser)
    // End Assign User poolMonthNumber, poolMonth, poolPaireeMonthNumber, poolPaireeMonth

    //   clearKey(User.collection.collectionName)

    sendTokenResponse(noExistingUser, 200, res)
  }
})

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  })

  if (!user) {
    return next(new ErrorResponse(`There is no user with that email`, 404))
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({
    validateBeforeSave: false,
  })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You're receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    })

    res.status(200).json({
      success: true,
      data: 'Email sent',
    })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({
      validateBeforeSave: false,
    })

    return next(new ErrorResponse(`Email could not be sent`, 500))
  }
})

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  })

  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400))
  }

  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  sendTokenResponse(user, 200, res)
})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Private
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body

  // Validate username & login
  if (!username || !password) {
    return next(
      new ErrorResponse(`Please provide a username and password`, 400)
    )
  }

  // Check for user
  const user = await User.findOne({
    username,
  }).select('+password')

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401))
  }

  // Check if password match
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401))
  }

  sendTokenResponse(user, 200, res)
})

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate([
      {
        path: 'community',
        select: 'communityNumber communityName',
      },
    ])
    .cache({
      time: 10,
    })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(`Password is incorrect`, 401))
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV == 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    // user: user,
    token,
  })
}
