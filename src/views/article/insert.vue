<template>
  <div class="article_container">
    <el-breadcrumb class="path" separator-class="el-icon-arrow-right" v-if='!edit'>
      <span style="float:left">当前位置：</span>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/article/insert' }">添加文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :lg="17" :md="17" :sm="24" :xs="24" class="form-left" :class="{resetBg: edit}">
        <el-form :rules="rules" ref="dataForm1" :model="Form" label-position="left" label-width="120px">
          <el-form-item label="文章标题：" prop="title" :inline-message="true">
              <el-input v-model="Form.title" placeholder="文章标题" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item label="文章关键词：" prop="keywords" :inline-message="true">
              <el-input v-model="Form.keywords" placeholder="文章关键词" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item label="文章描述：" prop="des" :inline-message="true">
              <el-input type="textarea" v-model="Form.des" placeholder="文章描述" style="width:70%"></el-input>
          </el-form-item>
          <el-form-item label="文章分类：" prop="category" :inline-message="true">
            <div class="tag-box">
              <el-checkbox-group
                v-model="Form.category"
                >
                <el-checkbox v-for="(item, index) in category" :label="item.value" :key="index">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="文章标签：" prop="tag" :inline-message="true">
            <div class="tag-box">
              <el-checkbox-group
                v-model="Form.tag"
                >
                <el-checkbox v-for="(item, index) in tags" :label="item.alias" :key="index">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="文章内容：" prop="content" :inline-message="true">
            <div class="content-box">
              <mavon-editor v-model="Form.content" @imgAdd="imgAdd" @imgDel="imgDel" ref="md"/>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :lg="5" :md="5" :sm="24" :xs="24" class="form-right" :class="{resetBg: edit}">
        <el-form :rules="rules" ref="dataForm2" :model="Form" label-position="top" label-width="85px">
          <el-form-item label="文章来源：" prop="origin">
              <el-select v-model="Form.origin" placeholder="请选择">
                <el-option
                  v-for="item in origin"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="文章状态：" prop="status">
            <el-switch
              v-model="Form.status"
              active-text="直接发布"
              inactive-text="存为草稿">
            </el-switch>
          </el-form-item>
          <el-form-item label="是否公开：" prop="open">
            <el-switch
              v-model="Form.open"
              active-text="公开"
              inactive-text="私密">
            </el-switch>
          </el-form-item>
           <el-form-item label="缩略图：" prop="thumb_img" class="thumb_box">
              <el-upload
                class="thumb-uploader"
                :action="baseapi + '/article/thumbSave'"
                :data="Form"
                :show-file-list="false"
                accept="image/*"
                :on-success="handleThumbSuccess"
                :before-upload="beforeThumbUpload">
                <div v-if="Form.imageUrl" class="el-upload-list--picture-card">
                  <img :src="baseapi + Form.imageUrl" class="thumb">
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-refresh" style="font-size:14px">重选</i>
                    </span>
                  </span>
                </div>
                <i v-else class="el-icon-plus thumb-uploader-icon"></i>
              </el-upload>
           </el-form-item>
        </el-form>
         <el-button type="primary" class="submit" icon="el-icon-arrow-up" @click="submit" v-if="!edit">发布文章</el-button>
         <el-button type="primary" class="submit" icon="el-icon-check" @click="editArticle" v-else>保存修改</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import articleApi from '@/api/article'
