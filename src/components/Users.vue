<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="user">
      <el-breadcrumb-item :to="{ path: '/home' }">2A214</el-breadcrumb-item>
      <el-breadcrumb-item>艾欧尼亚</el-breadcrumb-item>
      <el-breadcrumb-item>诺克萨斯</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
    <!-- 表格组件 -->
    <!-- 在el-tabel中，如果想要自定义列模版
      el-table : 表格组件
      data : 指定表格最终需要渲染的数据（数组）
      在el-table-column中使用template
      <template slot-scope="scope">自己定义的内容</template>
     -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <!-- 在自定义列模版中，如何访问到当前列的数据  此处是获取用户状态 -->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delUser(scope.row.id)"
            plain
            size="mini"
          ></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页
      @size-change: 表示每页的条数发生了改变，会触发handleSizeChange
      @current-change: 当前页发生改变
      current-page: 指定当前页面
      page-sizes: 指定选择每页条数的数组
      page-size: 每页的条数
      total:指定总条数
      layout: 指定分页的空间  -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="total">
      </el-pagination>
      <el-dialog title="添加用户" :visible.sync="addDialogVisible"  width="40%">
        <el-form ref="addForm" :model="addForm" label-with="80px" :rules="rules" status-icon>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" status-icon>
            <el-input v-model="addForm.password" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
// 引入axios
// import axios from 'axios'
export default {
  data() {
    return {
      // 用户列表
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不为空', trigger: 'blur' },
          { min: 3, max: 9, message: '用户名长度在3-9位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不为空', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度在6-12位', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱模式', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '手机号不合法',
            trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getUserList() {
      // axios如果是get/delete请求，参数要么直接拼地址栏，要么放到params中
      // 如果post/put/patch请求，参数放到data中
      this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        let {
          meta: { status },
          data: { users, total }
        } = res
        if (status === 200) {
          this.userList = users
          this.total = total
        }
      })
    },
    handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.getUserList()
    },
    delUser(id) {
      this.$confirm('你确定要删除么？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'delete',
          url: `users/${id}`
          // 要把token带过来
          // headers: {
          //   Authorization: localStorage.getItem('token')
          // }
        }).then(res => {
          if (res.meta.status === 200) {
            // 若当前页只有一条数据则删除后显示上一页，并且要渲染上一页
            if (this.userList.length <= 1 && this.currentPage > 1) {
              this.currentPage--
            }
            this.getUserList()
            this.$message.success('删除成功')
          }
        })
      }).catch(() => {
        this.$message.info('取消删除成功')
      })
    },
    search() {
      // 搜索的时候，把当前页第一页
      this.currentPage = 1
      this.getUserList()
    },
    changeState(user) {
      this.axios({
        method: 'put',
        url: `/users/${user.id}/state/${user.mg_state}`
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          // this.getUserList()
          this.$message.success('修改状态成功了')
        } else {
          this.$message.error('修改状态失败了')
        }
      })
    },
    addUser() {
      // 1. 表单校验功能
      // 2. 发送ajax请求添加数据
      // 3. 重新渲染  关闭模态框  重置样式
      this.$refs.addForm.validate(valid => {
        console.log(valid)
        if (!valid) return false
        // 校验成功发送ajax
        this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        }).then(res => {
          let {
            meta: { status, msg }
          } = res
          if (status === 201) {
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            // 重新渲染
            this.getUserList()
            // 重置表单样式
            this.$refs.addForm.resetFields()
            // 影藏模态框
            this.addDialogVisible = false
            // 提示信息
            this.$message.success('添加成功')
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    showAddDialog() {
      this.addDialogVisible = true
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.user{
  height: 40px;
  // width: 200px;
  line-height: 40px;
  background-color: skyblue;
  padding-left: 10px;
  margin-bottom: 5px;
}
.input-with-select{
  width: 300px;
  margin-bottom: 5px;
}
</style>
