<template>
  <div>
    <template v-for="(item, index) in routers">
        <template v-if="!item.children&&!item.meta.hidden">
            <el-menu-item :index="item.path" :key="index">
              <svg-icon  :icon-class="item.meta.icon"></svg-icon>
              <span slot="title" style="margin-left:10px">{{item.meta.title}}</span>
            </el-menu-item>
        </template>

        <template v-else-if="item.children&&!item.meta.hidden">
        <el-submenu :key="index" :index="item.meta.title || item.path">
          <template slot="title" >
            <svg-icon  v-show="item.meta.icon" :icon-class="item.meta.icon?item.meta.icon:''"></svg-icon>
            <span slot="title" style="margin-left:10px">{{item.meta.title}}</span>
          </template>

          <template v-for="(child, index) in item.children">
            <template>
              <template  v-if="!child.children&&!child.meta.hidden">
                  <el-menu-item :index="item.path + '/' + child.path" :key="index" style="text-align:center">{{child.meta.title}}</el-menu-item>
              </template>
              <menu-item v-else :key="index" :routers="[child]"></menu-item>
            </template>
          </template>
          </el-submenu>
        </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    routers: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  methods: {
    hasOneShowingChildren (children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="stylus" scoped>
.svg-icon
  font-size 18px
.el-menu--collapse
  .el-submenu__title
    span
      height 0
      width 0
      overflow hidden
      visibility hidden
      display inline-block
</style>