export default {
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    editArr: {
      type: Object,
      default: () => {}
    },
    editId: {
      type: String,
      default: ''
    }
  },
  data () {
    var validatetag = async (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('至少选择一项标签'))
      }
    }
    var validatecate = async (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('至少选择一项分类'))
      }
    }
    return {
      baseapi: process.env.BASE_API,
      category: [
        {
          label: '学无止境',
          value: 'learn'
        },
        {
          label: '个人归档',
          value: 'note'
        },
        {
          label: '慢生活',
          value: 'life'
        }
      ],
      tags: ['js', 'java', 'php'],
      origin: [
        {
          label: '原创',
          value: '0'
        },
        {
          label: '转载',
          value: '1'
        },
        {
          label: '混合',
          value: '2'
        }

      ],
      Form: {
        title: '',
        keywords: '',
        des: '',
        category: [],
        tag: [],
        content: '',
        origin: '0',
        status: true,
        open: true,
        imageUrl: ''
      },
      rules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        keywords: [{ required: true, message: '请输入文章关键词', trigger: 'blur' }],
        des: [{ required: true, message: '请输入文章描述', trigger: 'blur' }],
        category: [{ validator: validatecate, trigger: 'blur' }],
        tag: [{ validator: validatetag, trigger: 'blur' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      content_img_arr: []
    }
  },
  methods: {
    getTagList () {
      articleApi.getTaglist().then((res) => {
        if (res.data.code === 0) {
          this.tags = res.data.tagList
        }
      })
    },
    refresh () {
      // 页面刷新和关闭提醒事件
      window.onbeforeunload = function () {
        return '请确认信息是否已保存！'
      }
    },
    imgAdd (pos, file) {
      // console.log(file)
      let formdata = new FormData()
      formdata.append('image', file)
      axios({
        url: this.baseapi + '/article/contentimg',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        if (res.data.code === 0) {
          let key = file.name
          let obj = {}
          obj[key] = res.data.imageUrl
          this.content_img_arr.push(obj)
          this.$refs.md.$img2Url(pos, this.baseapi + res.data.imageUrl)
        }
      })
    },
    imgDel (file) {
      let delurl = ''
      this.content_img_arr.map((item) => {
        for (const k in item) {
          if (file[0].name === k) {
            // console.log(item[file[0].name])
            delurl = item[file[0].name]
          }
        }
      })

      articleApi.delcontentimg(delurl).then((res) => {
        if (res.data.code === 0) {
          this.$notify({
            type: 'success',
            title: '成功',
            message: res.data.message
          })
        }
      })
    },
    handleThumbSuccess (res, file) {
      if (res.code === 0) {
        this.Form.imageUrl = res.imageUrl
      }
    },
    beforeThumbUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isLt10M
    },
    editArticle () {
      this.$refs.dataForm1.validate((valid) => {
        if (valid) {
          articleApi.editOneArticle(this.editId, this.Form).then((res) => {
            if (res.data.code === 0) {
              this.$emit('changeEditdialogVisible')
              this.$notify({
                type: 'success',
                title: '成功',
                message: '文章修改成功'
              })
            }
          })
        }
      })
    },
    submit () {
      this.$refs.dataForm1.validate((valid) => {
        if (valid) {
          if (this.Form.imageUrl) {
            articleApi.insert(JSON.stringify(this.Form)).then((res) => {
              if (res.data.code === 0) {
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '文章添加成功'
                })
                /* this.$refs.dataForm1.resetFields() // 重置表单
                this.Form.imageUrl = '' */
                this.$router.push('/article/index')
              }
            }).catch((err) => {
              this.$notify({
                type: 'error',
                title: '失败',
                message: err
              })
            })
          } else {
            this.$notify({
              type: 'warning',
              title: '警告',
              message: '请选择要上传的缩略图'
            })
          }
        }
      })
    }
  },
  watch: {
    editArr: {
      handler () {
        let { title, keywords, des, category, tag, content, origin, status, open, imageUrl } = this.editArr
        this.Form.title = title
        this.Form.keywords = keywords
        this.Form.des = des
        this.Form.category = category
        this.Form.tag = tag
        this.Form.content = content
        this.Form.origin = origin
        this.Form.status = status
        this.Form.open = open
        this.Form.imageUrl = imageUrl
      }
    }
  },
  mounted () {
    this.getTagList()
    this.refresh()
  }
}
</script>

<style lang="stylus" scoped>
.article_container
  .form-left
    padding 10px 20px
    box-sizing border-box
    margin 0 15px
    background-color #fff
    &.resetBg
      border 1px solid #ddd
      border-radius 5px
    .el-form-item
      margin-bottom 10px
    .tag-box
      width 50%
      padding 0 10px
      min-height 60px
      height 100%
      border-radius 5px
      border 1px solid #ddd
      .el-checkbox
        margin 0 15px
    .content-box
      width 98%
    .v-note-wrapper
      min-height 480px
      max-height 650px
  .form-right
    padding 10px 20px
    box-sizing border-box
    margin 0 10px
    background-color #fff
    &.resetBg
      border 1px solid #ddd
      border-radius 5px
    .thumb-uploader
      .el-upload-list__item-status-label
        display block
        height 27px
        top -10px
        .el-icon-check
          color #fff
      .thumb-uploader-icon
        font-size 28px
        color #8c939d
        width 100%
        line-height 150px
        text-align center
      .thumb
        width 100%
        height 150px
        display block
    .submit
      display block
      width 80%
      margin 30px auto 20px auto
</style>
