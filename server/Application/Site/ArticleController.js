import Base from './BaseController'
import articleModel from '../../models/admin/article'
import tagModel from '../../models/admin/tag'
import commentModel from '../../models/site/comment'

class Article extends Base {
  constructor () {
    super()
    this.getArticleList = this.getArticleList.bind(this)
  }

  async getArticleList (req, res, next) {
    let currentpage = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let row = (currentpage - 1) * limit
    let result = await articleModel.find(req.body).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    for (let i = 0; i < result.length; i++) {
      let aid = result[i].id
      let num = await commentModel.find({ aid: aid, pid: 0 }).lean()
      result[i].comment_num = num.length
    }
    if (result) {
      res.send({
        code: 0,
        articleList: result,
        message: 'ok'
      })
    }
  }

  async getTagList (req, res, next) {
    let result = await tagModel.find().sort({ creat_time: -1 }).lean()
    for (let i = 0; i < result.length; i++) {
      result[i].article_num = await articleModel.countDocuments({ tag: result[i].alias })
    }
    if (result) {
      res.send({
        code: 0,
        tagList: result,
        message: 'ok'
      })
    }
  }

  async getArticleDetails (req, res, next) {
    let id = req.body.id
    let result = await articleModel.find({id: id}).lean()
    if (result.length !== 0) {
      let view = parseInt(result[0].view) + 1
      let result2 = await articleModel.findOneAndUpdate({id: id}, {view: view})
      if (result2) {
        res.send({
          code: 0,
          articleDetails: result,
          message: 'ok'
        })
      }
    }
  }

  async likeArticle (req, res, next) {
    let id = req.body.id
    let like = req.body.like
    let result = await articleModel.findOneAndUpdate({ id: id }, { like: like })
    if (result) {
      res.send({
        code: 0,
        message: 'ok'
      })
    }
  }
}

export default new Article()