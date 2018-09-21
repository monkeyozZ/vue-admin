'use strict'

import express from 'express'
import Comment from '../../Application/site/CommentController'
const router = express.Router()
router.post('/saveMsg', Comment.saveMsg)
router.post('/getCommentList', Comment.getCommentList)
router.post('/like', Comment.like)

export default router