<template>
  <el-menu class="el-menu-vertical"
      :router="true"
      background-color="#304156"
      text-color="#bfcbd9"
      :collapse="isCollapse"
      :default-active="$route.path">
      <menu-item :routers="routers"></menu-item>
  </el-menu>
</template>

<script>
import MenuItem from './MenuItem'
import {mapGetters} from 'vuex'
export default {
  components: {
    MenuItem
  },
  data () {
    return {
      routers: [
        {
          path: '/index',
          meta: {icon: 'index', title: '首页', hidden: false}
        },
        {
          path: '/article',
          meta: {icon: 'pen', title: '文章管理', hidden: false},
          children: [
            {
              path: 'index',
              name: 'articleindex',
              meta: {title: '文章列表', hidden: false}
            },
            {
              path: 'insert',
              name: 'articleinsert',
              meta: {title: '发布文章', hidden: false}
            },
            {
              path: 'tag',
              name: 'articletag',
              meta: {title: '文章标签', hidden: false}
            }
          ]
        },
        {
          path: '/comment',
          meta: {icon: 'comment', title: '评论管理', hidden: false},
          children: [
            {
              path: 'index',
              name: 'commentindex',
              meta: {title: '所有评论', hidden: false}
            }
          ]
        },
        {
          path: '/timeline',
          meta: {icon: 'time', title: '时间轴管理', hidden: false},
          children: [
            {
              path: 'index',
              name: 'timelineindex',
              meta: {title: '时间轴列表', hidden: false}
            },
            {
              path: 'insert',
              name: 'timelineinsert',
              meta: {title: '时间轴续写', hidden: false}
            }
          ]
        }
      ]}
  },
  computed: {
    ...mapGetters({
      isCollapse: 'isCollapse'
    })
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-menu-vertical:not(.el-menu--collapse)
    width 200px
    height calc(100vh - 100px)
    overflow-y auto
    overflow-x hidden
</style>
