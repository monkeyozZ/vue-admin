import Base from './BaseController'
import md5 from 'md5'
import Adminmodel from '../../models/admin/admin'

class Login extends Base {
  constructor () {
    super()
    this.login = this.login.bind(this)
  }

  async adminlogin (req, res, next) {
    console.log(111)
    next()
  }
  async login (req, res, next) {
    try {
      if (Object.keys(req.body).length !== 0) {
        const username = req.body.username
        const password = req.body.password
        // console.log(req.body)
        if (username) {
          let result = await Adminmodel.findOne({username})
          if (result) {
            if (md5(password) === result.password) {
              req.session.user_id = result._id
              res.send({
                status: 200,
                _id: result._id,
                message: '登录成功'
              })
            } else {
              res.send({
                status: -100,
                message: '用户名或密码错误'
              })
            }
          } else {
            res.send({
              status: -200,
              message: '用户名或密码错误'
            })
          }
        }
      }
    } catch (err) {
      console.log(err.message, err)
      res.send({
        status: -300,
        message: err.message
      })
    }
  }

  async loginout (req, res, next) {
    req.session.destroy((err) => {
      if (!err) {
        res.send({
          status: 200,
          message: '退出登录成功'
        })
      }
    })
  }
}

export default new Login()