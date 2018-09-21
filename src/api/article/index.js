import request from '@/utils/request'
const articleList = async (obj, data) => {
  return request({
    url: '/article/index/?' + 'page=' + obj.page + '&limit=' + obj.limit,
    method: 'post',
    data: data
  })
}

const insert = async (obj) => {
  return request({
    url: '/article/insert',
    method: 'post',
    data: obj
  })
}

const tagInsert = async (obj) => {
  return request({
    url: '/article/tagInsert',
    method: 'post',
    data: obj
  })
}

const getTaglist = async (obj) => {
  return request({
    url: '/article/getTaglist',
    method: 'get',
    params: obj
  })
}
const getOneTag = async (obj) => {
  return request({
    url: '/article/getOneTag',
    method: 'get',
    params: obj
  })
}

const editOneTag = async (id, obj) => {
  return request({
    url: '/article/editOneTag/' + id,
    method: 'post',
    data: obj
  })
}

const delcontentimg = async (str) => {
  return request({
    url: '/article/delcontentimg',
    method: 'post',
    data: { url: str }
  })
}

const getOneArticle = async (obj) => {
  return request({
    url: '/article/getOneArticle',
    method: 'get',
    params: obj
  })
}

const editOneArticle = async (id, obj) => {
  return request({
    url: '/article/editOneArticle/' + id,
    method: 'post',
    data: obj
  })
}

const fakeDelArticle = async (obj) => {
  return request({
    url: '/article/fakeDelArticle',
    method: 'get',
    params: obj
  })
}

const recoveryDelArticle = async (obj) => {
  return request({
    url: '/article/recoveryDelArticle',
    method: 'get',
    params: obj
  })
}

const delArticle = async (obj) => {
  return request({
    url: '/article/delArticle',
    method: 'get',
    params: obj
  })
}

const delTag = async (obj) => {
  return request({
    url: '/article/deltag',
    method: 'get',
    params: obj
  })
}

export default { insert, tagInsert, getTaglist, getOneTag, editOneTag, articleList, delcontentimg, getOneArticle, editOneArticle, fakeDelArticle, recoveryDelArticle, delArticle, delTag }
