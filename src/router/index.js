import Vue from 'vue'
import Router from 'vue-router'
import office from '@/components/office'
import videoplayer from '@/components/videoplayer'
import reader from '@/components/reader'
import street from '@/components/street'
import login from '@/user/login'

Vue.use(Router)

export default new Router({
  routes: [               //配置路由 这是个数组
    {                     //每个链接都是一个对象
      path: '/',          //链接路径
      name: 'street',     //路由名称
      component: street   //对应的组建模板（上面import的vue文件）
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path:'/office',
      name:'officePage',
      component:office
    },
    {
      path:'/street',
      name:'street',
      component:street
    }, 
    {
      path: '/',
      name: 'videoplayer',
      component: videoplayer
    },
    {
      path: '/',
      name: 'reader',
      component: reader
    },

  ]
})
