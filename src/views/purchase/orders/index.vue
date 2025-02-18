<template>
  <div class="purchase-orders">
    <div class="toolbar">
      <PurchaseToolbar />
    </div>
    <div class="table">
      <PurchaseOrderTable 
        :data="purchaseOrderStore.purchaseOrders"
        :loading="purchaseOrderStore.loading"
        :pagination="{
          total: purchaseOrderStore.total,
          current: purchaseOrderStore.currentPage,
          pageSize: purchaseOrderStore.pageSize,
          showTotal: true,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
          showJumper: true
        }"
        :row-selection="rowSelection"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      
      />    
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,onActivated } from 'vue'
import { usePurchaseOrderStore } from '@/stores'
import PurchaseToolbar from '@/components/business/purchase/purchaseToolBar/index.vue'
import PurchaseOrderTable from '@/components/business/purchase/purchaseOrderTable/index.vue'
import { Message } from '@arco-design/web-vue';

const purchaseOrderStore = usePurchaseOrderStore()

// 表格选择配置
const rowSelection = ref({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 获取数据的方法
const fetchData = async () => {
  try {
    await purchaseOrderStore.getPurchaseOrders({
      page: purchaseOrderStore.currentPage,
      pageSize: purchaseOrderStore.pageSize
    })
  } catch (error) {
    console.error('获取数据失败:', error)
    Message.error('订单获取失败！' + error)
  }
}

// 页码改变的处理函数
const onPageChange = async (current) => {
  try {
    purchaseOrderStore.currentPage = current
    await fetchData()
  } catch (error) {
    console.error('页码切换失败:', error)
  }
}

// 每页条数改变的处理函数
const onPageSizeChange = async (pageSize) => {
  try {
    purchaseOrderStore.pageSize = pageSize
    purchaseOrderStore.currentPage = 1 // 重置到第一页
    await fetchData()
  } catch (error) {
    console.error('每页条数切换失败:', error)
  }
}


// 初始化加载
// onMounted(async () => {
//   console.log('purchase-orders')
//   await fetchData()
// })
onActivated(async () => {
  console.log('onmounted purchase-orders')
  await fetchData()
})
// onActivated(async () => {
//   console.log('activated purchase-orders')
//   await fetchData()
// })
</script>

<style scoped>
.purchase-orders {
  padding: 16px;
}

.toolbar {
  margin-bottom: 16px;
}

.table {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
}
</style> 