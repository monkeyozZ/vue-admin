import mongoose from 'mongoose'
const autoIncrement = require('mongoose-auto-increment')
// 自增ID初始化
autoIncrement.initialize(mongoose.connection)
const Schema = mongoose.Schema
const comment = new Schema({
  name: String,
  email: String,
  content: String,
  aid: String,
  like: { type: String, default: 0 },
  pid: { type: String, default: 0 },
  creat_time: { type: String, default: Date.now }
})

comment.plugin(autoIncrement.plugin, {
  model: 'comment',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens
const commentModel = mongoose.model('comment', comment)

export default commentModel