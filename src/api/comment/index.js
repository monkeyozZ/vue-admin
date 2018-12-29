import request from '@/utils/request'
const commentList = async (obj, data) => {
  return request({
    url: '/adminComment/index?' + 'page=' + obj.page + '&limit=' + obj.limit,
    method: 'post',
    data: data
  })
}

const fakeDelComment = async (obj) => {
  return request({
    url: '/adminComment/fakeDelArticle',
    method: 'get',
    params: obj
  })
}

const recoveryComment = async (obj) => {
  return request({
    url: '/adminComment/recoveryComment',
    method: 'get',
    params: obj
  })
}

const delComment = async (obj) => {
  return request({
    url: '/adminComment/delMsg',
    method: 'get',
    params: obj
  })
}
export default { commentList, fakeDelComment, recoveryComment, delComment }