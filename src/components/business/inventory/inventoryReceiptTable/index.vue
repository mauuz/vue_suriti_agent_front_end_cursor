<template>
  <div>
    <a-table 
        :columns="columns" 
        :data="orders" 
        row-key="order_id"
        :pagination="pagination"
        @page-change="$emit('page-change', $event)"
        @page-size-change="$emit('page-size-change', $event)"
        @selection-change="handleTableChange"
        :loading="loading"
    >
      <template #order_type="{ record }">
        <a-tag :color="record.order_type === 0 ? 'blue' : 'green'">
          {{ record.order_type === 0 ? '外采入库' : '外采直供' }}
        </a-tag>
      </template>
      <template #inventory_overall_status="{ record }">
        <a-tag :color="getStatusColor(record.inventory_overall_status)">
          {{ getStatusText(record.inventory_overall_status) }}
        </a-tag>
      </template>
      <template #operations="{ record }">
        <a-space>
          <a-button 
            type="outline" 
            size="small"
            @click="handleView(record)"
          >
            查看
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useReceiptStore } from '@/stores/modules/storage/receipt';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  orders: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['page-change', 'page-size-change', 'selection-change']);

const columns = [
  { title: '订单编号', dataIndex: 'order_id' },
  { title: '描述', dataIndex: 'description' },
  { title: '创建人', dataIndex: 'creator_name' },
  { title: '供应商', dataIndex: 'supplier_name' },
  { title: '订单类型', dataIndex: 'order_type', slotName: 'order_type' },
  { title: '备注', dataIndex: 'remarks' },
  { title: '创建时间', dataIndex: 'created_at' },
  { title: '总状态', dataIndex: 'inventory_overall_status',slotName: 'inventory_overall_status' },
  { title: '总数量', dataIndex: 'total_items' },
  { title: '已收货数量', dataIndex: 'received_count' },
  { title: '部分收货数量', dataIndex: 'partial_received_count' },
  { title: '未收货数量', dataIndex: 'not_received_count' },
  { 
    title: '操作',
    dataIndex: 'operations',
    width: 100,
    slotName: 'operations',
    fixed: 'right'
  }
];

const handleTableChange = (selection) => {
  emit('selection-change', selection);
};

const handleView = (record) => {
  //console.log(record);
  router.push({
    name: 'ReceiptDetail',
    params: { id: record.order_id }
  });
};

const getStatusColor = (status) => {
  const colorMap = {
    0: 'red',
    1: 'orange',
    2: 'green'
  };
  return colorMap[status] || 'gray';
};

const getStatusText = (status) => {
  const statusMap = {
    0: '未收货',
    1: '部分收获',
    2: '全部收货'
  };
  return statusMap[status] || 'Unknown';
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
