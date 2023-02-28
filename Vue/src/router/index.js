import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/',
    children: [{
      path: '/',
      name: 'Welcome',
      component: () => import('@/views/welcome/Welcome'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/login',
    component: () => import('@/views/Login'),
    hidden: true
  },

  /* 病虫害百科管理*/
  {
    path: '/wiki',
    component: Layout,
    redirect: '/wiki/insect',
    name: 'Example',
    meta: { title: '病虫害百科管理', icon: 'bug' },
    children: [
      {
        path: 'insect',
        name: 'Insect',
        component: () => import('@/views/insect/Insect'),
        meta: { title: '害虫百科' }
      },
      {
        path: 'plant',
        name: 'Plant',
        component: () => import('@/views/plant/Plant'),
        meta: { title: '患病百科' }
      },
      {
        path: 'drug',
        name: 'Drug',
        component: () => import('@/views/drug/drug'),
        meta: { title: '农药百科' }
      }
    ]
  },

  /* 病虫害百科管理*/
  {
    path: '/article',
    component: Layout,
    redirect: '/article/teach',
    name: 'Example',
    meta: { title: '农粮文章管理', icon: 'education' },
    children: [
      {
        path: 'news',
        name: 'Plant',
        component: () => import('@/views/news/News'),
        meta: { title: '农粮资讯' }
      },
      {
        path: 'teach',
        name: 'Teach',
        component: () => import('@/views/teach/Teach'),
        meta: { title: '种植攻略' }
      }
    ]
  },

  /* 病虫害百科管理*/
  {
    path: '/shopping',
    component: Layout,
    redirect: '/shopping/shopping',
    name: 'Example',
    meta: { title: '农粮市场管理', icon: 'shopping' },
    children: [
      {
        path: 'news',
        name: 'Plant',
        component: () => import('@/views/shopping/shopping'),
        meta: { title: '农商品管理' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://www.upcl.ltd/zhihuinongtian/welcome.html',
        meta: { title: '关于我们', icon: 'guide' }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  /* 错误页面必须放在最后*/
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
