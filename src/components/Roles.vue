<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="user">
      <el-breadcrumb-item :to="{ path: '/home' }">2A214</el-breadcrumb-item>
      <el-breadcrumb-item>艾欧尼亚</el-breadcrumb-item>
      <el-breadcrumb-item>诺克萨斯</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格组件 -->
    <el-table :data="rolesList" style-width="100%;">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span v-if="row.children.length === 0">暂无权限</span>
          <!-- 显示一级分类 -->
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag closable  @close="delRight(row,l1.id)">{{l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
              </el-col>
            <el-col :span="20">
              <!-- 二级分类 -->
              <el-row v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4" class="l2">
                  <el-tag closable type="success" @close="delRight(row,l2.id)">{{l2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级分类 -->
                  <span v-for="l3 in l2.children" :key="l3.id">
                    <el-tag class="l3" closable type="warning"  @close="delRight(row,l3.id)">{{l3.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="校色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
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
          <el-button type="success" icon="el-icon-check" plain size="mini" @click="showAssignDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="角色授权" :visible.sync="assignDialogVisible" width="40%">
      <el-tree :data="data" :props="defaultProps" show-checkbox
        ref="tree"
        default-expand-all
        node-key="id"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">分配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      assignDialogVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  methods: {
    async getRolesList() {
      let res = await this.axios.get('roles')
      console.log(res)
      if (res.meta.status === 200) {
        this.rolesList = res.data
      }
    },
    async delRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        role.children = data
        this.$message.success('成功了')
      }
    },
    async showAssignDialog(role) {
      // 显示对话框
      this.roleId = role.id
      this.assignDialogVisible = true
      // 发送ajax请求，获取到所有的权限的数据
      let res = await this.axios.get('rights/tree')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.data = data
        console.log(this.data)
      }
      // 让节点选中
      // 找到当前角色有拥有的所有的三级权限
      // console.log(role)
      let ids = []
      role.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assignRoles() {
      let q = this.$refs.tree.getCheckedKeys()
      let w = this.$refs.tree.getHalfCheckedKeys()
      let rids = q.concat(w).join()
      // 发送ajax
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      let {
        meta: {status}
      } = res
      if (status === 200) {
        this.getRolesList()
        this.assignDialogVisible = false
        this.$message.success('分配成功')
      } else {
        this.$message.error('分配失败')
      }
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style style="lang" scope>
  .user{
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: skyblue;
  }
  .l1{
    margin-bottom: 5px;
    border-bottom: 1px dotted #ccc;
  }
  .l2{
    margin-bottom: 5px;
  }
  .l3{
    margin-right: 7px;
  }
</style>
