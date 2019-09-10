import Base from './BaseController'
// import qiniu from 'qiniu'
import path from 'path'
import fs from 'fs'
import formidable from 'formidable'
import timeModel from '../../models/admin/time'

class TimeLine extends Base {
  constructor () {
    super()
    this.thumbSave = this.thumbSave.bind(this)
  }

  async index (req, res, next) {
    let condition = req.body.condition
    let condition2 = req.body.condition2
    let condition3 = req.body.condition3
    let all = {}
    if (condition === '1') {
      all['recovery'] = false
      if (condition2) {
        all['category'] = condition2
      }
      if (condition3) {
        all['tag'] = condition3
      }
    }

    if (condition === '2') {
      all['recovery'] = false
      all['status'] = true
      if (condition2) {
        all['category'] = condition2
      }
      if (condition3) {
        all['tag'] = condition3
      }
    }

    if (condition === '3') {
      all['recovery'] = false
      all['status'] = false
      if (condition2) {
        all['category'] = condition2
      }
      if (condition3) {
        all['tag'] = condition3
      }
    }

    if (condition === '4') {
      all['recovery'] = true
      if (condition2) {
        all['category'] = condition2
      }
      if (condition3) {
        all['tag'] = condition3
      }
    }
    let currentpage = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let row = (currentpage - 1) * limit
    let result = await timeModel.find(all).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    let count = await timeModel.countDocuments()
    if (result) {
      res.send({
        code: 0,
        timeLineList: result,
        total: count,
        message: 'ok'
      })
    }
  }

  async getOneTimeLine (req, res, next) {
    let result = await timeModel.findById(req.query._id)
    if (result) {
      res.send({
        code: 0,
        timeObj: result,
        message: 'ok'
      })
    }
  }

  async editOneTimeLine (req, res, next) {
    let result = await timeModel.findByIdAndUpdate(req.params.id, req.body)
    if (result) {
      res.send({
        code: 0,
        message: '修改成功'
      })
    }
  }
  async fakeDelTimeLine (req, res, next) {
    let id = req.query._id
    let result = await timeModel.findByIdAndUpdate(id, { recovery: true })
    if (result) {
      res.send({
        code: 0,
        message: '该记录已加入回收站'
      })
    } else {
      res.send({
        code: -1,
        message: '加入回收站失败'
      })
    }
  }

  async recoveryDelTimeLine (req, res, next) {
    let id = req.query._id
    let result = await timeModel.findByIdAndUpdate(id, { recovery: false })
    if (result) {
      res.send({
        code: 0,
        message: '该记录已恢复'
      })
    } else {
      res.send({
        code: -1,
        message: '该记录恢复失败'
      })
    }
  }

  async delTimeLine (req, res, next) {
    let id = req.query._id
    let result = await timeModel.findById(id).lean()
    // console.log(result)
    if (result.imageUrl) {
      let originurl = path.join(__dirname, '../../public' + result.imageUrl)
      fs.unlink(originurl, function (err) {
        if (err) {
          console.log(err)
        }
      })
    }
    const result2 = await timeModel.remove({ _id: id })
    // console.log(result)
    if (parseInt(result2.n) === 1) {
      res.send({
        code: 0,
        message: '删除成功'
      })
    } else {
      res.send({
        code: -1,
        message: '删除失败'
      })
    }
  }

  async thumbSave (req, res, next) {
    let form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../../public/Upload/thumb_img')
    form.parse(req, async (err, fields, files) => {
      if (!err) {
        if (files) {
          // console.log(files)
          let oldname = files.file.path
          let newname = files.file.path + path.extname(files.file.name)
          await fs.rename(oldname, newname, err => {
            if (err) {
              console.log(err)
            } else {
              if (fields.imageUrl) {
                let originurl = path.join(__dirname, '../../public' + fields.imageUrl)
                fs.unlink(originurl, function (err) {
                  if (err) {
                    console.log(err)
                  }
                })
              }
              let arr = newname.split('\\')
              let l = arr.length
              let imgurl = '/' + arr[l - 3] + '/' + arr[l - 2] + '/' + arr[l - 1]
              res.send({
                code: 0,
                imageUrl: imgurl,
                message: 'ok'
              })
            }
          })
        }
      } else {
        console.log(err)
      }
    })
  }

  async contentimg (req, res, next) {
    let form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../../public/Upload/content_img')
    form.parse(req, async (err, fields, files) => {
      if (!err) {
        if (files) {
          // console.log(files)
          let oldname = files.image.path
          let newname = files.image.path + path.extname(files.image.name)
          await fs.rename(oldname, newname, err => {
            if (err) {
              console.log(err)
            } else {
              let arr = newname.split('\\')
              let l = arr.length
              let imgurl = '/' + arr[l - 3] + '/' + arr[l - 2] + '/' + arr[l - 1]
              res.send({
                code: 0,
                imageUrl: imgurl,
                message: 'ok'
              })
            }
          })
        }
      } else {
        console.log(err)
      }
    })
  }

  async delcontentimg (req, res, next) {
    // console.log(req.body)
    if (req.body.url) {
      let originurl = path.join(__dirname, '../../public' + req.body.url)
      // console.log(originurl)
      fs.unlink(originurl, function (err) {
        if (err) {
          console.log(err)
        } else {
          res.send({
            code: 0,
            message: '删除成功'
          })
        }
      })
    }
  }

  async insert (req, res, next) {
    // console.log(req.body)
    let result = await timeModel.create(req.body)
    if (result) {
      res.send({
        code: 0,
        message: 'ok'
      })
    }
  }
}

export default new TimeLine()