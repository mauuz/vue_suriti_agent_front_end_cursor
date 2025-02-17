<template>
  <a-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @page-size-change="$emit('page-size-change', $event)"
    :loading="loading"
    row-key="purchase_item_id"
    :scroll="{ x: 1200 }"
  >
    <template #inventoryStatus="{ record }">
      <a-tag :color="getInventoryStatusColor(record.inventory_status)">
        {{ record.inventory_status === 1 ? '已入库' : '未入库' }}
      </a-tag>
    </template>
    <template #operations="{ record }">
      <a-space>
        <a-button
          type="primary"
          size="small"
          @click="openModal(record)"
        >
          修改
        </a-button>
      </a-space>
    </template>
  </a-table>

  <a-modal
    v-model:visible="isModalVisible"
    title="修改收货数量"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div v-if="currentRecord" class="modal-content">
      <div class="modal-row">
        <span class="modal-label">产品代码:</span>
        <span class="modal-value">{{ currentRecord.product_code }}</span>
      </div>
      <div class="modal-row">
        <span class="modal-label">产品名称:</span>
        <span class="modal-value">{{ currentRecord.product_name_zh }}</span>
      </div>
      <div class="modal-row">
        <span class="modal-label">规格:</span>
        <span class="modal-value">{{ currentRecord.specification }}</span>
      </div>
      <div class="modal-row">
        <span class="modal-label">单位:</span>
        <span class="modal-value">{{ currentRecord.unit }}</span>
      </div>
      <div class="modal-row">
        <span class="modal-label">总数:</span>
        <span class="modal-value">{{ currentRecord.ordered_quantity }}</span>
      </div>
      <div class="modal-row">
        <span class="modal-label">未收数量:</span>
        <span class="modal-value">{{ currentRecord.remaining_quantity }}</span>
      </div>
      <div class="modal-row">
        <span class="modal-label">已收数量:</span>
        <a-input-number
          v-model="receivedQuantity"
          :default-value="currentRecord.received_quantity"
          :min="0"
          :max="currentRecord.ordered_quantity"
          placeholder="收货数量"
          style="width: 60%; "
        />
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { useReceiptStore } from '@/stores';

const receiptStore = useReceiptStore();

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
  }
})

const emit = defineEmits(['page-change', 'page-size-change', 'refresh'])

const columns = [
  {
    title: '采购订单ID',
    dataIndex: 'purchase_order_id',
    width: 150,
  },
  {
    title: '序号',
    dataIndex: 'sequence',
    width: 100,
  },
  {
    title: '产品代码',
    dataIndex: 'product_code',
    width: 100,
  },
  {
    title: '产品名称',
    dataIndex: 'product_name_zh',
    width: 200,
  },
  {
    title: '产品名称 (EN)',
    dataIndex: 'product_name_en',
    width: 200,
  },
  {
    title: '规格',
    dataIndex: 'specification',
    width: 150,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
  },
  {
    title: '订购数量',
    dataIndex: 'ordered_quantity',
    width: 100,
  },
  {
    title: '已收数量',
    dataIndex: 'received_quantity',
    width: 100,
  },
  {
    title: '剩余数量',
    dataIndex: 'remaining_quantity',
    width: 100,
  },
  {
    title: '接收人',
    dataIndex: 'receiver_name',
    width: 150,
  },
  {
    title: '接收时间',
    dataIndex: 'received_at',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 150,
  },
  {
    title: '采购项ID',
    dataIndex: 'purchase_item_id',
    width: 150,
  },
  {
    title: '供应商名称',
    dataIndex: 'supplier_name',
    width: 200,
  },
  {
    title: '采购员',
    dataIndex: 'purchaser_name',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 100,
    fixed: 'right',
    slotName: 'operations'
  },
]

const getInventoryStatusColor = (status) => {
  return status === 1 ? 'green' : 'red';
};

const isModalVisible = ref(false);
const currentRecord = ref(null);
const receivedQuantity = ref(0);

const openModal = async (record) => {
  console.log(record,111)
  currentRecord.value = record;
  receivedQuantity.value = currentRecord.value.received_quantity;
  isModalVisible.value = true;
};

const handleOk = async () => {
  console.log(currentRecord.value.purchase_item_id)
  console.log('Updated received quantity:', receivedQuantity.value);
  isModalVisible.value = false;
  const res = await receiptStore.receiveReceipt(currentRecord.value.purchase_item_id, { received_quantity: receivedQuantity.value });
  if(res.code === 200){
    Message.success('收货成功');
    emit('refresh');
  }else{
    Message.error('收货失败');
  }
};

const handleCancel = () => {
  isModalVisible.value = false;
};
</script>

<style scoped>
:deep(.arco-table-fixed-right) {
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.modal-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.modal-label {
  font-weight: bold;
  color: #333;
}

.modal-value {
  color: #555;
}ss

:deep(.arco-input-number-input) {
  text-align: right;
}
</style>
