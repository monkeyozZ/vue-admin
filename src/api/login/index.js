import request from '@/utils/request'
const login = async (obj) => {
  const data = obj
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

const loginout = async () => {
  return request({
    url: '/login/loginout',
    method: 'post'
  })
}

export default { login, loginout }
