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
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="showEditDialog(scope.row)"></el-button>
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
          <!-- 添加用户的对话框 -->
          <!--
            el-dialog：整个对话框组件
            visible： 对话框是否可见
          -->
        <!-- <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
          <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" placeholder="请输入用户邮箱"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile" placeholder="请输入用户手机"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog> -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
          <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
            <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" placeholder="请输入用户名" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" placeholder="请输入用密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" placeholder="请输入邮箱" ></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile" placeholder="请输入合法的手机号" ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
      <!-- 修改用户 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
        <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules" status-icon>
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" placeholder="输入用户名" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" placeholder="输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile" placeholder="输入合法手机号"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
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
      // 控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 9, message: '用户名长度在3-9位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度在6-12位', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入一个合法的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入一个合法的手机号',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
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
        let { meta: { status }, data: { users, total } } = res
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
      })
        .then(() => {
          return this.axios({
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
        })
        .catch(() => {
          this.$message.info('取消删除成功')
        })
    },
    changeState(user) {
      // console.log(users)
      // 发送ajax
      this.axios({
        method: 'put',
        url: `users/${user.id}/state/${user.mg_state}`
      }).then(res => {
        console.log(res.data)
        if (res.meta.status === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    search() {
      // 搜索的时候，把当前页第一页
      this.currentPage = 1
      this.getUserList()
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    // addUser() {
    //   // 第一次发送前要进行表单验证功能
    //   this.$refs.addForm.validate(valid => {
    //     console.log(valid)
    //     if (!valid) return false
    //     this.axios({
    //       method: 'post',
    //       url: 'users',
    //       data: this.addForm
    //     }).then(res => {
    //       console.log(res)
    //       if (res.meta.status === 201) {
    //         this.total++
    //         this.currentPage = Math.ceil(this.total / this.pageSize)
    //         this.getUserList()
    //         this.$refs.addForm.resetFields()
    //         this.addDialogVisible = false
    //         this.$message.success('添加成功')
    //       } else {
    //         this.$message.error('添加失败')
    //       }
    //     })
    //   })
    // },
    addUser() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return false
        this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        }).then(res => {
          console.log(res)
          if (res.meta.status === 201) {
            this.getUserList()
            this.$refs.addForm.resetFields()
            this.addDialogVisible = false
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.$message.success('添加成功')
          } else {
            this.$message.error('添加失败')
          }
        })
      })
    },
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm.id = row.id
      // console.log(this.editForm.id)
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    editUser() {
      // 在发送第一次ajax之前要进行表单校验
      this.$refs.editForm.validate(valid => {
        if (!valid) return false
        // 发送ajax
        this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        }).then(res => {
          console.log(res.data)
          if (res.meta.status === 200) {
            this.getUserList()
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.$message.success('成功了')
          } else {
            this.$message.error('失败了')
            console.log(res.data)
          }
        })
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.user {
  height: 40px;
  // width: 200px;
  line-height: 40px;
  background-color: skyblue;
  padding-left: 10px;
  margin-bottom: 5px;
}
.input-with-select {
  width: 300px;
  margin-bottom: 5px;
}
</style>
