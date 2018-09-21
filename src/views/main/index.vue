<template>
    <el-container class="main_body">
      <el-header><v-header></v-header></el-header>
        <el-container class="main">
          <el-aside> <v-menu></v-menu> </el-aside>
          <el-main>
           <transition name="list">
              <router-view></router-view>
          </transition>
          </el-main>
        </el-container>
      <el-footer><v-footer></v-footer></el-footer>
    </el-container>
</template>

<script>
import header from '@/components/common/header'
import footer from '@/components/common/footer'
import slider from '@/components/menu'
export default {
  name: 'index',
  components: {
    'v-header': header,
    'v-footer': footer,
    'v-menu': slider
  },
  data () {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.main_body
  .el-header
    position fixed
    width 100%
    z-index 999
    background rgb(48, 65, 86)
  .main
    margin-top 60px
    .el-aside
      display inline-block
      width auto!important
      box-sizing border-box
    .el-main
      padding 0px
      height calc(100vh - 100px)
      overflow-y auto
      background #ddd
  .el-footer
    background rgb(48, 65, 86)
    color #fff
.list-enter-active
  transition: all .5s ease-in-out
.list-leave-active
  transition: all .2s ease;
  opacity: 0
.list-enter
  transform: translateY(20px);
  opacity: 0
.list-move
  transition: all .5s
</style>
