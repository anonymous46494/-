<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="农药名称" prop="roleName">
        <el-input
          v-model="queryParams.ch_name"
          placeholder="输入农药名称筛选列表"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery('ch_name')"
        />
      </el-form-item>

      <el-form-item label="农药类型" prop="category">
        <el-select v-model="category" clearable placeholder="点击选择或搜索" @change="selectChanged">
          <el-option
            v-for="item in categorylist"
            :key="item.index"
            :label="item.category"
            :value="item.index"
          />
        </el-select>
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
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="drugList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="农药名称" prop="ch_name" align="center" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="农药类型" prop="category" align="center" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="农药名称百科" prop="cont_show" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding">
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
      @current-change="pagination"
    />
    <!-- 添加或修改农药百科信息对话框 -->
    <el-dialog :title="title" :visible.sync="show" width="1000px" append-to-body>
      <el-form ref="DrugByIdList" :model="DrugByIdList" :rules="rules" label-width="120px">
        <el-form-item label="农药名称" prop="ch_name">
          <el-input v-model="DrugByIdList.ch_name" placeholder="请输入农药名称" />
        </el-form-item>
        <el-form-item label="农药类型" prop="category">
          <el-select v-model="DrugByIdList.category" filterable placeholder="点击选择或搜索">
            <el-option
              v-for="item in categorylist"
              :key="item.category"
              :label="item.category"
              :value="item.category"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="农药图片" prop="img">
          <el-input v-model="DrugByIdList.img" placeholder="请输入农药图片路径" />
        </el-form-item>
        <el-form-item label="农药介绍">
          <TinymceEditor ref="tincymce" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('DrugByIdList')">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import TinymceEditor from '@/components/tinymce/TinymceEditor'
import qs from 'qs'

export default {
  name: 'Drug',
  components: {
    TinymceEditor
  },
  data() {
    return {
      // url: 'https://www.upcl.ltd:9000/',
      url: 'http://localhost:9000/',
      categorylist: [{
        index: 0,
        category: '杀虫剂'
      }, {
        index: 1,
        category: '杀菌剂'
      }, {
        index: 2,
        category: '调节剂'
      }, {
        index: 3,
        category: '除草剂'
      }],
      category: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 8,
        roleName: undefined
      },
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
      // 全部农药数据
      drugList: [],
      // 单个农药数据
      DrugByIdList: {
        id: 0,
        ch_name: '',
        category: '',
        img: '',
        cont: '',
        cont_show: ''
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
        ch_name: [
          { required: true, message: '请输入农药名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择农药类型', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传农药图片', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 选择框 */
    selectChanged(value) {
      if (value === '') {
        this.getList()
      } else {
        this.searchList('category', this.categorylist[value].category)
      }
    },

    /** 表单重置 */
    reset() {
      this.DrugByIdList = {}
      // this.queryParams = {}
      this.category = ''
      this.drug = ''
    },
    /** 搜索按钮操作 */
    handleQuery(row) {
      console.log(row)
      this.queryParams.pageNum = 1
      if (row === 'ch_name') {
        this.searchList(row, this.queryParams.ch_name)
      } else if (row === 'en_name') {
        this.queryParams.ch_name = ''
        this.searchList(row, this.queryParams.en_name)
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
      this.title = '新增农药百科'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.flage = 2
      this.show = true
      this.title = '修改农药百科'
      this.getDrugById(row.ch_name)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      this.$confirm('确定要删除 ' + row.ch_name + ' 相关农药信息吗？', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.delDrugById(row.ch_name)
        })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    // 分页操作
    pagination() {
      if (this.category === '') {
        this.getList()
      } else {
        this.searchList()
      }
    },

    /** 列出所有农药百科 */
    getList() {
      console.log(this.queryParams.pageNum)
      console.log(this.queryParams.pageSize)
      this.$axios({
        url: this.url + 'get/drug/all',
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
            this.drugList = res.data.list
            this.total = res.data.total
          } else {
            alert('获取昆虫百科失败，检查网络')
          }
        })
    },

    /** 模糊搜索农药百科 */
    searchList(row, value) {
      console.log(this.queryParams.pageNum)
      console.log(this.queryParams.pageSize)
      this.loading = true
      this.$axios({
        url: this.url + 'search/drug',
        method: 'post',
        data: qs.stringify({
          key: row,
          value: value,
          pageNum: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        })
      })
        .then((res) => {
          console.log(res)
          this.loading = false
          if (res.status === 200) {
            this.drugList = res.data.list
            this.total = res.data.total
          } else {
            alert('搜索农药百科失败，检查网络')
          }
        })
    },

    /** 根据中文名获取农药信息 */
    getDrugById(ch_name) {
      this.$axios.get(
        this.url + 'get/drug?ch_name=' + ch_name
      )
        .then((res) => {
          if (res.status === 200) {
            this.DrugByIdList = res.data[0]
            this.$refs.tincymce.init_cont = this.DrugByIdList.cont
            this.$refs.tincymce.setCont()
          } else {
            alert('获取农药百科失败，检查网络')
          }
        })
    },

    /** 更新农药信息 */
    upForm() {
      this.$refs.tincymce.getCont()
      this.DrugByIdList.cont = this.$refs.tincymce.cont
      this.DrugByIdList.cont_show = this.$refs.tincymce.cont_show
      this.$axios({
        url: this.url + 'up/drug',
        method: 'post',
        data: qs.stringify({
          id: this.DrugByIdList.id,
          ch_name: this.DrugByIdList.ch_name,
          category: this.DrugByIdList.category,
          img: this.DrugByIdList.img,
          cont: this.DrugByIdList.cont,
          cont_show: this.DrugByIdList.cont_show
        })
      }).then((res) => {
        console.log(res)
        this.show = false
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '更新农药信息成功！'
          })
          this.getList()
        } else {
          this.$message({
            type: 'success',
            message: '更新农药信息失败！'
          })
        }
      })
    },

    /** 提交表单 */
    submitForm(drugForm) {
      this.$refs[drugForm].validate((valid) => {
        if (valid) {
          if (this.flage === 1) {
            this.addForm()
          } else if (this.flage === 2) {
            this.upForm()
          }
        }
      })
    },

    /** 删除农药信息 */
    delDrugById(row) {
      this.$axios({
        url: this.url + 'del/drug',
        method: 'post',
        data: qs.stringify({
          ch_name: row
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

    /** 添加农药信息 */
    addForm() {
      this.$refs.tincymce.getCont()
      this.DrugByIdList.cont = this.$refs.tincymce.cont
      this.DrugByIdList.cont_show = this.$refs.tincymce.cont_show
      this.$axios({
        url: this.url + 'add/drug',
        method: 'post',
        data: qs.stringify({
          ch_name: this.DrugByIdList.ch_name,
          category: this.DrugByIdList.category,
          img: this.DrugByIdList.img,
          cont: this.DrugByIdList.cont,
          cont_show: this.$refs.tincymce.cont_show
        })
      }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          this.show = false
          this.$message({
            type: 'success',
            message: '添加农药信息成功'
          })
          this.getList()
        } else if (res.data.code === 400) {
          this.$message({
            type: 'success',
            message: '添加农药信息失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '添加农药信息失败'
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
