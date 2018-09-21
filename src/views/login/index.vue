<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm"  ref="loginForm" label-position="left"
    :rules="rules">
      <div class="title-container">
        <h3 class="title">博客后台管理系统</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" v-model="loginForm.password" autoComplete="on" placeholder="password"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button type="primary" :loading="loading" @click.native.prevent="handleLogin">{{text}}</el-button>
    </el-form>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: null,
        password: null,
        ipObj: null
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      loading: false,
      text: '登录'
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    ...mapActions({
      Signin: 'Signin'
    }),
    handleLogin () {
      this.$refs.loginForm.validate((res) => {
        if (!res) {
          return false
        } else {
          this.loginForm.ipObj = window.returnCitySN
          this.loading = true
          this.text = '登录中...'
          this.Signin(this.loginForm)
            .then((res) => {
              if (res.data.status === -100 || res.data.status === -200 || res.data.status === -300) {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  duration: 1 * 1000
                })
                this.loading = false
                this.text = '登录'
              } else if (res.data.status === 200) {
                this.$message({
                  message: res.data.message,
                  type: 'success',
                  duration: 1 * 1000
                })
                setTimeout(() => {
                  this.$router.replace({ path: '/index' })
                  this.loading = false
                  this.text = '登录'
                }, 1000)
              }
            })
            .catch((err) => {
              if (err) {
                this.$message({
                  message: '服务器开小差，请稍后再试~',
                  type: 'error',
                  duration: 2 * 1000
                })
              }
              this.loading = false
              this.text = '登录'
            })
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.login-container
  position: relative
  height: 100%
  width: 100%
  background url('./bg.png') no-repeat center center
  background-size 100% 100%
  .title-container
    position: relative
    .title
      font-size: 26px
      font-weight: 400
      color: #eee
      margin: 0px auto 40px auto
      text-align: center
      font-weight: bold
  .login-form
    position: absolute
    top: 50%
    left: 50%
    width: 375px
    transform translate(-50%,-70%)
    .el-form-item
      border 1px solid #dcdfe6
      border-radius 4px
  .svg-container
    padding: 6px 5px 6px 15px
    color: #889aa4
    vertical-align: middle
    width: 30px
    display: inline-block
    svg
      color #fff
  .show-pwd
    position: absolute
    right: 10px
    top: 7px
    font-size: 16px
    color: #889aa4
    cursor: pointer
    user-select: none
  .el-button
    width 100%
  .el-input
    display: inline-block
    height: 47px
    width: 84%
    .el-input__inner
       background: transparent
       border none
       color #fff
       border-radius 0
       border-left 1px solid #dcdfe6
</style>
