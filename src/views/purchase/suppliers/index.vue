<template>
<div class="purchase-supply">
    <div class="toolbar">
      <SupplierToolbar />
    </div>

    <div class="table">
      <SupplierTable 
        :data="supplyStore.suppliers"
        :loading="supplyStore.loading"
        :pagination="{
          total: supplyStore.total,
          current: supplyStore.currentPage,
          pageSize: supplyStore.pageSize,
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
import { ref, onMounted ,onActivated} from 'vue'
import { useSupplyStore } from '@/stores'
import SupplierToolbar from '@/components/business/supply/supplierToolBar/index.vue'
import SupplierTable from '@/components/business/supply/supplierTable/index.vue'
import { Message } from '@arco-design/web-vue';

const supplyStore = useSupplyStore()

// 表格选择配置
const rowSelection = ref({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
})

// 获取数据的方法
const fetchData = async () => {
  try {
    await supplyStore.getSupplierList({
      page: supplyStore.currentPage,
      pageSize: supplyStore.pageSize
    })
  } catch (error) {
    console.error('获取数据失败:', error)
    Message.error('供应商列表获取失败！' + error)
  }
}

// 页码改变的处理函数
const onPageChange = async (current) => {
  try {
    supplyStore.currentPage = current
    await fetchData()
  } catch (error) {
    console.error('页码切换失败:', error)
  }
}

// 每页条数改变的处理函数
const onPageSizeChange = async (pageSize) => {
  try {
    supplyStore.pageSize = pageSize
    supplyStore.currentPage = 1 // 重置到第一页
    await fetchData()
  } catch (error) {
    console.error('每页条数切换失败:', error)
  }
}
// onActivated(async () => {
//   console.log('activated purchase-supply')
//   await fetchData()
// })
onMounted(async () => {
  console.log('onmounted purchase-supply')
  await fetchData()
})
</script>

<style scoped>
.purchase-supply {
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