import Base from './BaseController'
// import qiniu from 'qiniu'
import path from 'path'
import fs from 'fs'
import formidable from 'formidable'
import articleModel from '../../models/admin/article'
import tagModel from '../../models/admin/tag'
import commentModel from '../../models/site/comment'

class Article extends Base {
  constructor () {
    super()
    this.thumbSave = this.thumbSave.bind(this)
  }

  async index (req, res, next) {
    let condition = req.body.condition
    let condition2 = req.body.condition2
    let condition3 = req.body.condition3
    let keywords = req.body.keywords
    let reg = new RegExp(keywords, 'i') // 模糊查询参数
    let all = {}
    if (condition === '1') {
      all['recovery'] = false
      if (condition2) {
        all['category'] = condition2
      }
      if (condition3) {
        all['tag'] = condition3
      }
      if (keywords) {
        all['$or'] = [{ 'title': reg }]
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
      if (keywords) {
        all['$or'] = [{ 'title': reg }]
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
      if (keywords) {
        all['$or'] = [{ 'title': reg }]
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
      if (keywords) {
        all['$or'] = [{ 'title': reg }]
      }
    }
    // console.log(all)
    let currentpage = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let row = (currentpage - 1) * limit
    let result = await articleModel.find(all).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    for (let i = 0; i < result.length; i++) {
      let commentNum = await commentModel.find({ aid: result[i].id })
      for (let j = 0; j < result[i].tag.length; j++) {
        let tag = await tagModel.find({ alias: result[i].tag[j] })
        // console.log(result[i].tag[j])
        result[i].tag[j] = tag
      }
      result[i].comment_num = commentNum.length
    }
    let count = await articleModel.countDocuments(all)
    if (result) {
      res.send({
        code: 0,
        articleList: result,
        total: count,
        message: 'ok'
      })
    }
  }

  async getOneArticle (req, res, next) {
    let result = await articleModel.findById(req.query._id)
    if (result) {
      res.send({
        code: 0,
        articleobj: result,
        message: 'ok'
      })
    }
  }

  async editOneArticle (req, res, next) {
    let result = await articleModel.findByIdAndUpdate(req.params.id, req.body)
    if (result) {
      res.send({
        code: 0,
        message: '文章修改成功'
      })
    }
  }
  async fakeDelArticle (req, res, next) {
    let id = req.query._id
    let result = await articleModel.findByIdAndUpdate(id, {recovery: true})
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

  async recoveryDelArticle (req, res, next) {
    let id = req.query._id
    let result = await articleModel.findByIdAndUpdate(id, { recovery: false })
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

  async delArticle (req, res, next) {
    let id = req.query._id
    let result = await articleModel.findById(id).lean()
    // console.log(result)
    let originurl = path.join(__dirname, '../../public' + result.imageUrl)
    fs.unlink(originurl, function (err) {
      if (err) {
        console.log(err)
      }
    })
    const result2 = await articleModel.remove({ _id: id })
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
    let result = await articleModel.create(req.body)
    if (result) {
      res.send({
        code: 0,
        message: 'ok'
      })
    }
  }

  async tagInsert (req, res, next) {
    try {
      let result = await tagModel.create(req.body)
      if (result) {
        res.send({
          code: 0,
          message: 'ok'
        })
      }
    } catch (error) {
      if (error.code === 11000) {
        res.send({
          code: -1,
          message: '名称或别名已存在'
        })
      }
    }
  }

  async getTaglist (req, res, next) {
    // console.log(req.query)
    let currentpage = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let row = (currentpage - 1) * limit
    let result = await tagModel.find().skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    let count = await tagModel.countDocuments()
    for (let i = 0; i < result.length; i++) {
      result[i].article_num = await articleModel.countDocuments({ tag: result[i].alias })
    }
    if (result) {
      res.send({
        code: 0,
        tagList: result,
        total: count,
        message: 'ok'
      })
    }
  }

  async getOneTag (req, res, next) {
    let result = await tagModel.findById(req.query._id)
    if (result) {
      res.send({
        code: 0,
        tagobj: result,
        message: 'ok'
      })
    }
  }

  async editOneTag (req, res, next) {
    let result = await tagModel.findByIdAndUpdate(req.params.id, req.body)
    if (result) {
      res.send({
        code: 0,
        message: '标签修改成功'
      })
    }
  }

  async delTag (req, res, next) {
    let id = req.query._id
    const result = await tagModel.remove({ _id: id })
    // console.log(result)
    if (parseInt(result.n) === 1) {
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
}

export default new Article()