<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="害虫名" prop="roleName">
        <el-input
          v-model="queryParams.ch_name"
          placeholder="输入害虫名筛选列表"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery('ch_name')"
        />
      </el-form-item>
      <el-form-item label="害虫学名" prop="en_name">
        <el-input
          v-model="queryParams.en_name"
          placeholder="输入害虫学名筛选列表"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery('en_name')"
        />
      </el-form-item>
      <el-form-item label="危害农作物种" prop="plant">
        <el-select v-model="plant" multiple placeholder="点击选择" @change="selectRole" >
          <el-option
            v-for="item in plantlist"
            :key="item.index"
            :label="item.plant"
            :value="item.index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="害虫所属目" prop="category">
        <el-select v-model="category" @change="selectChanged" clearable placeholder="点击选择或搜索">
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

    <el-table v-loading="loading" :data="insectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="害虫名" prop="ch_name" align="center" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="害虫学名" prop="en_name" align="center" :show-overflow-tooltip="true" width="180" />
      <el-table-column label="害虫所属目" prop="category" align="center" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="危害农作物种类" prop="role" align="center" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="害虫百科" prop="cont_show" align="center" :show-overflow-tooltip="true"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
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

    <!-- 添加或修改害虫百科信息对话框 -->
    <el-dialog :title="title" :visible.sync="show" width="1000px" append-to-body>
      <el-form ref="InsectByIdList" :model="InsectByIdList" :rules="rules" label-width="120px">
        <el-form-item label="害虫名" prop="ch_name">
          <el-input v-model="InsectByIdList.ch_name" placeholder="请输入害虫名" />
        </el-form-item>
        <el-form-item label="害虫学名" prop="en_name">
          <el-input v-model="InsectByIdList.en_name" placeholder="请输入害虫学名" />
        </el-form-item>
        <el-form-item label="害虫所属目" prop="category">
          <el-select v-model="InsectByIdList.category" filterable placeholder="点击选择或搜索">
            <el-option
              v-for="item in categorylist"
              :key="item.index"
              :label="item.category"
              :value="item.category"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="危害农作物种" prop="plant">
          <el-select v-model="InsectByIdList.role" multiple placeholder="点击选择">
            <el-option
              v-for="item in plantlist"
              :key="item.index"
              :label="item.plant"
              :value="item.plant"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="害虫图片地址" prop="img">
          <el-input v-model="InsectByIdList.img" placeholder="请输入害虫图片" />
        </el-form-item>
        <el-form-item label="害虫介绍">
          <TinymceEditor ref="tincymce"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('InsectByIdList')">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import TinymceEditor from '@/components/tinymce/TinymceEditor'
import qs from 'qs'

