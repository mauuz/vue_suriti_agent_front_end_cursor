<template>
  <div>
    <approval-table
      :data="approvalStore.approvalList"
      :loading="loading"
      :pagination="{
            total: approvalStore.totalCount,
            current: approvalStore.currentPage,
            pageSize: approvalStore.pageSize,
            showTotal: true,
            showPageSize: true,
            pageSizeOptions: [10, 20, 50, 100],
            showJumper: true
      }"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"/>
  </div>
</template>

<script setup>
import { ref, onMounted,onActivated} from 'vue'
import ApprovalTable from '@/components/business/approval/approvalTable/index.vue'
import { useApprovalStore } from '@/stores/modules/approval/approvalStore'

const approvalStore = useApprovalStore()
const loading = ref(false)


const fetchApprovals = async () => {
  loading.value = true
  try {
    await approvalStore.getApprovalList({
      page: approvalStore.currentPage,
      pageSize: approvalStore.pageSize
    })
    
  } catch (error) {
    console.error('Error fetching approvals:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  console.log('handlePageChange', page)
  approvalStore.currentPage = page
  fetchApprovals()
}

const handlePageSizeChange = (size) => {
  console.log('handlePageSizeChange', size)
  approvalStore.pageSize = size
  approvalStore.currentPage = 1 // Reset to first page on page size change
  fetchApprovals()
}

// Fetch approvals when the component is mounted
onActivated(() => {
  fetchApprovals()
})
</script>

<style scoped>
/* Add any additional styles here */
</style>
