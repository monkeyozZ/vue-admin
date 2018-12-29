'use strict'
import login from './admin/login'
import article from './admin/article'
import time from './admin/time'
import adminComment from './admin/comment'
import siteArticle from './site/article'
import siteComment from './site/comment'
export default app => {
  app.use('/login', login)
  app.use('/article', article)
  app.use('/siteArticle', siteArticle)
  app.use('/siteComment', siteComment)
  app.use('/adminComment', adminComment)
  app.use('/time', time)
}