<template>
  <a-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @page-size-change="$emit('page-size-change', $event)"
    :loading="loading"
    row-key="supplierId"
    :row-selection="rowSelection"
  >
    <template #status="{ record }">
      <a-tag :color="getStatusColor(record.status)">
        {{ getStatusText(record.status) }}
      </a-tag>
    </template>
  </a-table>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSupplyStore } from '@/stores'

const supplyStore = useSupplyStore()

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

const emit = defineEmits(['page-change', 'page-size-change'])

const columns = [
  {
    title: '供应商编号',
    dataIndex: 'supplierId',
    width: 100,
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 200,
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    width: 120,
  },
  {
    title: '联系方式',
    dataIndex: 'contactInfo',
    width: 150,
  },
  {
    title: '开户行',
    dataIndex: 'bankName',
    width: 150,
    ellipsis: true,
  },
  {
    title: '收款账号',
    dataIndex: 'paymentAccount',
    width: 200,
    ellipsis: true,
  },
  {
    title: '收款人',
    dataIndex: 'payee',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    slotName: 'status'
  },
  {
    title: '发货地址',
    dataIndex: 'shippingAddress',
    width: 250,
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 200,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 150,
    fixed: 'right',
    slotName: 'operations'
  }
]

const getStatusColor = (status) => {
  return status === 1 ? 'green' : 'red'
}

const getStatusText = (status) => {
  return status === 1 ? '启用' : '禁用'
}

// Fetch suppliers when the component is mounted
onMounted(() => {
  supplyStore.getSupplierList({
    page: supplyStore.currentPage,
    pageSize: supplyStore.pageSize
  })
})
</script> 