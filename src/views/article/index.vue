<template>
  <div class="article_container">
    <el-breadcrumb class="path" separator-class="el-icon-arrow-right">
      <span style="float:left">当前位置：</span>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/article/index' }">文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="data-container">
      <el-row class="filter-box">
        <el-col :xs="{span: 16}" :sm="{span: 14}" :md="{span: 10}" :lg="{span: 8}">
          <el-radio-group v-model="filterobj.condition">
          <el-radio-button label="1">全部</el-radio-button>
          <el-radio-button label="2">已发布</el-radio-button>
          <el-radio-button label="3">草稿箱</el-radio-button>
          <el-radio-button label="4">回收站</el-radio-button>
        </el-radio-group>
        </el-col>
        <el-col :xs="8" :sm="10" :md="{span:11}" :lg="{span:12, offset: 4}">
          <el-row class="cate-filter-box" :gutter="10">
            <el-col class="hidden-sm-and-down" :md="10" :lg="5">
              <el-button icon="el-icon-delete" @click="clear">清空筛选条件</el-button>
            </el-col>
            <el-col class="hidden-md-and-down"  :md="5" :lg="5">
              <el-select v-model="filterobj.condition2"
                filterable
                placeholder="分类筛选">
                  <el-option-group
                    v-for="group in category"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
            </el-col>
            <el-col class="hidden-md-and-down"  :md="5" :lg="5">
              <el-select v-model="filterobj.condition3"
                filterable
                placeholder="标签筛选">
                  <el-option-group
                    label="所有标签">
                    <el-option
                      v-for="(item, index) in tag"
                      :key="index"
                      :label="item.name"
                      :value="item.alias"
                      >
                    </el-option>
                  </el-option-group>
                </el-select>
            </el-col>
            <el-col class="hidden-sm-and-down"  :md="10" :lg="8">
              <el-input
                placeholder="请输入关键字搜索"
                v-model="filterSearch.keywords">
                <el-button slot="append" icon="el-icon-search"  @click="search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="list-box">
        <el-table
        ref="multipleTable"
          border
          stripe
          :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="ID"
          width="55">
          <template slot-scope="scope">{{ scope.row.id}}</template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
           width="300"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          prop="thumb_img"
          label="缩略图"
           width="150"
          >
          <template slot-scope="scope">
            <el-button type="text" @click="jioinImgUrl(scope.row.imageUrl)">查看缩略图</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="所属分类"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.category" :key="index">
              {{ item| catefilter}}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="标签"
          >
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.tag" :key="index">{{item[0].name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="comment_num"
          label="评论"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="like"
          label="喜欢"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="view"
          label="浏览量"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="日期"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.creat_time | formatTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="公开"
          width="80"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.open">{{scope.row.open | openfilter}}</el-tag>
            <el-tag type="danger" v-else >{{scope.row.open | openfilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status">{{scope.row.status | statusfilter}}</el-tag>
            <el-tag type="info" v-else >{{scope.row.status | statusfilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          show-overflow-tooltip>
           <template slot-scope="scope">
             <el-button
                size="mini"
                type="primary"
                icon="el-icon-back"
                circle
                v-if="scope.row.recovery"
                v-waves
                @click="recoveryDelete(scope.row._id)"></el-button>

              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                v-else
                v-waves
                @click="handleEdit(scope.row._id)"></el-button>

                <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                v-waves
                v-if="!scope.row.recovery"
                @click="fakeDelete(scope.row._id)"></el-button>

                <el-button
                size="mini"
                v-waves
                type="danger"
                icon="el-icon-delete"
                circle
                v-else
                @click="handleDelete(scope.row._id)"></el-button>
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box" v-if="total">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[8, 20, 30, 40]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
    title="缩略图"
    :visible.sync="imgdialogVisible"
    width="30%"
    center>
    <img :src="baseapi + thumb_img" alt="" style="display:block;margin: 0 auto;max-width:100%">
  </el-dialog>

  <el-dialog
    title="编辑文章"
    :visible.sync="editdialogVisible"
    width="80%">
    <v-edit :edit="true" :editArr="editArr" :editId="editId" @changeEditdialogVisible="changeEditdialogVisible"></v-edit>
  </el-dialog>
</div>
</template>

<script>
import waves from '@/directive/waves'
import ArticleApi from '@/api/article'
import VEdit from './insert.vue'
import { catefilter, formatTime, openfilter, statusfilter } from '@/filters'
export default {
  directives: {
    waves
  },
  filters: {
    catefilter,
    formatTime,
    openfilter,
    statusfilter
  },
  components: {
    VEdit
  },
  data () {
    return {
      baseapi: process.env.BASE_API,
      imgdialogVisible: false,
      editdialogVisible: false,
      thumb_img: '',
      loading: true,
      filterobj: {
        condition: '1',
        condition2: '',
        condition3: ''
      },
      filterSearch: {
        condition: '1',
        condition2: '',
        condition3: '',
        keywords: ''
      },
      count: `(${this.total})`,
      listQuery: {
        page: 1,
        limit: 8
      },
      tableData: [],
      editArr: {},
      editId: '',
      total: '',
      category: [
        {
          label: '所有分类',
          options: [{
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
          ]
        }
      ],
      tag: [],
      multipleSelection: []
    }
  },
  computed: {
    condition () {
      return this.filterobj.condition
    },
    condition2 () {
      return this.filterobj.condition2
    },
    condition3 () {
      return this.filterobj.condition3
    }
  },
  methods: {
    clear () {
      this.filterobj.condition = '1'
      this.filterobj.condition2 = ''
      this.filterobj.condition3 = ''
    },
    getTagList () {
      ArticleApi.getTaglist().then((res) => {
        if (res.data.code === 0) {
          this.tag = res.data.tagList
        }
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.initArticleList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.initArticleList()
    },
    handleEdit (id) {
      this.editdialogVisible = true
      this.editId = id
      ArticleApi.getOneArticle({_id: id}).then((res) => {
        if (res.data.code === 0) {
          this.editArr = res.data.articleobj
        }
      })
    },
    fakeDelete (id) {
      this.$confirm('确定将该记录添加到回收站吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ArticleApi.fakeDelArticle({_id: id}).then((res) => {
          if (res.data.code === 0) {
            this.initArticleList()
            this.$notify({
              type: 'success',
              title: '成功',
              message: res.data.message
            })
          } else {
            this.$notify({
              type: 'error',
              title: '失败',
              message: res.data.message
            })
          }
        })
      })
    },
    recoveryDelete (id) {
      this.$confirm('该记录将被恢复？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ArticleApi.recoveryDelArticle({_id: id}).then((res) => {
          if (res.data.code === 0) {
            this.initArticleList()
            this.$notify({
              type: 'success',
              title: '成功',
              message: res.data.message
            })
          } else {
            this.$notify({
              type: 'error',
              title: '失败',
              message: res.data.message
            })
          }
        })
      })
    },
    handleDelete (id) {
      // console.log(id)
      this.$confirm('确定永久删除该记录吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ArticleApi.delArticle({_id: id}).then((res) => {
          if (res.data.code === 0) {
            this.initArticleList()
            this.$notify({
              type: 'success',
              title: '成功',
              message: res.data.message
            })
          } else {
            this.$notify({
              type: 'error',
              title: '失败',
              message: res.data.message
            })
          }
        })
      })
    },
    changeEditdialogVisible () {
      this.editdialogVisible = false
      this.initArticleList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    jioinImgUrl (url) {
      this.imgdialogVisible = true
      this.thumb_img = url
    },
    initArticleList () {
      ArticleApi.articleList(this.listQuery, this.filterobj).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.articleList
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    search () {
      ArticleApi.articleList(this.listQuery, this.filterSearch).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.articleList
          this.total = res.data.total
          this.loading = false
        }
      })
    }
  },
  watch: {
    filterobj: {
      handler () {
        this.initArticleList()
      },
      deep: true
    },
    condition: {
      handler () {
        this.filterSearch.condition = this.condition
      }
    },
    condition2: {
      handler () {
        this.filterSearch.condition2 = this.condition2
      }
    },
    condition3: {
      handler () {
        this.filterSearch.condition2 = this.condition3
      }
    }
  },
  mounted () {
    this.getTagList()
    this.initArticleList()
  }
}
</script>

<style lang="stylus" scoped>
.data-container
  background #ddd
  margin 0 15px
  .filter-box
    padding 5px
    background #fff
    margin-bottom 5px
    .el-button
      padding 5px 10px
    .cate-filter-box
      .el-select
        width 100%
  .list-box
    padding 5px
    background #fff
    .el-tag
      height 20px
      line-height 18px
    .el-tag+.el-tag
      margin-left 10px
  .pagination-box
    margin 30px 0
    text-align center
</style>
