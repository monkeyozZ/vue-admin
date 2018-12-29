import LoadComponent from './importfile'
const main = LoadComponent('main/index')
const staticRoutes = [
  {
    path: '/',
    redirect: '/login',
    component: LoadComponent('login/index')
  },
  {
    path: '/login',
    name: 'login',
    component: LoadComponent('login/index')
  },
  {
    path: '/index',
    redirect: '/index/dashbodrd',
    component: main,
    children: [{
      path: 'dashbodrd',
      name: 'dashbodrd',
      component: LoadComponent('index/index')
    }]
  },
  {
    path: '/article',
    component: main,
    meta: { icon: 'pen', title: '文章管理', hidden: false },
    children: [
      {
        path: 'index',
        name: 'articleindex',
        component: LoadComponent('article/index'),
        meta: { title: '文章列表', hidden: false }
      },
      {
        path: 'insert',
        name: 'articleinsert',
        component: LoadComponent('article/insert'),
        meta: { title: '发布文章', hidden: false }
      },
      {
        path: 'tag',
        name: 'articletag',
        component: LoadComponent('article/tag'),
        meta: { title: '文章标签', hidden: false }
      }
    ]
  },
  {
    path: '/comment',
    component: main,
    meta: { icon: 'comment', title: '评论管理', hidden: false },
    children: [
      {
        path: 'index',
        name: 'commentindex',
        component: LoadComponent('comment/index'),
        meta: { title: '所有评论', hidden: false }
      }
    ]
  },
  {
    path: '/timeline',
    component: main,
    meta: { icon: 'time', title: '时间轴', hidden: false },
    children: [
      {
        path: 'index',
        name: 'timelineindex',
        component: LoadComponent('time/index'),
        meta: { title: '时间轴列表', hidden: false }
      },
      {
        path: 'insert',
        name: 'timelineinsert',
        component: LoadComponent('time/insert'),
        meta: { title: '时间轴续写', hidden: false }
      }
    ]
  },
  {
    path: '*',
    redirect: '/401'
  },
  {
    path: '/401',
    redirect: '/error/401',
    component: main,
    children: [{
      path: '/error/401',
      component: LoadComponent('error/401')
    }]
  }
]

export default staticRoutes