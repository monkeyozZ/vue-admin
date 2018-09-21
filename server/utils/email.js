/*
*
* 邮件模块
*
*/

const nodemailer = require('nodemailer')

let clientIsValid = false

const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  secure: true,
  port: 465,
  auth: {
    user: 'my@wowmonkey.cn',
    pass: 'Hbg19950616'
  }
})

const verifyClient = () => {
  transporter.verify((error, success) => {
    if (error) {
      clientIsValid = false
      console.warn('邮件客户端初始化连接失败，将在一小时后重试')
      setTimeout(verifyClient, 1000 * 60 * 60)
    } else {
      clientIsValid = true
      console.log('邮件客户端初始化连接成功，随时可发送邮件')
    }
  })
}

verifyClient()

let mailOptions = {
  to: '1316438321@qq.com',
  subject: 'test',
  text: `来自的回复`
  /* html: `<p>哈哈哈</p>` */
}

const sendMail = mailOptions => {
  if (!clientIsValid) {
    console.warn('由于未初始化成功，邮件客户端发送被拒绝')
    return false
  }
  mailOptions.from = '"Monkey" <my@wowmonkey.cn>'
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.warn('邮件发送失败', error)
    } else {
      console.log('邮件发送成功', info.messageId, info.response)
    }
  })
}
setTimeout(() => {
  sendMail(mailOptions)
}, 1000)
exports.sendMail = sendMail
exports.nodemailer = nodemailer
exports.transporter = transporter
