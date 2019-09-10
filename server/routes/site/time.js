'use strict'

import express from 'express'
import Time from '../../Application/Site/TimeLineController'
const router = express.Router()
router.post('/getTimeList', Time.getTimeList)

export default router