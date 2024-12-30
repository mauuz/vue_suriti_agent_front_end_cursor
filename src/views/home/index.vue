<template>
  <a-layout class="layout-demo">
    <a-layout-sider
      theme="dark"
      breakpoint="lg"
      collapsible
      :collapsed="collapsed"
      @collapse="onCollapse"
    >
      <div class="logo" >
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
          <a-menu-item key="0_3_1">
            采购单管理
          </a-menu-item>
          <a-menu-item key="0_3_2">
            供应商管理
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="0_4">
          <icon-storage />
          库存
        </a-menu-item>
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
          <a-tabs
            type="card-gutter"
            :editable="true"
            @delete="handleDelete"
            v-model:activeKey="activeKey"
            class="full-height-tabs"
          >
            <a-tab-pane
              v-for="tab in tabList"
              :key="tab.key"
              :title="tab.title"
              :closable="tabList.length > 1"
            >
              <router-view v-slot="{ Component }">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </router-view>
            </a-tab-pane>
          </a-tabs>
        </a-layout-content>
        <a-layout-footer>Suriti ©2002-2024 Created by Simon, Powered by John Ye</a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconHome,
  IconCalendar,
  IconStorage,
  IconFile
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
    case '0_4':
      router.push('/inventory')
      break
  }
}

// 初始化标签页列表
const tabList = ref([])
const activeKey = ref('')

// 添加初始化函数
const initializeTabs = () => {
  const currentPath = route.path
  const currentTitle = route.meta.title || '新标签页'
  
  // 如果当前路径不在标签列表中，添加它
  if (!tabList.value.some(tab => tab.key === currentPath)) {
    tabList.value.push({
      key: currentPath,
      title: currentTitle
    })
  }
  activeKey.value = currentPath
}

// 在组件挂载时初始化
onMounted(() => {
  initializeTabs()
})

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
  }
)

// 监听标签切换
watch(activeKey, (newKey) => {
  if (route.path !== newKey) {
    router.push(newKey)
  }
})
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

.layout-demo :deep(.arco-layout-content) {
  background: var(--color-bg-3);
  color: var(--color-text-2);
  min-height: 120px;
  height: 100%;
}

.layout-demo :deep(.arco-tabs) {
  height: 100%;
}

.layout-demo :deep(.arco-tabs-content) {
  padding: 16px;
}

.layout-demo :deep(.arco-tabs-nav) {
  margin-bottom: 0;
  padding: 8px 16px 0;
  background: var(--color-bg-2);
}

.layout-demo :deep(.arco-tabs-nav-tab) {
  border-bottom: none;
}

.layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.layout-demo :deep(.full-height-tabs) {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.layout-demo :deep(.full-height-tabs .arco-tabs-content) {
  flex: 1;
  overflow: auto;
  height: 0; /* 这个是必要的，让 flex: 1 生效 */
}

.layout-demo :deep(.arco-tabs-nav) {
  margin-bottom: 0;
}

.layout-demo :deep(.arco-tabs-pane) {
  height: 100%;
}
</style>
