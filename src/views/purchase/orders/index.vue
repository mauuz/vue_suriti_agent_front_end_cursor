<template>
  <div class="purchase-orders">
    <div class="toolbar">
      <PurchaseToolbar />
    </div>
    <div class="table">
      <PurchaseOrderTable 
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      />    
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePurchaseOrderStore } from '@/stores'
import PurchaseToolbar from '@/components/business/purchase/purchaseToolBar/index.vue'
import PurchaseOrderTable from '@/components/business/purchase/purchaseOrderTable/index.vue'
import { Message } from '@arco-design/web-vue';

const purchaseOrderStore = usePurchaseOrderStore()
const tableData = ref([])
const loading = ref(false)

// 定义分页配置
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
  showTotal: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50, 100],
  showJumper: true,
})

// 表格选择配置
const rowSelection = ref({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
})

// 获取数据的方法
const fetchData = async () => {
  loading.value = true
  try {
    const result = await purchaseOrderStore.getPurchaseOrders({
      page: pagination.value.current,
      pageSize: pagination.value.pageSize
    })
    
    // 确保返回的数据格式正确
    if (result && Array.isArray(result.data)) {
      tableData.value = result.data
      pagination.value.total = result.total || 0
    } else {
      Message.error('订单获取失败！'+error );
      console.error('返回数据格式错误:', result)
      tableData.value = []
      pagination.value.total = 0
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    Message.error('订单获取失败！'+error );
    // 发生错误时保持现有数据
    tableData.value = []
    pagination.value.total = 0
  } finally {
    loading.value = false
  }
}

// 页码改变的处理函数
const onPageChange = async (current) => {
  try {
    pagination.value.current = current
    console.log('onPageChange', current)
    await fetchData()
  } catch (error) {
    console.error('页码切换失败:', error)
  }
}

// 每页条数改变的处理函数
const onPageSizeChange = async (pageSize) => {
  try {
    pagination.value.pageSize = pageSize
    pagination.value.current = 1 // 重置到第一页
    await fetchData()
  } catch (error) {
    console.error('每页条数切换失败:', error)
  }
}

// 初始化加载
onMounted(() => {
  fetchData()
})
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