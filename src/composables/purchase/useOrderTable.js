import { ref, reactive } from 'vue'

export default function useOrderTable() {
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

  const tableData = ref([])
  const loading = ref(false)

  const pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 10,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
  })

  const rowSelection = {
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  }

  const onPageChange = (current) => {
    pagination.current = current
    fetchData()
  }

  const onPageSizeChange = (pageSize) => {
    pagination.pageSize = pageSize
    fetchData()
  }

  const fetchData = async () => {
    loading.value = true
    try {
      tableData.value = Array.from({ length: 10 }).map((_, index) => ({
        id: index + 1,
        orderNo: `PO${String(index + 1).padStart(6, '0')}`,
        orderName: `采购订单${index + 1}`,
        orderStatus: ['未下单', '已下单'][Math.floor(Math.random() * 2)],
        receiveStatus: ['未收货', '部分收货', '已收货'][Math.floor(Math.random() * 3)],
        approvalStatus: ['待审批', '已通过', '已驳回'][Math.floor(Math.random() * 3)],
        operator: `操作员${index + 1}`,
        operateTime: '2024-03-20 12:00:00',
        remark: '这是一条测试批注信息，可能会很长很长很长很长很长很长',
      }))
      pagination.total = 100
    } catch (error) {
      // 错误处理
    } finally {
      loading.value = false
    }
  }

  const getOrderStatusColor = (status) => {
    const map = {
      '未下单': 'red',
      '已下单': 'green'
    }
    return map[status] || 'gray'
  }

  const getReceiveStatusColor = (status) => {
    const map = {
      '未收货': 'red',
      '部分收货': 'orange',
      '已收货': 'green'
    }
    return map[status] || 'gray'
  }

  const getApprovalStatusColor = (status) => {
    const map = {
      '待审批': 'blue',
      '已通过': 'green',
      '已驳回': 'red'
    }
    return map[status] || 'gray'
  }

  return {
    columns,
    tableData,
    loading,
    pagination,
    rowSelection,
    onPageChange,
    onPageSizeChange,
    getOrderStatusColor,
    getReceiveStatusColor,
    getApprovalStatusColor,
    fetchData
  }
}