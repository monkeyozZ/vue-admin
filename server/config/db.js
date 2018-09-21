import mongoose from 'mongoose'
const dbUrl = 'mongodb://localhost:27017/blog'
mongoose.connect(dbUrl, { useNewUrlParser: true })

module.exports = () => {
  const db = mongoose.connection
  db.on('error', console.error.bind(console, '数据库连接错误：'))

  db.once('open', () => {
    console.log('MongoDB连接成功！！')
  })
  db.on('close', function () {
    console.log('数据库断开，重新连接数据库')
    mongoose.connect(dbUrl, { server: { auto_reconnect: true }, useNewUrlParser: true })
  })

  return db
}
