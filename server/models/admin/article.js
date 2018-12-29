import mongoose from 'mongoose'
const autoIncrement = require('mongoose-auto-increment')
require('mongoose-long')(mongoose)

var SchemaTypes = mongoose.Schema.Types

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)
const Schema = mongoose.Schema
const article = new Schema({
  title: String,
  keywords: String,
  des: String,
  category: Array,
  tag: Array,
  content: String,
  origin: String,
  status: Boolean,
  open: Boolean,
  imageUrl: String,
  view: { type: String, default: 0 },
  like: { type: String, default: 0 },
  recovery: { type: Boolean, default: false },
  creat_time: { type: SchemaTypes.Long, default: Date.now }
})

article.plugin(autoIncrement.plugin, {
  model: 'article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens
const articleModel = mongoose.model('article', article)

export default articleModel