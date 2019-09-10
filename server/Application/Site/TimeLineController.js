import Base from './BaseController'
import timeModel from '../../models/admin/time'

class TimeLine extends Base {
  constructor () {
    super()
    this.getTimeList = this.getTimeList.bind(this)
  }
  async getTimeList (req, res, next) {
    let currentpage = parseInt(req.body.page)
    let limit = parseInt(req.body.limit)
    let row = (currentpage - 1) * limit
    let result = await timeModel.find({'recovery': false}).skip(row).limit(limit).sort({ creat_time: -1 }).lean()
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
}

export default new TimeLine()