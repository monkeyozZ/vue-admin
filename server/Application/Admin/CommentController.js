import Base from './BaseController'
import commentModel from '../../models/site/comment'
import articleModel from '../../models/admin/article'
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
    let condition = req.body.condition
    let currentpage = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    let row = (currentpage - 1) * limit
    let recovery = false
    if (condition === '1') {
      recovery = false
    }

    if (condition === '2') {
      recovery = true
    }
    const commentTree = async (recovery, pid = 0) => {
      let result = await commentModel.find({ recovery: recovery, pid: pid }).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
      // console.log(result.length)
      if (result.length !== 0) {
        for (let i = 0; i < result.length; i++) {
          result[i].userlike = false
          result[i].haschildren = false
          result[i].article = await articleModel.findOne({ id: result[i].aid })
          let child = await commentTree(recovery, result[i].id)
          result[i].comment_num = child.length
          result[i].reply_comment = child
        }
      }
      return result
    }
    let Tree = await commentTree(recovery)
    let count = await commentModel.countDocuments({ pid: 0 })
    res.send({
      code: 0,
      commentList: Tree,
      total: count,
      message: 'ok'
    })
  }

  async fakeDelArticle (req, res, next) {
    let id = req.query._id
    let idArr = []
    let CurrentId = await commentModel.findById(id)
    idArr.push(CurrentId.id)
    const GetDelId = async (pid) => {
      let haschildren = await commentModel.find({ pid: pid })
      if (haschildren.length !== 0) {
        let childPid = []
        for (let i = 0; i < haschildren.length; i++) {
          idArr.push(haschildren[i].id)
          childPid.push(haschildren[i].id)
        }
        for (let j = 0; j < childPid.length; j++) {
          await GetDelId(childPid[j])
        }
      }
      return idArr
    }

    await GetDelId(CurrentId.id).then(async (result) => {
      let resArr = []
      for (let i = 0; i < result.length; i++) {
        resArr.push(await commentModel.findOneAndUpdate({ id: result[i] }, { recovery: true }, {new: true}))
      }
      const success = resArr.every((item) => {
        return item.recovery === true
      })
      if (success) {
        res.send({
          code: 0,
          message: '该记录已移入垃圾评论'
        })
      } else {
        res.send({
          code: -1,
          message: '移入垃圾评论失败'
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  async recoveryComment (req, res, next) {
    let id = req.query._id
    let idArr = []
    let CurrentId = await commentModel.findById(id)
    idArr.push(CurrentId.id)
    const GetDelId = async (pid) => {
      let haschildren = await commentModel.find({ pid: pid })
      if (haschildren.length !== 0) {
        let childPid = []
        for (let i = 0; i < haschildren.length; i++) {
          idArr.push(haschildren[i].id)
          childPid.push(haschildren[i].id)
        }
        for (let j = 0; j < childPid.length; j++) {
          await GetDelId(childPid[j])
        }
      }
      return idArr
    }

    await GetDelId(CurrentId.id).then(async (result) => {
      let resArr = []
      for (let i = 0; i < result.length; i++) {
        resArr.push(await commentModel.findOneAndUpdate({ id: result[i] }, { recovery: false }, { new: true }))
      }
      const success = resArr.every((item) => {
        return item.recovery === false
      })
      if (success) {
        res.send({
          code: 0,
          message: '评论已恢复'
        })
      } else {
        res.send({
          code: -1,
          message: '评论恢复失败'
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  async delComment (req, res, next) {
    let id = req.query._id
    let idArr = []
    let CurrentId = await commentModel.findById(id)
    idArr.push(CurrentId.id)
    const GetDelId = async (pid) => {
      let haschildren = await commentModel.find({ pid: pid })
      if (haschildren.length !== 0) {
        let childPid = []
        for (let i = 0; i < haschildren.length; i++) {
          idArr.push(haschildren[i].id)
          childPid.push(haschildren[i].id)
        }
        for (let j = 0; j < childPid.length; j++) {
          await GetDelId(childPid[j])
        }
      }
      return idArr
    }

    await GetDelId(CurrentId.id).then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err)
    })
  }
}
export default new Comment()