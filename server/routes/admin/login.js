'use strict'

import express from 'express'
import login from '../../Application/Admin/LoginController'
const router = express.Router()
router.post('/', login.login)
router.post('/loginout', login.loginout)

export default router