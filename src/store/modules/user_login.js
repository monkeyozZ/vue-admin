import * as types from '../mutation'
const state = {
  user_id: ''
}

const getters = {
  user_id: state => state.user_id

}

const mutations = {
  [types.SET_USERID] (state, obj) {
    state.user_id = obj
  }
}

export default {
  state, mutations, getters
}