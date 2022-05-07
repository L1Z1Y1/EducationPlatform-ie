import Vue from 'vue'
import Router from 'vue-router'
import office from '@/components/office'
import videoplayer from '../components/videoplayer'
import reader from '../components/reader'

Vue.use(Router)

export default new Router({
  routes: [               //配置路由 这是个数组
    {                     //每个链接都是一个对象
      path: '/',          //链接路径
      name: 'office',     //路由名称
      component: office   //对应的组建模板（上面import的vue文件）
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
