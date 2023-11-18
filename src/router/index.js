import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/', component: () => import('../components/Manage.vue'), redirect: "/user",
    children: [
      {path: 'home', name: '首页', component: () => import('../views/Home.vue')},
      {path: 'user', name: '用户中心', component: () => import('../views/User.vue')},
      {path: 'autotest', name: '自动化测试', component: () => import('../views/AutoTestManage.vue')},
      {path: 'test', name: '造数中心', component: () => import('../views/DataCenter.vue')},
      {path: 'jiradata', name: '数据统计', component: () => import('../views/JiraDataCount.vue')},

    ]
  },
  {path: '/Login', name: '登录', component: () => import('../views/Login.vue')},
  {path: '/mindmap', name: '登录', component: () => import('../views/MindMap.vue')},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由守卫
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem("user"); // 假设你的登录信息存在 localStorage 中

  if (!isAuthenticated && to.name !== '登录') {
    // 如果用户未登录且尝试访问非登录页，等待异步组件加载完成后再执行重定向
    await router.app.$nextTick();
    next("/login");
    next("/login");

  } else {
    // 用户已登录或访问登录页时，放行
    localStorage.setItem("currentPathName", to.name);
    store.commit("setPath");
    next();
  }
});

export default router
