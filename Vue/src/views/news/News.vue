<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="输入文章标题筛选列表"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery('title')"
        />
      </el-form-item>
      <el-form-item label="当前状态" prop="status">
        <el-select v-model="status" clearable placeholder="根据选择当前状态搜索" @change="selectChanged">
          <el-option
            v-for="item in statuslist"
            :key="item.index"
            :label="item.status"
            :value="item.index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table ref="dragTable" v-loading="loading" :data="newsList" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="标题" width="250">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="作者">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="时间">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="阅读量">
        <template slot-scope="{row}">
          <span>{{ row.reading }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="文章内容">
        <template slot-scope="{row}">
          <span>{{ row.cont_show }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="当前状态" width="110" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >编辑当前百科
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除当前百科
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="total,prev, pager, next, jumper"
      :current-page.sync="queryParams.pageNum"
      :page-size="queryParams.pageSize"
      :total="total"
      @current-change="getList"
    />

    <!-- 添加或修改资讯信息对话框 -->
    <el-dialog :title="title" :visible.sync="show" width="1000px" append-to-body>
      <el-form ref="NewsByIdList" :model="NewsByIdList" :rules="rules" label-width="120px">
        <el-form-item label="文章当前状态" prop="status">
          <el-select v-model="NewsByIdList.status" filterable placeholder="修改文章状态">
            <el-option
              v-for="item in statuslist"
              :key="item.index"
              :label="item.status"
              :value="item.status"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="NewsByIdList.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章作者" prop="author">
          <el-input v-model="NewsByIdList.author" placeholder="请输入文章作者" />
        </el-form-item>
        <el-form-item label="文章图片" prop="img">
          <el-input v-model="NewsByIdList.img" placeholder="请输入文章图片" />
        </el-form-item>
        <el-form-item label="文章内容">
          <TinymceEditor ref="tincymce" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('NewsByIdList')">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import TinymceEditor from '@/components/tinymce/TinymceEditor'
import qs from 'qs'

export default {
  name: 'News',
  components: {
    TinymceEditor
  },
  data() {
    return {
      url: 'https://www.upcl.ltd:9000/',
      // url: 'http://localhost:9000/',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 8,
        title: undefined,
        roleKey: undefined,
        status: undefined
      },
      statuslist: [{
        index: 0,
        status: '已发布'
      }, {
        index: 1,
        status: '已下线'
      }],
      status: '',
      // 显示搜索条件
      showSearch: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 日期范围
      dateRange: [],
      // 全部资讯数据
      newsList: [],
      // 单个资讯数据
      NewsByIdList: {
        id: 0,
        title: '',
        author: '',
        create_time: '6',
        img: '',
        cont: '',
        cont_show: ' ',
        status: ''
      },
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      show: false,
      flage: 0,
      // 表单校验
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入文章来源', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传文章图片', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 表单重置 */
    reset() {
      this.NewsByIdList = {}
      // this.queryParams = {}
      // this.category = ''
      // this.plant = ''
    },
    selectChanged(value) {
      if (value === '') {
        this.getList()
      } else {
        this.searchList('status', this.statuslist[value].status)
      }
    },

    /** 搜索按钮操作 */
    handleQuery(row) {
      console.log(row)
      this.queryParams.pageNum = 1
      this.searchList(row, this.queryParams.title)
      if (row === 'title') {
        this.searchList(row, this.queryParams.title)
      } else if (row === 'status') {
        this.searchList(row, this.queryParams.title)
      } else {
        this.$message({
          type: 'error',
          message: '无效搜索！'
        })
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      console.log((this.queryParams))
      this.flage = 1
      this.show = true
      this.title = '新增资讯百科'
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.flage = 2
      this.show = true
      this.title = '修改资讯百科'
      this.getNewsById(row.title)
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      this.$confirm('确定要删除 ' + row.title + ' 相关资讯信息吗？', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.delInsectById(row.title)
        })
    },

    /** 列出所有资讯 */
    getList() {
      this.$axios({
        url: this.url + 'get/news/all',
        method: 'post',
        data: qs.stringify({
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        })
      })
        .then((res) => {
          console.log(res)
          this.loading = false
          if (res.status === 200) {
            this.newsList = res.data.list
            this.total = res.data.total
          } else {
            alert('获取昆虫百科失败，检查网络')
          }
          console.log(this.newsList)
        })
    },

    /** 模糊搜索害虫百科 */
    searchList(row, value) {
      this.loading = true
      this.$axios({
        url: this.url + 'search/news',
        method: 'post',
        data: qs.stringify({
          key: row,
          value: value
        })
      })
        .then((res) => {
          this.loading = false
          if (res.status === 200) {
            this.newsList = res.data
            this.total = res.data.length
          } else {
            alert('搜索害虫百科失败，检查网络')
          }
        })
    },

    /** 根据名获取资讯信息 */
    getNewsById(title) {
      this.$axios.get(
        this.url + 'get/news?title=' + title
      )
        .then((res) => {
          if (res.status === 200) {
            this.NewsByIdList = res.data[0]
            this.$refs.tincymce.init_cont = this.NewsByIdList.cont
            this.$refs.tincymce.setCont()
          } else {
            alert('获取资讯百科失败，检查网络')
          }
        })
    },

    /** 更新资讯信息 */
    upForm() {
      this.$refs.tincymce.getCont()
      this.newsList.cont = this.$refs.tincymce.cont
      this.newsList.cont_show = this.$refs.tincymce.cont_show
      this.$axios({
        url: this.url + 'up/news',
        method: 'post',
        data: qs.stringify({
          id: this.NewsByIdList.id,
          title: this.NewsByIdList.title,
          author: this.NewsByIdList.author,
          img: this.NewsByIdList.img,
          cont: this.NewsByIdList.cont,
          cont_show: this.NewsByIdList.cont_show,
          status: this.NewsByIdList.status
        })
      }).then((res) => {
        console.log(res)
        this.show = false
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '更新资讯信息成功！'
          })
          this.getList()
        } else {
          this.$message({
            type: 'success',
            message: '更新资讯信息失败！'
          })
        }
      })
    },

    /** 提交表单 */
    submitForm(insectForm) {
      this.$refs[insectForm].validate((valid) => {
        if (valid) {
          if (this.flage === 1) {
            this.addForm()
          } else if (this.flage === 2) {
            this.upForm()
          }
        }
      })
    },

    /** 删除资讯信息 */
    delInsectById(row) {
      this.$axios({
        url: this.url + 'del/news',
        method: 'post',
        data: qs.stringify({
          title: row
        })
      }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '删除 ' + row + ' 相关信息成功！'
          })
          this.getList()
        }
      })
    },

    /** 添加资讯信息 */
    addForm() {
      this.$refs.tincymce.getCont()
      this.NewsByIdList.cont = this.$refs.tincymce.cont
      this.NewsByIdList.cont_show = this.$refs.tincymce.cont_show
      this.$axios({
        url: this.url + 'add/news',
        method: 'post',
        data: qs.stringify({
          title: this.NewsByIdList.title,
          author: this.NewsByIdList.author,
          img: this.NewsByIdList.img,
          cont: this.NewsByIdList.cont,
          cont_show: this.NewsByIdList.cont_show
        })
      }).then((res) => {
        if (res.data.code === 200) {
          this.show = false
          this.$message({
            type: 'success',
            message: '添加资讯信息成功'
          })
          this.getList()
        } else if (res.data.code === 400) {
          this.$message({
            type: 'success',
            message: '添加资讯信息失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '添加资讯信息失败'
          })
        }
      })
    },

    // 取消按钮
    cancel() {
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>
