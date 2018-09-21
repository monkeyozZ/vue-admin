import * as types from '../mutation'
import Cookies from 'js-cookie'
const state = {
  isCollapse: Cookies.get('isopen') !== 'false'
}

const getters = {
  isCollapse: state => state.isCollapse
}

const mutations = {
  [types.MENU_TAGGLE] (state, status) {
    state.isCollapse = status
    Cookies.set('isopen', status)
  }
}

export default {
  state, mutations, getters
}