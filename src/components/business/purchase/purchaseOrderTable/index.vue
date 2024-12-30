<template>
  <a-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @page-size-change="$emit('page-size-change', $event)"
    :loading="loading"
    row-key="id"
    :row-selection="rowSelection"
  >
    <template #orderStatus="{ record }">
      <a-tag :color="getOrderStatusColor(record.orderStatus)">
        {{ record.orderStatus }}
      </a-tag>
    </template>

    <template #receiveStatus="{ record }">
      <a-tag :color="getReceiveStatusColor(record.receiveStatus)">
        {{ record.receiveStatus }}
      </a-tag>
    </template>

    <template #approvalStatus="{ record }">
      <a-tag :color="getApprovalStatusColor(record.approvalStatus)">
        {{ record.approvalStatus }}
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

// 表格列定义
const columns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 150,
  },
  {
    title: '订单名称',
    dataIndex: 'orderName',
    width: 200,
  },
  {
    title: '下单状态',
    dataIndex: 'orderStatus',
    width: 100,
    slotName: 'orderStatus'
  },
  {
    title: '收货情况',
    dataIndex: 'receiveStatus',
    width: 100,
    slotName: 'receiveStatus'
  },
  {
    title: '审批状态',
    dataIndex: 'approvalStatus',
    width: 100,
    slotName: 'approvalStatus'
  },
  {
    title: '操作员',
    dataIndex: 'operator',
    width: 120,
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    width: 160,
  },
  {
    title: '批注',
    dataIndex: 'remark',
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

// 状态颜色处理函数
const getOrderStatusColor = (status) => {
  const colorMap = {
    '未下单': 'orange',
    '已下单': 'green'
  }
  return colorMap[status] || 'gray'
}

const getReceiveStatusColor = (status) => {
  const colorMap = {
    '未收货': 'red',
    '部分收货': 'orange',
    '已收货': 'green'
  }
  return colorMap[status] || 'gray'
}

const getApprovalStatusColor = (status) => {
  const colorMap = {
    '待审批': 'orange',
    '已通过': 'green',
    '已驳回': 'red'
  }
  return colorMap[status] || 'gray'
}
</script>