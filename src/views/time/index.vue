<template>
  <div class="article_container">
    <el-breadcrumb class="path" separator-class="el-icon-arrow-right">
      <span style="float:left">当前位置：</span>
      <el-breadcrumb-item>时间轴管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/article/index' }">时间轴列表</el-breadcrumb-item>
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
          prop="content"
          label="时间轴内容"
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
          label="日期"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.creat_time | formatTime}}
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
    title="编辑时间轴"
    :visible.sync="editdialogVisible"
    width="80%">
    <v-edit :edit="true" :editArr="editArr" :editId="editId" @changeEditdialogVisible="changeEditdialogVisible"></v-edit>
  </el-dialog>
</div>
</template>

<script>
import waves from '@/directive/waves'
import TimeApi from '@/api/time'
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
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.initTimeLineList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.initTimeLineList()
    },
    handleEdit (id) {
      this.editdialogVisible = true
      this.editId = id
      TimeApi.getOneTime({_id: id}).then((res) => {
        if (res.data.code === 0) {
          this.editArr = res.data.timeObj
        }
      })
    },
    fakeDelete (id) {
      this.$confirm('确定将该记录添加到回收站吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        TimeApi.fakeDelTime({_id: id}).then((res) => {
          if (res.data.code === 0) {
            this.initTimeLineList()
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
        TimeApi.recoveryDelTime({_id: id}).then((res) => {
          if (res.data.code === 0) {
            this.initTimeLineList()
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
        TimeApi.delTime({_id: id}).then((res) => {
          if (res.data.code === 0) {
            this.initTimeLineList()
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
      this.initTimeLineList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    jioinImgUrl (url) {
      this.imgdialogVisible = true
      this.thumb_img = url
    },
    initTimeLineList () {
      TimeApi.timeList(this.listQuery, this.filterobj).then((res) => {
        if (res.data.code === 0) {
          this.tableData = res.data.timeLineList
          this.total = res.data.total
          this.loading = false
        }
      })
    }
  },
  watch: {
    filterobj: {
      handler () {
        this.initTimeLineList()
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
    this.initTimeLineList()
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