export default {
  name: 'Insect',
  components: {
    TinymceEditor
  },
  data() {
    return {
      // url: 'https://www.upcl.ltd:9000/',
      url: 'http://localhost:9000/',
      categorylist: [{
        index: 0,
        category: '直翅目'
      }, {
        index: 1,
        category: '缨翅目'
      }, {
        index: 2,
        category: '同翅目'
      }, {
        index: 3,
        category: '半翅目'
      }, {
        index: 4,
        category: '脉翅目'
      }, {
        index: 5,
        category: '鳞翅目'
      }, {
        index: 6,
        category: '鞘翅目'
      }, {
        index: 7,
        category: '膜翅目'
      }, {
        index: 8,
        category: '双翅目'
      }, {
        index: 9,
        category: '蜱螨目'
      }
      ],
      category: '',
      plantlist: [{
        index: '0',
        plant: '水稻'
      }, {
        index: '1',
        plant: '小麦'
      }, {
        index: '2',
        plant: '玉米'
      }],
      plant: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 8,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
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
      // 全部害虫数据
      insectList: [],
      // 单个害虫数据
      InsectByIdList: {
        id: 0,
        ch_name: '',
        en_name: '',
        category: '',
        role: '',
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
          { required: true, message: '请输入害虫名', trigger: 'blur' }
        ],
        en_name: [
          { required: true, message: '请输入害虫学名', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择害虫所属目', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传害虫图片', trigger: 'blur' }
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

    /** 选择框 */
    selectRole(value) {
      console.log(this.plant)
      if (value === '') {
        this.getList()
      } else {
        this.searchList('role', this.plantlist[value].plant)
      }
    },
    /** 表单重置 */
    reset() {
      this.InsectByIdList = {}
      // this.queryParams = {}
      this.category = ''
      this.plant = ''
    },
    /** 搜索按钮操作 */
    handleQuery(row) {
      console.log(row)
      this.queryParams.pageNum = 1
      if (row === 'ch_name') {
        this.queryParams.en_name = ''
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
      this.flage = 1
      this.show = true
      this.title = '新增害虫百科'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.flage = 2
      this.show = true
      this.title = '修改害虫百科'
      this.getInsectById(row.ch_name)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      this.$confirm('确定要删除 ' + row.ch_name + ' 相关害虫信息吗？', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.delInsectById(row.ch_name)
        })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 列出所有害虫百科 */
    getList() {
      // this.$axios.get(
      //   this.url + 'get/insect/all'
      // )
      console.log(this.queryParams.pageNum)
      console.log(this.queryParams.pageSize)
      this.$axios({
        url: this.url + 'get/insect/all',
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
            this.insectList = res.data.list
            this.total = res.data.total
          } else {
            alert('获取昆虫百科失败，检查网络')
          }
        })
    },

    /** 模糊搜索害虫百科 */
    searchList(row, value) {
      this.loading = true
      this.$axios({
        url: this.url + 'search/insect',
        method: 'post',
        data: qs.stringify({
          key: row,
          value: value
        })
      })
        .then((res) => {
          this.loading = false
          if (res.status === 200) {
            this.insectList = res.data
            this.total = res.data.length
          } else {
            alert('搜索害虫百科失败，检查网络')
          }
        })
    },

    /** 根据名获取害虫信息 */
    getInsectById(ch_name) {
      this.$axios.get(
        this.url + 'get/insect?ch_name=' + ch_name
      )
        .then((res) => {
          if (res.status === 200) {
            this.InsectByIdList = res.data[0]
            this.$refs.tincymce.init_cont = this.InsectByIdList.cont
            this.$refs.tincymce.setCont()
            console.log(this.InsectByIdList)
          } else {
            alert('获取害虫百科失败，检查网络')
          }
        })
    },

    /** 更新害虫信息 */
    upForm() {
      this.$refs.tincymce.getCont()
      this.InsectByIdList.cont = this.$refs.tincymce.cont
      this.InsectByIdList.cont_show = this.$refs.tincymce.cont_show
      this.$axios({
        url: this.url + 'up/insect',
        method: 'post',
        data: qs.stringify({
          id: this.InsectByIdList.id,
          ch_name: this.InsectByIdList.ch_name,
          en_name: this.InsectByIdList.en_name,
          category: this.InsectByIdList.category,
          img: this.InsectByIdList.img,
          cont: this.InsectByIdList.cont,
          cont_show: this.InsectByIdList.cont_show
        })
      }).then((res) => {
        console.log(res)
        this.show = false
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '更新害虫信息成功！'
          })
          this.getList()
        } else {
          this.$message({
            type: 'success',
            message: '更新害虫信息失败！'
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

    /** 删除害虫信息 */
    delInsectById(row) {
      this.$axios({
        url: this.url + 'del/insect',
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

    /** 添加害虫信息 */
    addForm() {
      this.$refs.tincymce.getCont()
      this.InsectByIdList.cont = this.$refs.tincymce.cont
      this.InsectByIdList.cont_show = this.$refs.tincymce.cont_show
      this.$axios({
        url: this.url + 'add/insect',
        method: 'post',
        data: qs.stringify({
          ch_name: this.InsectByIdList.ch_name,
          en_name: this.InsectByIdList.en_name,
          category: this.InsectByIdList.category,
          img: this.InsectByIdList.img,
          cont: this.InsectByIdList.cont,
          cont_show: this.InsectByIdList.cont_show
        })
      }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          this.show = false
          this.$message({
            type: 'success',
            message: '添加害虫信息成功'
          })
          this.getList()
        } else if (res.data.code === 400) {
          this.$message({
            type: 'success',
            message: '添加害虫信息失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '添加害虫信息失败'
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
