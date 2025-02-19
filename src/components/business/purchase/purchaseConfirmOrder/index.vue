<template>
    <a-modal
      :visible="visible"
      :width="1200"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title>
          更新下单状态
      </template>
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="unordered" title="未下单">
          <div class="table-container">
            <a-table 
              :columns="columns" 
              :data="data.unOrderedItems" 
              :row-selection="rowSelectionUnordered"
              v-model:selectedKeys="selectedKeysUnordered"
              :virtual-list-props="{ height: 400 }"
              :pagination="false"
              :scroll="{ x: 1200 }"
              @selection-change="selecOnChangeUnordered"
              rowKey="purchase_item_id"
            >
                <template #orderStatus="{ record }">
                    <a-tag :color="getOrderStatusColor(record.order_status)">
                        {{ record.order_status === 1 ? '已下单' : '未下单' }}
                    </a-tag>
                </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="ordered" title="已下单">
          <div class="table-container">
            <a-table 
              :columns="columns" 
              :data="data.orderedItems" 
              :row-selection="rowSelectionOrdered"
              v-model:selectedKeys="selectedKeysOrdered"
              :virtual-list-props="{ height: 400 }"
              :pagination="false"
              :scroll="{ x: 1200 }"
              @selection-change="selecOnChangeOrdered"
              rowKey="purchase_item_id"
            >
                <template #orderStatus="{ record }">
                    <a-tag :color="getOrderStatusColor(record.order_status)">
                        {{ record.order_status === 1 ? '已下单' : '未下单' }}
                    </a-tag>
                </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
  
      <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
          <span>
            已选择: 
            {{ activeTab === 'unordered' ? selectedKeysUnordered.length : selectedKeysOrdered.length }} 
            条数据
          </span>
          <div>
            <a-button @click="handleAction" type="primary" style="margin-right: 8px;">
              {{ activeTab === 'unordered' ? '确认下单' : '取消下单' }}
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
      default: () => []
    }
  });
  
  const emit = defineEmits(['update:visible', 'submit', 'cancel']);
  const selectedKeysUnordered = ref([]);
  const selectedKeysOrdered = ref([]);
  const activeTab = ref('unordered');
  
  const columns = [
    {
      title: '序号',
      dataIndex: 'sequence',
      fixed: 'left',
      width: 80,
    },
    {
      title: '订单编号',
      dataIndex: 'purchase_order',
      width: 120,
    },
    {
      title: '采购项目编号',
      dataIndex: 'purchase_item_id',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'product_name_zh',
      width: 200,
    },
    {
      title: '下单状态',
      dataIndex: 'order_status',
      width: 200,
      slotName: 'orderStatus'
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 100,
    },
    {
      title: '单价',
      dataIndex: 'unit_price',
      width: 120,
      formatter: (value) => Number(value).toFixed(2)
    },
    {
      title: '总价',
      dataIndex: 'total_price',
      width: 120,
      formatter: (value) => Number(value).toFixed(2)
    }
  ];
  
  const rowSelectionUnordered = {
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: true,
    // onChange: (selectedRowKeys) => {
    //   selectedKeysUnordered.value = selectedRowKeys;
    // }
  };
  
  const rowSelectionOrdered = {
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: true,
    // onChange: (selectedRowKeys) => {
    //   selectedKeysOrdered.value = selectedRowKeys;
    // }
  };
  
  const selecOnChangeUnordered = (selectedRowKeys) => {
    selectedKeysUnordered.value = selectedRowKeys;
  }
  const selecOnChangeOrdered = (selectedRowKeys) => {
    selectedKeysOrdered.value = selectedRowKeys;
  }

  const handleOk = () => {
    // Handle OK logic if needed
  }
  
  const handleAction = () => {
    const selectedKeys = activeTab.value === 'unordered' ? selectedKeysUnordered.value : selectedKeysOrdered.value;

    if (selectedKeys.length === 0) {
      Message.warning('请至少选择一条数据');
      return;
    }

    if (activeTab.value === 'unordered') {
      //console.log('Confirming order for:', selectedKeys);
      emit('submit', { action: 'confirm', selectedKeys });
    } else {
      //console.log('Canceling order for:', selectedKeys);
      emit('submit', { action: 'cancel', selectedKeys });
    }

    emit('update:visible', false);
    selectedKeysUnordered.value = [];
    selectedKeysOrdered.value = [];
  };
  
  const handleCancel = () => {
    selectedKeysUnordered.value = [];
    selectedKeysOrdered.value = [];
    emit('cancel');
    emit('update:visible', false);
  };
  
  const getOrderStatusColor = (orderStatus) => {
    return orderStatus === 1 ? 'green' : 'red';
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