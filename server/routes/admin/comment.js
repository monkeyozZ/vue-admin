'use strict'

import express from 'express'
import Comment from '../../Application/admin/CommentController'
const router = express.Router()
router.post('/saveMsg', Comment.saveMsg)
router.post('/index', Comment.getCommentList)
router.get('/fakeDelArticle', Comment.fakeDelArticle)
router.get('/recoveryComment', Comment.recoveryComment)
router.get('/delMsg', Comment.delComment)

export default router