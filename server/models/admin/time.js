import mongoose from 'mongoose'
require('mongoose-long')(mongoose)

var SchemaTypes = mongoose.Schema.Types

const Schema = mongoose.Schema
const timeline = new Schema({
  content: String,
  imageUrl: String,
  status: Boolean,
  recovery: { type: Boolean, default: false },
  creat_time: { type: SchemaTypes.Long, default: Date.now }
})

// mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens
const timelineModel = mongoose.model('timeline', timeline)

export default timelineModel