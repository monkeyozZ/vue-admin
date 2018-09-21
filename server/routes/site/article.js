'use strict'

import express from 'express'
import Article from '../../Application/Site/ArticleController'
const router = express.Router()
router.post('/getArticleList', Article.getArticleList)
router.post('/getArticleDetails', Article.getArticleDetails)
router.post('/getTagList', Article.getTagList)
router.post('/likeArticle', Article.likeArticle)

export default router