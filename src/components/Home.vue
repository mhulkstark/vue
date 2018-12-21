<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <span>欢迎光临</span>
        <a href="javascript:;">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {

}
</script>

<style lang="less" scoped>
// scoped: 如果设置了，表示样式只会在当前组件生效， 我们的style都应该scoped
// 如果当前组件添加了scoped属性，  1. 组件中所有的元素都会添加一个随机属性
//  data-v-xxxxx
// 2. 我们写的所有的样式的都会自动添加上属性选择器  div [data-v-xxxxx]
.home{
  height: 100%;
  .el-header {
    // height: 60px;
    display: flex;
    background-color: skyblue;
    .logo {
      width: 200px;
      background-image: url('~@/assets/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .title{
      h1{
        text-align: center;
        line-height: 60px;
        font-size: 30px;
        color: #fff;
      }
      flex: 2;
    }
    .logout{
      float: right;
      line-height: 60px;
      height: 60px;
    }
  }

  .el-aside{
    background-color: #545C64;
  }
}
</style>
