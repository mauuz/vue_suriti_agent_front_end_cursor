<template>
  <div class="approval-detail">
    <approval-detail-table 
    :data="approvalItemList" 
        @refresh="getApprovalPendingItems"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApprovalDetailTable from '@/components/business/approval/approvalDetailTable/index.vue'
import { useApprovalStore } from '@/stores/modules/approval/approvalStore'

const approvalStore = useApprovalStore()
const route = useRoute()
const approvalItemList = ref([])
const getApprovalPendingItems = async () => {
    const purchaseId = route.params.id
    console.log('purchaseId:', purchaseId)
  const result = await approvalStore.getApprovalPendingItems(purchaseId)
  console.log('result:', result)
  approvalItemList.value = result.items
  console.log('approvalItemList:', approvalItemList.value)
}

onMounted(async () => {
    await getApprovalPendingItems()
})

</script>

<style scoped>
.approval-detail {
  padding: 20px;
}
.detail-content {
  margin-top: 20px;
}
</style>
