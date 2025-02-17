<template>
  <a-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @page-size-change="$emit('page-size-change', $event)"
    :loading="loading"
    row-key="order_id"
  >
    <template #order_type="{ record }">
      <a-tag :color="record.order_type === 0 ? 'blue' : 'orange'">
        {{ record.order_type === 0 ? '外采入库' : '外采直供' }}
      </a-tag>
    </template>

    <template #operations="{ record }">
      <a-button @click="viewDetails(record)" type="primary">查看</a-button>
      <slot name="operations" :record="record"></slot>
    </template>
  </a-table>
</template>

<script setup>
import { ref,onActivated } from 'vue'
import { useApprovalStore } from '@/stores'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

const approvalStore = useApprovalStore()
const emit = defineEmits(['page-change', 'page-size-change'])
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  },
  rowSelection: {
    type: Object,
    default: () => ({
      type: 'checkbox',
      showCheckedAll: true,
      onlyCurrent: false
    })
  }
})
const columns = [
  {
    title: '订单编号',
    dataIndex: 'order_id',
    width: 150,
  },
  {
    title: '订单描述',
    dataIndex: 'order_description',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'order_remarks',
    width: 200,
  },
  {
    title: '订单类型',
    dataIndex: 'order_type',
    width: 100,
    slotName: 'order_type'
  },
  {
    title: '需审核数量',
    dataIndex: 'count',
    width: 100,
  },
  {
    title: '申请人',
    dataIndex: 'applicant_full_name',
    width: 150,
  },
  {
    title: '变更时间',
    dataIndex: 'changed_at',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 150,
    slotName: 'operations'
  }
]

const router = useRouter()

const viewDetails = (record) => {
  router.push({
    name: 'ApprovalDetail',
    params: {
      id: record.order_id
    }
  })
}

// Fetch approvals when the component is mounted
// onActivated(() => {
//   loading.value = true
//   approvalStore.getApprovalList().then(response => {
//     data.value = response.data
//     loading.value = false
//   }).catch(() => {
//     loading.value = false
//   })
// })
</script>
