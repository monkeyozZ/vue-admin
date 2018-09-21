import router from './routes/index.js'
import mongodb from './config/db'

// 连接数据库
mongodb()

// var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var history = require('connect-history-api-fallback')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(history())
app.use(express.static(path.join(__dirname, 'public')))

// session
app.use(session({
  secret: 'monkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://172.16.0.90:8888')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  // res.header('Content-Type', '*')
  // OPTIONS
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return false
  }
  next()
})
router(app)

// catch 404 and forward to error handler
/* app.use(function (req, res, next) {
  next(createError(404))
}) */

// 404
app.all('*', (req, res) => {
  res.status(404).jsonp({
    code: 0,
    message: '无效的API请求'
  })
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
