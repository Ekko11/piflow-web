import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
// push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}


export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/pages/login')
    },
    // {
    //   path: '/bootPage',
    //   name: 'bootPage',
    //   component: () => import('../components/pages/bootPage')
    // },
    {
      path: '/pdf',
      name: 'pdf',
      component: () => import('../components/compon/PdfShow')
    },
    // 门户界面
    {
      path: '/',
      name: '',
      component: () => import('../components/pages/Home/index.vue'),
      children:[
        // {
        //   path: '/',
        //   name: 'homeIndex',
        //   component: () => import('../components/pages/Home/Index/index'),
        //   children:[
        //     {
        //       path: '/',
        //       name: 'homeProcess',
        //       component: () => import('../components/pages/Home/Index/Process'),
        //     },
        //     {
        //       path: 'product',
        //       name: 'homeProduct',
        //       component: () => import('../components/pages/Home/Index/Product'),
        //     },
        //     {
        //       path: 'intro',
        //       name: 'homeIntro',
        //       component: () => import('../components/pages/Home/Index/Intro'),
        //     },
        //   ],
        // },
        // {
        //   path: 'list',
        //   name: 'homeList',
        //   component: () => import('../components/pages/Home/List'),
        // },
        {
          path: 'flowConfig',
          name: 'flowConfig',
          component: () => import('../components/pages/Home/Flow/FlowConfig'),
        },
        {
          path: 'flowProcess',
          name: 'flowProcess',
          component: () => import('../components/pages/Home/Flow/FlowProcess'),
        }
      ],
    },
    // 后台界面
    // {
    //   path: '/',
    //   name: 'main',
    //   component: () => import('../components/Main.vue'),
    //   redirect: '/',
    //   children: [
    //     {
    //       path: '/',
    //       name: 'content',
    //       component: () => import('../components/Content.vue'),
    //       redirect: '/',
    //       children: [
    //         {
    //           path: '/categoryManagement',
    //           name: 'categoryManagement',
    //           component: () => import('../components/pages/CategoryManagement')
    //         },
    //         {
    //           path: '/preference',
    //           name: 'preference',
    //           component: () => import('../components/pages/CategoryManagement/Preference')
    //         },
    //         {
    //           path: '/flowHistory',
    //           name: 'flowHistory',
    //           component: () => import('../components/pages/CategoryManagement/FlowHistory')
    //         },
    //         {
    //           path: '/producePublishManagement',
    //           name: 'producePublishManagement',
    //           component: () => import('../components/pages/DataProductManagement/Publish')
    //         },
    //         {
    //           path: '/produceAccreditManagement',
    //           name: 'produceAccreditManagement',
    //           component: () => import('../components/pages/DataProductManagement/Accredit')
    //         },
    //         {
    //           path: '/',
    //           name: 'sections',
    //           component: () => import('../components/pages/index')
    //         },
    //         {
    //           path: '/flow',
    //           name: 'flow',
    //           component: () => import('../components/pages/Flow')
    //         },
    //         {
    //           path: '/flowPublish',
    //           name: 'flowPublish',
    //           component: () => import('../components/pages/Flow/FlowPublish')
    //         },
    //         {
    //           path: '/group',
    //           name: 'group',
    //           component: () => import('../components/pages/Group')
    //         },
    //         {
    //           path: '/processes',
    //           name: 'processes',
    //           component: () => import('../components/pages/Processes')
    //         },
    //         {
    //           path: '/template',
    //           name: 'templates',
    //           component: () => import('../components/pages/Template')
    //         },
    //         {
    //           path: '/datasource',
    //           name: 'datasource',
    //           component: () => import('../components/pages/DataSource')
    //         },
    //         {
    //           path: '/schedule',
    //           name: 'schedule',
    //           component: () => import('../components/pages/Schedule')
    //         },
    //         {
    //           path: '/stopHub',
    //           name: 'stopHub',
    //           component: () => import('../components/pages/StopHub')
    //         },
    //         {
    //           path: '/sparkJar',
    //           name: 'SparkJar',
    //           component: () => import('../components/pages/SparkJar')
    //         },
    //         {
    //           path: '/testData',
    //           name: 'TestData',
    //           component: () => import('../components/pages/TestData')
    //         },
    //         //{
    //          // path: '/code',
    //        //   name: 'Code',
    //         //  component: () => import('../components/pages/Code')
    //        // },
    //         {
    //           path: '/publish',
    //           name: 'publish',
    //           component: () => import('../components/pages/publish')
    //         },
    //         {
    //           path: '/stopProperties',
    //           name: 'stopProperties',
    //           component: () => import('../components/pages/publish/properties')
    //         },
    //         //{
    //         //  path: '/codeDetailed',
    //         //  name: 'codeBlock',
    //         //  component: () => import('../components/pages/Code/codeBlock')
    //        // },
    //         {
    //           path: '/admin',
    //           name: 'admin',
    //           component: () => import('../components/pages/Admin')
    //         },
    //         {
    //           path: '/stopsComponent',
    //           name: 'stopsComponent',
    //           component: () => import('../components/pages/StopsComponent')
    //         },
    //         {
    //           path: '/globalVariable',
    //           name: 'globalVariable',
    //           component: () => import('../components/pages/Admin/globalVariable')
    //         },
    //         // {
    //         //   path: '/user',
    //         //   name: 'user',
    //         //   component: () => import('../components/pages/User')
    //         // },
    //         {
    //           path: '/user',
    //           name: 'user',
    //           component: () => import('../components/pages/User/index')
    //         },
    //         {
    //           path:'/log',
    //           name:'log',
    //           component:() => import('../components/pages/User/log')
    //         },
    //         {
    //           path:'/modification',
    //           name:'modification',
    //           component:() => import('../components/pages/User/modification')
    //         },
    //         {
    //           path:'/bindingAccount',
    //           name:'bindingAccount',
    //           component:() => import('../components/pages/User/bindingAccount')
    //         },
    //         {
    //           path:'/visualization/database',
    //           name:'VisualizationDataBase',
    //           component:() => import('../components/pages/Visualization/DataBase')
    //         },
    //         {
    //           path:'/visualization/datasource',
    //           name:'VisualizationDataSource',
    //           component:() => import('../components/pages/Visualization/DataSource')
    //         },
    //         {
    //           path:'/visualization/visualconfig',
    //           name:'VisualizationVisualConfig',
    //           component:() => import('../components/pages/Visualization/VisualConfig')
    //         }
    //       ]
    //     },
    //     {
    //       path: '/drawingBoard',
    //       name: 'drawingboard',
    //       component: () => import('../components/pages/DrawingBoard')
    //     },
    //     {
    //       path: '/graphconfig',
    //       name: 'GraphConfig',
    //       component: () => import('../components/pages/Visualization/GraphConfig')
    //     },
    //   ]
    // }
  ]
})
