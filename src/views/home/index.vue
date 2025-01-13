<template>
  <a-layout class="layout-demo">
    <a-layout-sider
      theme="dark"
      breakpoint="lg"
      collapsible
      :collapsed="collapsed"
      @collapse="onCollapse"
    >
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo" />
      </div>
      <a-menu
        :defaultOpenKeys="['0_3']"
        :defaultSelectedKeys="['0_1']"
        @menuItemClick="onClickMenuItem"
      >
        <a-menu-item key="0_1">
          <icon-home />
          首页
        </a-menu-item>
        <a-menu-item key="0_2">
          <icon-calendar />
          报价
        </a-menu-item>
        <a-sub-menu key="0_3">
          <template #title>
            <icon-file />
            采购
          </template>
          <a-menu-item key="0_3_1">采购单管理</a-menu-item>
          <a-menu-item key="0_3_2">供应商管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="0_5">
          <template #title>
            <icon-check-circle />
            审批
          </template>
          <a-menu-item key="0_5_1">待审批项目</a-menu-item>
          <a-menu-item key="0_5_2">审批历史</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="0_4">
          <template #title>
            <icon-storage />
            库存
          </template>
          <a-menu-item key="0_4_1">
            库存管理
          </a-menu-item>
          <a-menu-item key="0_4_2">
            盘点管理
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout style="padding: 0 24px">
        <a-breadcrumb :style="{ margin: '16px 0' }">
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <template v-for="item in breadcrumbs" :key="item.path">
            <a-breadcrumb-item>{{ item.meta.title }}</a-breadcrumb-item>
          </template>
        </a-breadcrumb>

        <a-layout-content>
          <div class="content-container">
            <!-- Tabs 导航 -->
            <a-tabs
              type="card-gutter"
              :editable="true"
              @delete="handleDelete"
              v-model:activeKey="activeKey"
              :hide-content="true"
              class="tabs-nav"
            >
              <a-tab-pane
                v-for="tab in tabList"
                :key="tab.key"
                :title="tab.title"
                :closable="tabList.length > 1"
              />
            </a-tabs>

            <!-- 路由视图容器 -->
            <div class="router-view-container">
              <router-view v-slot="{ Component }">
                <keep-alive>
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
              </router-view>
            </div>
          </div>
        </a-layout-content>

        <a-layout-footer>
          Suriti ©2002-2024 Created by Simon, Powered by John Ye
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconHome,
  IconCalendar,
  IconStorage,
  IconFile,
  IconCheckCircle
} from '@arco-design/web-vue/es/icon'

const router = useRouter()
const route = useRoute()
const breadcrumbs = ref([])

const updateBreadcrumbs = () => {
  const matched = route.matched.slice(1)
  breadcrumbs.value = matched
}

watch(
  () => route.path,
  () => {
    updateBreadcrumbs()
  },
  { immediate: true }
)

const collapsed = ref(false)

const onCollapse = (val) => {
  collapsed.value = val
}

const onClickMenuItem = (key) => {
  switch(key) {
    case '0_1':
      router.push('/dashboard')
      break
    case '0_2':
      router.push('/quotation')
      break
    case '0_3_1':
      router.push('/purchase/orders')
      break
    case '0_3_2':
      router.push('/purchase/suppliers')
      break
    case '0_5_1':
      router.push('/approval/pending')
      break
    case '0_5_2':
      router.push('/approval/history')
      break
    case '0_4_1':
      router.push('/inventory')
      break
    case '0_4_2':
      router.push('/inventory/receipt')
      break
  }
}

// 标签页相关逻辑
const tabList = ref([])
const activeKey = ref('')

// 初始化标签页
const initializeTabs = () => {
  const currentPath = route.path
  const currentTitle = route.meta.title || '新标签页'
  
  if (!tabList.value.some(tab => tab.key === currentPath)) {
    tabList.value.push({
      key: currentPath,
      title: currentTitle
    })
  }
  activeKey.value = currentPath
}

// 监听路由变化，自动添加标签
watch(
  () => route.path,
  (newPath) => {
    const exist = tabList.value.some(tab => tab.key === newPath)
    if (!exist) {
      tabList.value.push({
        key: newPath,
        title: route.meta.title || '新标签页'
      })
    }
    activeKey.value = newPath
  },
  { immediate: true }
)

// 监听标签切换
watch(
  activeKey,
  (newKey) => {
    if (route.path !== newKey) {
      router.push(newKey)
    }
  },
  { flush: 'post' }
)

// 处理标签删除
const handleDelete = (targetKey) => {
  const targetIndex = tabList.value.findIndex(tab => tab.key === targetKey)
  if (targetIndex === -1) return
  
  tabList.value = tabList.value.filter(tab => tab.key !== targetKey)
  
  // 如果关闭的是当前激活的标签，则激活前一个标签
  if (targetKey === activeKey.value) {
    const newActiveTab = tabList.value[targetIndex - 1] || tabList.value[0]
    if (newActiveTab) {
      activeKey.value = newActiveTab.key
      router.push(newActiveTab.key)
    }
  }
}
</script>

<style scoped>
.layout-demo {
  height: 100vh;
  background: var(--color-neutral-2);
}

.layout-demo :deep(.arco-layout-sider) .logo {
  height: 64px;
  margin: 0;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-demo :deep(.arco-layout-sider) .logo img {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: #fff;
}

.layout-demo :deep(.arco-layout-header) {
  height: auto;
  line-height: 1.5;
  padding: 0;
  background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  line-height: 48px;
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tabs-nav {
  flex-shrink: 0;
  background: var(--color-bg-2);
  padding: 8px 16px 0;
}

.router-view-container {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: var(--color-bg-2);
}

.layout-demo :deep(.arco-layout-content) {
  background: var(--color-bg-3);
  color: var(--color-text-2);
  min-height: 120px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.layout-demo :deep(.arco-tabs-nav) {
  margin-bottom: 0;
}

.layout-demo :deep(.arco-tabs-nav-tab) {
  border-bottom: none;
}
</style>
