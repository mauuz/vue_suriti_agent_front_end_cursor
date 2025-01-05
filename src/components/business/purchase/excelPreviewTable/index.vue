<template>
  <a-modal
    :visible="visible"
    :width="1200"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>
      Excel 数据预览 (共 {{ data.length }} 条数据)
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
      />
    </div>

    <template #footer>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
        <span>已选择: {{ selectedKeys.length }} 条数据</span>
        <div>
          <a-button @click="handleCheck" type="primary" style="margin-right: 8px;">
            确认选择
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
import { ref, defineEmits, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useRoute } from 'vue-router';
import { usePurchaseItemStore } from '@/stores/modules/purchase/purchaseItemStore';

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

const emit = defineEmits(['update:visible', 'ok', 'cancel', 'refresh-data']);
const route = useRoute();
const store = usePurchaseItemStore();
// 选中的行的 keys
const selectedKeys = ref([]);

// 表格列定义
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

// 表格选择配置
const rowSelection = {
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: true,
  onChange: (selectedRowKeys, selectedRows) => {
    selectedKeys.value = selectedRowKeys;
    console.log('选中的行keys:', selectedRowKeys);
    console.log('选中的行数据:', selectedRows);
  }
};

// 处理确认选择按钮点击
const handleCheck = async () => {
  if (selectedKeys.value.length === 0) {
    Message.warning('请至少选择一条数据');
    return;
  }

  // 获取选中的数据并处理
  const selectedData = props.data
    .filter(item => selectedKeys.value.includes(item.key))
    .map(({ key, ...rest }) => ({
      ...rest,
      unit_price: Number(rest.unit_price).toFixed(8),
      total_price: Number(rest.quantity * Number(rest.unit_price)).toFixed(8)
    }));

  console.log('最终选中的数据:', selectedData);
  
  try {
    await store.createPurchaseItemBatch(route.params.id, selectedData);
    Message.success('批量创建采购项目成功');
    emit('update:visible', false);
    emit('refresh-data');
    
  } catch (error) {
    console.error('批量创建失败:', error);
    Message.error('批量创建失败：' + (error.message || '未知错误'));
  }
};

// 处理确认
const handleOk = () => {
  if (selectedKeys.value.length === 0) {
    Message.warning('请至少选择一条数据');
    return;
  }
  
  // 获取选中的数据并剔除 key
  const selectedData = props.data
    .filter(item => selectedKeys.value.includes(item.key))
    .map(({ key, ...rest }) => rest);

  emit('ok', selectedData);
  emit('update:visible', false);
};

// 处理取消
const handleCancel = () => {
  selectedKeys.value = [];
  emit('cancel');
  emit('update:visible', false);
};

// 当弹窗关闭或数据变化时重置选中状态
watch([() => props.visible, () => props.data], ([newVisible]) => {
  if (!newVisible) {
    selectedKeys.value = [];
  }
}, { immediate: true });
</script>

<style scoped>
.arco-modal {
  max-width: 90vw;
}

.table-container {
  position: relative;
  overflow: auto;
}

/* 设置滚动条整体样式 */
.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: transparent;  /* 移除背景 */
}

/* 隐藏轨道 */
.table-container::-webkit-scrollbar-track {
  background: transparent;
}

/* 设置滚动条滑块样式 */
.table-container::-webkit-scrollbar-thumb {
  background: #999;  /* 更深的灰色 */
  border-radius: 6px;  /* 更圆的边角 */
}

/* 鼠标悬停时的样式 */
.table-container::-webkit-scrollbar-thumb:hover {
  background: #666;  /* 悬停时更深的颜色 */
}

/* 隐藏滚动条交汇处 */
.table-container::-webkit-scrollbar-corner {
  background: transparent;
}

/* 表格内部滚动条样式 */
:deep(.arco-table-body) {
  scrollbar-width: thin;
  scrollbar-color: #999 transparent;
}

:deep(.arco-table-body::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
  background: transparent;
}

:deep(.arco-table-body::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.arco-table-body::-webkit-scrollbar-thumb) {
  background: #999;
  border-radius: 6px;
}

:deep(.arco-table-body::-webkit-scrollbar-thumb:hover) {
  background: #666;
}

:deep(.arco-table-body::-webkit-scrollbar-corner) {
  background: transparent;
}
</style> 