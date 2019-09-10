'use strict'

import express from 'express'
import TimeLine from '../../Application/Admin/TimeLineController'

const router = express.Router()
router.post('/index', TimeLine.index)
router.get('/getOneTimeLine', TimeLine.getOneTimeLine)
router.post('/editOneTimeLine/:id', TimeLine.editOneTimeLine)
router.get('/fakeDelTimeLine', TimeLine.fakeDelTimeLine)
router.get('/recoveryDelTimeLine', TimeLine.recoveryDelTimeLine)
router.get('/delTimeLine', TimeLine.delTimeLine)
router.post('/thumbSave', TimeLine.thumbSave)
router.post('/insert', TimeLine.insert)

export default router