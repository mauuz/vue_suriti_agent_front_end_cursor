<template>
  <a-modal
    :visible="visible"
    :width="1200"
    :height="2000"
    @ok="handleOk"
    @cancel="handleCancel"
    @before-close="handleClose"
    :mask-closable="false"
    draggable
  > 
    <template #title>
      {{ activeTab === 'submit' ? '提交审批' : '撤回审批' }}
    </template>
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="submit" tab="提交审批">
        <template #title>
          提交审批 (共 {{ data.submitApprovalData.length }} 条)
        </template>
        
        <div class="table-container">
          <a-table 
            :columns="columns" 
            :data="data.submitApprovalData" 
            :row-selection="rowSelection"
            v-model:selectedKeys="selectedSubmitKeys"
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
        <!-- <template #footer>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
            <span>已选择: {{ selectedSubmitKeys.length }} 条数据</span>
            <div>
              <a-button @click="handleCancel" style="margin-right: 8px;">
                取消
              </a-button>
            <a-button @click="handleSubmit" type="primary">
                提交审批
              </a-button>
            </div>
          </div>
        </template> -->
      </a-tab-pane>
      
      <a-tab-pane key="withdraw" tab="撤回审批">
        <template #title>
          撤回审批 (共 {{ data.cancelApprovalData.length }} 条)
        </template>

        <div class="table-container">
          <a-table 
            :columns="columns" 
            :data="data.cancelApprovalData"
            :row-selection="rowSelection"
            v-model:selectedKeys="selectedCancelKeys"
            :virtual-list-props="{ height: 400 }"
            :pagination="false"
            :scroll="{ x: 1200 }"
            @selection-change ="selecCancelOnChange"
            rowKey="purchase_item_id"
          />
        </div>
        <div style="margin-top: 16px;">
          <a-textarea
            v-model="cancelApplicationReason"
            placeholder="请输入撤销的原因"
            rows="4"
            style="width: 100%;"
          />
        </div>
        <!-- <template #footer>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
            <span>已选择: {{ selectedCancelKeys.length }} 条数据</span>
            <div>
              <a-button @click="handleCancel" style="margin-right: 8px;">
                取消
              </a-button>
            <a-button @click="handleWithdraw" type="primary">
              撤回审批
              </a-button>
            </div>
          </div>
        </template> -->
      </a-tab-pane>
    </a-tabs>
    <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
          <span>
            已选择: 
            {{ activeTab === 'submit' ? selectedSubmitKeys.length : selectedCancelKeys.length }} 
            条数据
          </span>
          <div>
            <a-button @click="handleAction" type="primary" style="margin-right: 8px;">
              {{ activeTab === 'submit' ? '提交审批' : '撤回审批' }}
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
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {}
  },
});
const emit = defineEmits(['update:visible', 'submit', 'cancel']);
const selectedSubmitKeys = ref([]);
const selectedCancelKeys = ref([]);
const applicationReason = ref('');
const cancelApplicationReason = ref('');
const activeTab = ref('submit');
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
    selectedSubmitKeys.value = selectedRowKeys;
}
const selecCancelOnChange = (selectedRowKeys) => {
    selectedCancelKeys.value = selectedRowKeys;
}
const handleOk = ()=>{

}
const handleAction = ()=>{
  const selectedKeys = activeTab.value === 'submit' ? selectedSubmitKeys.value : selectedCancelKeys.value;
  if (selectedKeys.length === 0) {
    Message.warning('请至少选择一条数据');
    return;
  }
  
  if(activeTab.value === 'submit'){
    if(!applicationReason.value.trim()){
      Message.warning('请输入申请的原因');
      return;
    }
    
  }
  
  if(activeTab.value === 'withdraw'){
    if(!cancelApplicationReason.value.trim()){
      Message.warning('请输入撤销的原因');
      return;
    }
  }

  if (activeTab.value === 'submit') {
      //console.log('Confirming order for:', selectedKeys);
      emit('submit', { action: 'submit', selectedKeys ,reason: applicationReason.value});
    } else {
      //console.log('Canceling order for:', selectedKeys);
      emit('submit', { action: 'withdraw', selectedKeys ,reason: cancelApplicationReason.value});
    }

    emit('update:visible', false);

}

const handleSubmit = () => {
  if (selectedSubmitKeys.value.length === 0) {
    Message.warning('请至少选择一条数据');
    return;
  }

  if (!applicationReason.value.trim()) {
    Message.warning('请输入申请的原因');
    return;
  }

  console.log(selectedSubmitKeys.value, applicationReason.value);
  emit('submit', { selectedKeys: selectedSubmitKeys.value, reason: applicationReason.value });
  emit('update:visible', false);
};

const handleWithdraw = () => {
  // Implement the logic for withdrawing approval
  console.log('Withdrawing approval');
};

const handleCancel = () => {
  selectedSubmitKeys.value = [];
  selectedCancelKeys.value = [];
  applicationReason.value = '';
  cancelApplicationReason.value = '';
  emit('cancel');
  emit('update:visible', false);
};

const handleClose = () => {
  selectedSubmitKeys.value = [];
  selectedCancelKeys.value = [];
  applicationReason.value = '';
  cancelApplicationReason.value = '';
}
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