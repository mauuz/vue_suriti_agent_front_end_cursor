<template>
  <div>
    <a-table
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ x: 1000 }"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #status="{ record }">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, onMounted,onActivated } from 'vue';
import { useApprovalStore } from '@/stores';

const approvalStore = useApprovalStore();
const loading = ref(false);
const data = ref([]);

// 分页配置
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
});

const columns = [
  { title: '审批ID', dataIndex: 'id', width: 100 },
  { title: '订单编号', dataIndex: 'order_id', width: 120 },
  { title: '采购项目编号', dataIndex: 'purchase_item_id', width: 120 },
  { title: '产品代码', dataIndex: 'product_code', width: 100 },
  { title: '产品名称', dataIndex: 'product_name', width: 200 },
  { 
    title: '审批状态', 
    dataIndex: 'status', 
    width: 100,
    slotName: 'status'
  },
  { title: '申请人', dataIndex: 'applicant_name', width: 100 },
  { title: '审批人', dataIndex: 'approver_name', width: 100 },
  { title: '申请原因', dataIndex: 'applicant_reason', width: 200 },
  { title: '审批意见', dataIndex: 'approval_comment', width: 200 },
  { 
    title: '创建时间', 
    dataIndex: 'create_time',
    width: 180,
  },
];

// 状态颜色映射
const getStatusColor = (status) => {
  const statusMap = {
    1: 'green',  // 通过
    2: 'red',    // 驳回
    0: 'blue',   // 待审批
    3: 'orange'
  };
  return statusMap[status] || 'gray';
};

// 状态文本映射
const getStatusText = (status) => {
  const statusMap = {
    1: '已通过',
    2: '已驳回',
    0: '提交审批',
    3: '撤回审批'
  };
  return statusMap[status] || '未知状态';
};

// 处理页码变化
const handlePageChange = (current) => {
  pagination.value.current = current;
  fetchData();
};

// 处理每页条数变化
const handlePageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize;
  pagination.value.current = 1;
  fetchData();
};

// 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await approvalStore.getAllApprovalHistory({
      page: pagination.value.current,
      pageSize: pagination.value.pageSize
    });
    data.value = response.items;
    pagination.value.total = response.total_count;
  } catch (error) {
    console.error('获取审批历史失败:', error);
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取数据
onActivated(() => {
  fetchData();
});
</script>

<style scoped>
.arco-table-cell {
  white-space: nowrap;
}
</style>
