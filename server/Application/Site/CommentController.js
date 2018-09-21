import Base from './BaseController'
import commentModel from '../../models/site/comment'
class Comment extends Base {
  constructor () {
    super()
    this.saveMsg = this.saveMsg.bind(this)
  }

  async saveMsg (req, res, next) {
    let result = await commentModel.create(req.body)
    if (result) {
      res.send({
        code: 0,
        message: 'ok'
      })
    }
  }

  async getCommentList (req, res, next) {
    let id = req.body.id
    const commentTree = async (aid, pid = 0) => {
      let result = await commentModel.find({ aid: aid, pid: pid }).lean()
      // console.log(result.length)
      if (result.length !== 0) {
        for (let i = 0; i < result.length; i++) {
          result[i].userlike = false
          result[i].haschildren = false
          let child = await commentTree(result[i].aid, result[i].id)
          result[i].comment_num = child.length
          result[i].reply_comment = child
        }
      }
      return result
    }

    let Tree = await commentTree(id)
    res.send({
      code: 0,
      commentList: Tree,
      message: 'ok'
    })
  }

  async like (req, res, next) {
    let id = req.body.id
    let num = req.body.num
    let result = await commentModel.findOneAndUpdate({id: id}, {like: num})
    if (result) {
      res.send({
        code: 0,
        message: 'ok'
      })
    }
  }
}

export default new Comment()