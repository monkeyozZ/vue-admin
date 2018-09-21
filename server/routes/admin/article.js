'use strict'

import express from 'express'
import Article from '../../Application/Admin/ArticleController'

const router = express.Router()
router.post('/index', Article.index)
router.get('/getOneArticle', Article.getOneArticle)
router.post('/editOneArticle/:id', Article.editOneArticle)
router.get('/fakeDelArticle', Article.fakeDelArticle)
router.get('/recoveryDelArticle', Article.recoveryDelArticle)
router.get('/delArticle', Article.delArticle)
router.post('/thumbSave', Article.thumbSave)
router.post('/contentimg', Article.contentimg)
router.post('/delcontentimg', Article.delcontentimg)
router.post('/insert', Article.insert)
router.post('/tagInsert', Article.tagInsert)
router.get('/getTaglist', Article.getTaglist)
router.get('/getOneTag', Article.getOneTag)
router.post('/editOneTag/:id', Article.editOneTag)
router.get('/delTag', Article.delTag)

export default router