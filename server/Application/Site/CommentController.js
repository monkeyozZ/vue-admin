import Base from './BaseController'
import commentModel from '../../models/site/comment'
import sendMail from '../../utils/email'
const marked = require('marked')
class Comment extends Base {
  constructor () {
    super()
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    })
    this.saveMsg = this.saveMsg.bind(this)
  }

  sendMailToAdminAndTargetUser (comment, permalink) {
    const commentContent = marked(comment.content)
    const replyText = isReply => isReply ? '回复' : ''
    const sendMailHtml = isReply => `<p> 来自 ${comment.name} 的评论${replyText(isReply)}：${commentContent}</p><br><a href="${comment.currentUrl}" target="_blank">[ 过去看看 ]</a>`
    sendMail({
      to: 'my@wowmonkey.cn',
      subject: `博客有新的评论`,
      html: sendMailHtml(false)
    })
    if (comment.pid !== 0) {
      commentModel.findOne({ id: comment.pid }).then(parentComment => {
        sendMail({
          to: parentComment.email,
          subject: `你在wowmonkey.cn有新的评论回复`,
          html: sendMailHtml(true)
        })
      })
    }
  }

  async saveMsg (req, res, next) {
    let result = await commentModel.create(req.body)
    if (result) {
      this.sendMailToAdminAndTargetUser(req.body)
      res.send({
        code: 0,
        message: 'ok'
      })
    }
  }

  async getCommentList (req, res, next) {
    let id = req.body.id
    let currentpage = parseInt(req.body.page)
    let limit = parseInt(req.body.limit)
    let row = (currentpage - 1) * limit
    const commentTree = async (aid, pid = 0, recovery = false) => {
      let result = await commentModel.find({ aid: aid, pid: pid, recovery: recovery }).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
      // console.log(result.length)
      if (result.length !== 0) {
        for (let i = 0; i < result.length; i++) {
          result[i].userlike = false
          result[i].haschildren = false
          let child = await commentTree(result[i].aid, result[i].id, false)
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