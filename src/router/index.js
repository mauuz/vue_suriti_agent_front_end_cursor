import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { 
      title: '登录',
      requiresAuth: false // 不需要认证
    }
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    redirect: '/dashboard',
    meta: { 
      requiresAuth: true // 需要认证
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
              to.meta.title = `采购订单 ${to.params.id}`;
            }
          }
        ]
      },
      {
        path: 'inventory',
        name: 'Inventory',
        meta: { title: '库存' },
        children: [
          {
            path: '',
            name: 'InventoryManagement',
            component: () => import('@/views/inventory/management/index.vue'),
            meta: { title: '库存管理' }
          },
          {
            path: 'receipt',
            name: 'receiptManagement',
            component: () => import('@/views/inventory/receipt/index.vue'),
            meta: { title: '盘点管理' }
          },
          {
            path: 'receipt/:id',
            name: 'ReceiptDetail',
            component: () => import('@/views/inventory/receiptDetail/index.vue'),
            meta: { 
              title: '收货单详情',
              hideInMenu: true 
            },
            beforeEnter: (to) => {
              to.meta.title = `收货单详情 ${to.params.id}`;
            }
          }
        ]
      },
      {
        path: 'approval',
        name: 'Approval',
        meta: { title: '审批' },
        children: [
          {
            path: 'pending',
            name: 'PendingApproval',
            component: () => import('@/views/approval/pending/index.vue'),
            meta: { title: '待审批项目' }
          },
          {
            path: 'history',
            name: 'ApprovalHistory',
            component: () => import('@/views/approval/history/index.vue'),
            meta: { title: '审批历史' }
          },
          {
            path: 'detail/:id',
            name: 'ApprovalDetail',
            component: () => import('@/views/approval/detail/index.vue'),
            meta: {
              title: '审批详情',
              hideInMenu: true
            },
            beforeEnter: (to) => {
              to.meta.title = `审批详情 ${to.params.id}`;
            }
          }
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token');
  document.title = to.meta.title ? `Suriti ERP - ${to.meta.title}` : 'Suriti ERP';

  if (to.meta.requiresAuth && !token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else if (to.path === '/login' && token) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
