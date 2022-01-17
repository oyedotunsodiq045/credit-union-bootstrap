const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
// const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet');
// const xss = require('xss-clean');
const rateLimit = require('express-rate-limit')
// const hpp = require('hpp');
// const cors = require('cors');
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

// Route files
const auth = require('./routes/auth')
const users = require('./routes/users')
const pools = require('./routes/pools')
const receipts = require('./routes/receipts')

// Load env vars
dotenv.config({
  path: './config/config.env',
})

// Connect DB
connectDB()

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))
}

// File uploading
app.use(fileupload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/pools', pools)
app.use('/api/v1/receipts', receipts)

app.use(errorHandler)

const PORT = process.env.PORT || 6000

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow
      .bold
  )
)

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`.red)
  // Close server and exit process
  server.close(() => process.exit(1))
})
