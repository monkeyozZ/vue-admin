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
    let currentpage = parseInt(req.body.page)
    let limit = parseInt(req.body.limit)
    let row = (currentpage - 1) * limit
    let cate = req.body.cate ? req.body.cate : null
    let tag = req.body.tag ? req.body.tag : null
    let time = req.body.creat_time ? req.body.creat_time : null
    let hot = req.body.hot ? req.body.hot : false
    let keyWord = req.body.keyWord ? req.body.keyWord : null
    let reg = new RegExp(keyWord, 'i') // 模糊查询参数
    let result = []
    if (cate) {
      result = await articleModel.find({ recovery: false, status: true, category: cate }).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    }
    if (tag) {
      result = await articleModel.find({ recovery: false, status: true, tag: tag }).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    }

    if (time) {
      let timeStart = parseInt(time)
      let timeEnd = parseInt(time) + 86400000
      result = await articleModel.find({ recovery: false, status: true, creat_time: { '$gte': timeStart, '$lte': timeEnd } }).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    }

    if (hot) {
      result = await articleModel.find({ recovery: false, status: true }).skip(row).limit(limit).sort({ like: -1 }).lean()
    }

    if (keyWord) {
      result = await articleModel.find({ recovery: false, status: true, '$or': [{ 'title': reg }, { 'des': reg }, { 'content': reg }] }).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    }

    if (!cate && !tag && !time && !hot && !keyWord) {
      result = await articleModel.find({ recovery: false, status: true }).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
    }
    for (let i = 0; i < result.length; i++) {
      let aid = result[i].id
      let arr = []
      let num = await commentModel.find({ aid: aid }).lean()
      for (let j = 0; j < result[i].tag.length; j++) {
        let resTag = await tagModel.findOne({ alias: result[i].tag[j] }).lean()
        arr.push(resTag)
      }
      result[i].tag = arr
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
    let result = await articleModel.findOne({id: id}).lean()
    if (result.length !== 0) {
      let view = parseInt(result.view) + 1
      let result2 = await articleModel.findOneAndUpdate({id: id}, {view: view})
      if (result2) {
        let num = await commentModel.find({ aid: id }).lean()
        let arr = []
        for (let i = 0; i < result.tag.length; i++) {
          let resTag = await tagModel.findOne({ alias: result.tag[i] }).lean()
          arr.push(resTag.name)
        }
        result.comment_num = num.length
        result.tag = arr
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