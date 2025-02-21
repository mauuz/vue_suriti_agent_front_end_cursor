<template>
  <div class="approval-detail">
    <approval-detail-table 
    :data="approvalItemList" 
        @refresh="getApprovalPendingItems"
    />
  </div>
</template>

<script setup>
import { ref, onMounted,onActivated } from 'vue'
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

  // Format prices to two decimal places
  approvalItemList.value = result.items.map(item => ({
    ...item,
    unit_price: Number(item.unit_price).toFixed(2),
    inventory_price: Number(item.inventory_price).toFixed(4),
    last_purchase_price: Number(item.last_purchase_price).toFixed(2),
    total_price: Number(item.total_price).toFixed(4)
  }))

  console.log('approvalItemList:', approvalItemList.value)
}

onActivated(async () => {
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
