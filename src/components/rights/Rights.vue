<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="user">
      <el-breadcrumb-item :to="{ path: '/home' }">2A214</el-breadcrumb-item>
      <el-breadcrumb-item>艾欧尼亚</el-breadcrumb-item>
      <el-breadcrumb-item>诺克萨斯</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格组件 -->
    <el-table :data="rightList" style-width="100%;">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template slot-scope="scope">
          <span v-if="+scope.row.level === 0">一级</span>
          <span v-else-if="+scope.row.level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    // 获取所有的权限数据
    async getRightList() {
      let res = await this.axios.get('rights/list')
      let {
        meta: {status},
        data
      } = res
      console.log(res)
      if (status === 200) {
        this.rightList = data
      }
    }
  },
  created() {
    this.getRightList()
  }
}
</script>

<style lang="less" scope>
.user{
  // width: 200px;
  height: 30px;
  line-height: 30px;
  background-color: skyblue;
  margin-bottom: 10px;
}
</style>
