<template>
  <a-modal
    :visible="visible"
    :width="1200"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>
      提交审批 (共 {{ data.length }} 条数据)
    </template>
    
    <div class="table-container">
      <a-table 
        :columns="columns" 
        :data="data" 
        :row-selection="rowSelection"
         v-model:selectedKeys="selectedKeys"
        :virtual-list-props="{ height: 400 }"
        :pagination="false"
        :scroll="{ x: 1200 }"
        @selection-change ="selecOnChange"
        rowKey="purchase_item_id"
      />
    </div>

    <div style="margin-top: 16px;">
      <a-textarea
        v-model="applicationReason"
        placeholder="请输入申请的原因"
        rows="4"
        style="width: 100%;"
      />
    </div>

    <template #footer>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
        <span>已选择: {{ selectedKeys.length }} 条数据</span>
        <div>
          <a-button @click="handleSubmit" type="primary" style="margin-right: 8px;">
            提交审批
          </a-button>
          <a-button @click="handleCancel">
            取消
          </a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { Message } from '@arco-design/web-vue';
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['update:visible', 'submit', 'cancel']);
const selectedKeys = ref([]);
const applicationReason = ref('');

const columns = [
{
    title: '序号',
    dataIndex: 'sequence',
    fixed: 'left',
    width: 80,
  },
  {
    title: '产品编码',
    dataIndex: 'product_code',
    width: 120,
  },
  {
    title: '产品名称(英)',
    dataIndex: 'product_name_en',
    width: 200,
  },
  {
    title: '规格',
    dataIndex: 'specification',
    width: 120,
  },
  {
    title: '产品名称(中)',
    dataIndex: 'product_name_zh',
    width: 200,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: 100,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 80,
  },
  {
    title: '单价',
    dataIndex: 'unit_price',
    width: 120,
    formatter: (value) => Number(value).toFixed(8)
  },
  {
    title: '总价',
    dataIndex: 'total_price',
    width: 120,
    formatter: (value) => Number(value).toFixed(8)
  }
];

const rowSelection = {
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: true,
  
};

const selecOnChange = (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys;
}

const handleOk = ()=>{

}

const handleSubmit = () => {
  if (selectedKeys.value.length === 0) {
    Message.warning('请至少选择一条数据');
    return;
  }

  if (!applicationReason.value.trim()) {
    Message.warning('请输入申请的原因');
    return;
  }

  console.log(selectedKeys.value, applicationReason.value);
  emit('submit', { selectedKeys: selectedKeys.value, reason: applicationReason.value });
  emit('update:visible', false);
};

const handleCancel = () => {
  selectedKeys.value = [];
  emit('cancel');
  emit('update:visible', false);
};


</script>

<style scoped>
.table-container {
  position: relative;
  overflow: auto;
}

.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: transparent;
}

.table-container::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 6px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
