import mongoose from 'mongoose'
const Schema = mongoose.Schema
const tag = new Schema({
  name: { type: String, unique: true },
  alias: { type: String, unique: true },
  creat_time: { type: String, default: Date.now }
})

// mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens
const tagModel = mongoose.model('tag', tag)

export default tagModel