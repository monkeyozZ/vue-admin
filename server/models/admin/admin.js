import mongoose from 'mongoose'
const Schema = mongoose.Schema
const userInfo = new Schema({
  username: String,
  password: String,
  mobile: String
})

// mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens
const adminModel = mongoose.model('admin', userInfo)

export default adminModel