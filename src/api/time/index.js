import request from '@/utils/request'
const timeList = async (obj, data) => {
  return request({
    url: '/time/index/?' + 'page=' + obj.page + '&limit=' + obj.limit,
    method: 'post',
    data: data
  })
}

const insert = async (obj) => {
  return request({
    url: '/time/insert',
    method: 'post',
    data: obj
  })
}

const getOneTime = async (obj) => {
  return request({
    url: '/time/getOneTimeLine',
    method: 'get',
    params: obj
  })
}

const editOneTime = async (id, obj) => {
  return request({
    url: '/time/editOneTimeLine/' + id,
    method: 'post',
    data: obj
  })
}

const fakeDelTime = async (obj) => {
  return request({
    url: '/time/fakeDelTimeLine',
    method: 'get',
    params: obj
  })
}

const recoveryDelTime = async (obj) => {
  return request({
    url: '/time/recoveryDelTimeLine',
    method: 'get',
    params: obj
  })
}

const delTime = async (obj) => {
  return request({
    url: '/time/delTimeLine',
    method: 'get',
    params: obj
  })
}

export default { insert, timeList, getOneTime, editOneTime, fakeDelTime, recoveryDelTime, delTime }
