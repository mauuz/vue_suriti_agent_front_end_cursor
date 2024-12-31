import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { 
        title: '登录',
        requiresAuth: false 
      }
    },
    {
      path: '/',
      component: () => import('@/views/home/index.vue'),
      redirect: '/dashboard',
      meta: { 
        requiresAuth: true  // 需要认证
      },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: 'quotation',
          name: 'Quotation',
          component: () => import('@/views/quotation/index.vue'),
          meta: { title: '报价' }
        },
        {
          path: 'purchase',
          name: 'Purchase',
          meta: { title: '采购' },
          children: [
            {
              path: 'orders',
              name: 'PurchaseOrders',
              component: () => import('@/views/purchase/orders/index.vue'),
              meta: { title: '采购单管理' }
            },
            {
              path: 'suppliers',
              name: 'Suppliers',
              component: () => import('@/views/purchase/suppliers/index.vue'),
              meta: { title: '供应商管理' }
            },
            {
              path: 'orders/:id',
              name: 'PurchaseOrderDetail',
              component: () => import('@/views/purchase/detail/index.vue'),
              meta: {
                hideInMenu: true,
              },
              beforeEnter: (to) => {
                // 动态设置 meta title
                to.meta.title = `采购订单 ${to.params.id}`;
              }
            }
          ]
        },
        {
          path: 'inventory',
          name: 'Inventory',
          component: () => import('@/views/inventory/index.vue'),
          meta: { title: '库存' }
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  document.title = to.meta.title ? ` Suriti ERP- ${to.meta.title}` : 'Suriti ERP'
  next()
  // if (to.meta.requiresAuth !== false && !token) {
  //   // 需要认证但未登录，重定向到登录页
  //   next({
  //     path: '/login',
  //     query: { redirect: to.fullPath } // 保存原目标路径
  //   })
  // } else if (to.path === '/login' && token) {
  //   // 已登录时访问登录页，重定向到首页
  //   next({ path: '/' })
  // } else {
  //   next({ path: '/' })
  // }
})

export default router
