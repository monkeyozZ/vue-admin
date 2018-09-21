<template>
  <div class="header_box">
    <el-row>
      <el-col :lg="{span: 3}" :md="{span: 4}" :sm="{span: 6}" :xs="{span: 8}" class="logo">
        <router-link to="">monkey</router-link>
      </el-col>
      <el-col :lg="2" :md="2" :sm="2" :xs="2" class="tagglebar">
        <el-button @click="taggle" size="small" circle type="info"><svg-icon icon-class="transform"></svg-icon></el-button>
      </el-col>
     <el-col :lg="{span: 3, offset: 16}" :md="{span: 3, offset: 15}" :sm="{span: 3, offset: 13}" :xs="{span: 3, offset: 11}" class="avtor_box">
       <div class="avt">
          <el-dropdown :show-timeout="200" placement="bottom">
            <span class="el-dropdown-link">
              <img src="./avt.jpg" alt="">
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click.native="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
       </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import loginApi from '@/api/login'
import Cookies from 'js-cookie'
export default {
  name: 'v-header',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      isCollapse: 'isCollapse'
    })
  },
  methods: {
    ...mapActions({
      ChangeMenu: 'Menutaggle'
    }),
    taggle () {
      this.ChangeMenu(!this.isCollapse)
    },
    loginout () {
      loginApi.loginout().then((res) => {
        if (res.data.status === 200) {
          Cookies.remove('UserId')
          this.$router.replace('/login')
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
el-header
  padding 0
.header_box
  height 60px
  padding 10px 0
  box-sizing border-box
  .logo
    text-align center
    a
      display inline-block
      font-size 28px
      font-family logofont
      line-height 40px
      letter-spacing 5px
      cursor pointer
      color #ffffff
      text-decoration none
  .tagglebar
    text-align center
  .avtor_box
    text-align center
    .avt
      display inline-block
      width 40px
      height 40px
      border-radius 50%
      overflow hidden
      img
        display inline-block
        max-width 100%
        width 100%
        height auto
@font-face
  font-family 'logofont'
  src url('./font/Lobster.ttf')
  src url('./font/Lobster.eot?#iefix') format('embedded-opentype') /* IE6-IE8 */
      url('./font/Lobster.woff') format('woff') /* Modern Browsers */
      url('./font/Lobster.ttf') format('truetype') /* Safari, Android, iOS */
</style>
