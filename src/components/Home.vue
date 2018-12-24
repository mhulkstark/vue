<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <span>欢迎光临</span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <!--
        unique-opened:只能打开一个子菜单
        router:是否开启导航模式
       -->
      <el-aside width="200px">
        <el-menu
          default-active="1-1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
          >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
               <el-menu-item index="/users">
                <i class="el-icon-menu"></i>
                <span slot="title">用户列表</span>
               </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
               <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
               </el-menu-item>
               <el-menu-item index="/rights">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
               </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 实现子路由得出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    // 退出
    logout() {
      this.$confirm('你确定要推出?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message.success('退出成功')
          // 删除token
          localStorage.removeItem('token')
          // 回到登录页面
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message.info('取消退出')
        })
    }
  }
}
</script>

<style lang="less" scoped>
// scoped: 如果设置了，表示样式只会在当前组件生效， 我们的style都应该scoped
// 如果当前组件添加了scoped属性，  1. 组件中所有的元素都会添加一个随机属性
//  data-v-xxxxx
// 2. 我们写的所有的样式的都会自动添加上属性选择器  div [data-v-xxxxx]
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    display: flex;
    .logo {
      width: 180px;
      background-image: url('~@/assets/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .logout {
      width: 180px;
      text-align: right;
      line-height: 60px;
      font-weight: 700;
      a {
        color: yellow;
      }
    }
    .title {
      flex: 1;
      h1 {
        text-align: center;
        line-height: 60px;
        color: #fff;
        font-size: 30px;
      }
    }
  }

  .el-aside {
    background-color: #545c64;

    .el-submenu {
      width: 200px;
    }
  }

  .el-main {
    background-color: #eaeef1;
  }
}
</style>
