import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
// 导入home组件
import Home from '../components/Home'
// 导入Users组件
import Users from '../components/Users'
// 导入Rights组件
import Rights from '../components/Rights'
// 导入Roles组件
import Roles from '../components/Roles'

Vue.use(Router)
/*
  配置子路由：
    1. 给某个路由配置children选项
    2. 要在当前路由对应的组件中配置一个<router-view></router-view>
*/
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      // 用于配置home的子路由
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        }
      ]
    }
  ]
})

// 给router对象注册一个导航守卫
// 将来所有的导航（路由发生了跳转）都要经过beforeEach
// to: 去哪儿
// from: 从哪儿
// next: 是否放行  next():表示直接放行   next('/login')表示跳转到/login
router.beforeEach((to, from, next) => {
  // console.log('哈哈哈')
  // console.log('to', to)
  // console.log('from', from)
  // 如果要去登录页，直接放行
  if (to.path === '/login') {
    // 直接放行
    next()
    return
  }
  // 如果不是登录， 判断是否有token，如果有，放行，如果没有，去登录
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
