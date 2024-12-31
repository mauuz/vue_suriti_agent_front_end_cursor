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
        {{ record.status }}
      </a-tag>
    </template>
  </a-table>
</template>

<script setup>
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
    title: '联系电话',
    dataIndex: 'contactPhone',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    slotName: 'status'
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: 250,
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    ellipsis: true,
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
  const colorMap = {
    '启用': 'green',
    '禁用': 'red',
    '待审核': 'orange'
  }
  return colorMap[status] || 'gray'
}
</script> 