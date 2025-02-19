<template>
  <a-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @page-size-change="$emit('page-size-change', $event)"
    :loading="loading"
    row-key="orderNo"
    v-model:selectedKeys="purchaseOrderStore.selectedPurchaseOrderList"
    @selection-change="selectOnChange"
    :row-selection="rowSelection"
  > 
    <template #name-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
      <div class="custom-filter">
        <a-input 
          v-model="purchaseOrderStore.operatorFliter" 
          @input="(value)=>setFilterValue([value])" 
          placeholder="请输入操作员名称"
          style="width: 200px; margin-right: 8px;"
        />
        <a-button 
          type="primary" 
          @click="handleSearchClick(handleFilterConfirm)"
          style="margin-right: 8px;"
        >
          搜索
        </a-button>
        <a-button @click="handleResetClick(handleFilterReset)">重置</a-button>
      </div>
    </template>

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

    <template #operations="{ record }">
      <a-space>
        <a-button 
          type="primary" 
          size="small"
          @click="handleEdit(record)"
        >
          修改
        </a-button>
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

  <a-modal
    v-model:visible="editVisible"
    title="修改采购订单"
    @before-ok="handleEditSubmit"
    @cancel="handleEditCancel"
  > 

    <a-form :model="editForm" ref="editFormRef">
      <a-form-item
        field="description"
        label="订单描述"
        :rules="[{ required: true, message: '请输入订单描述' }]"
      >
        <a-input v-model="editForm.description" placeholder="请输入订单描述" />
      </a-form-item>
      <a-form-item 
        field="supplier_id" 
        label="供应商" 
        :rules="[{ required: true, message: '请选择供应商' }]"
      >
        <a-select
          v-model="editForm.supplier_id"
          placeholder="请选择供应商"
          allow-search
          :loading="supplyStore.loading"
          :filter-option="true"

          @search="handleSupplierSearch"
        >
          <a-option
            v-for="option in supplierOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-option>
        </a-select>
      </a-form-item>

      <a-form-item
        field="type"
        label="订单类型"
        :rules="[{ required: true, message: '请选择订单类型' }]"
      >
        <a-select v-model="editForm.type">
          <a-option value="STORAGE">外采入库</a-option>
          <a-option value="DIRECT">外采直供</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="remarks" label="备注">
        <a-textarea v-model="editForm.remarks" placeholder="请输入备注信息" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { IconSearch } from '@arco-design/web-vue/es/icon';
import { ref, nextTick,h } from 'vue';
import { Message } from '@arco-design/web-vue';
import { usePurchaseOrderStore } from '@/stores/modules/purchase/purchaseOrderStore';
import { useRouter } from 'vue-router';
import { useSupplyStore } from '@/stores'
const supplyStore = useSupplyStore()
const searchKey = ref('')
const supplierOptions = ref([])
const handleSupplierSearch = async (searchValue) => {
    searchKey.value = searchValue; // 保存搜索关键词
    await fetchSuppliers(); // 调用搜索接口
};


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
    }),
    
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
    title: '供应商',
    dataIndex: 'supplierName',
    width: 100,
  },
  {
    title: '审批状态',
    dataIndex: 'approvalStatus',
    width: 100,
    slotName: 'approvalStatus'
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
    title: '运费',
    dataIndex: 'shippingFee',
    width: 100,
  },
  {
    title: '结算金额（含邮费）',
    dataIndex: 'totalPrice',
    width: 100,
  },
  {
    title: '操作员',
    dataIndex: 'operator',
    width: 70,
    filterable: {
      slotName: 'name-filter',
      icon: () => h(IconSearch)
    }

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
    '部分下单': 'blue',
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
    '未提交': 'gray',
    '审核中': 'orange',
    '已通过': 'green',
    '未通过': 'red'
  }
  return colorMap[status] || 'gray'
}

const purchaseOrderStore = usePurchaseOrderStore();
const editVisible = ref(false);
const editFormRef = ref(null);
const editForm = ref({
  orderId: null,
  description: '',
  type: 'STORAGE',
  remarks: '',
  supplier_id: ''
});

const router = useRouter();

const handleEdit = async (record) => {
  console.log('supplier_id type:', typeof record.supplier_id);
  console.log('supplier_id value:', record.supplier_id);
  
  console.log(record)
  // // 先设置选项
  supplierOptions.value = [{
    label: record.supplierName,
    value: record.supplierId
  }];
  
  // // 然后设置表单值
  editForm.value = {
    orderId: record.orderNo,
    description: record.orderName,
    type: record.orderType === 0 ? 'STORAGE' : 'DIRECT',
    remarks: record.remark || '',
    supplier_id: record.supplierId  // 使用转换后的 ID
  };
  
  editVisible.value = true;
};

const handleEditSubmit = async () => {
  try {
    const result = await editFormRef.value.validate();

    if(result)return false;
    await purchaseOrderStore.updatePurchaseOrder(
      editForm.value
    );
    Message.success('修改成功');
    editVisible.value = false;
    await purchaseOrderStore.getPurchaseOrders(
      {
        page: purchaseOrderStore.currentPage,
        pageSize: purchaseOrderStore.pageSize
      }
    );
    return true;
  } catch (error) {
    Message.error(error.message || '修改失败');
  }
};

const handleEditCancel = () => {
  editVisible.value = false;
  editFormRef.value?.resetFields();
};

const handleView = (record) => {
  console.log(record)
  router.push({
    name: 'PurchaseOrderDetail',
    params: {
      id: record.orderNo
    }
  });
};
const fetchSuppliers = async () => {
    try {
      const result = await supplyStore.searchSuppliers(searchKey.value);
      supplierOptions.value = result.map(item => ({
        label: item.name,
        value: item.id  // value 存储供应商 ID
      }));
    } catch (error) {
      Message.error('获取供应商列表失败');
    }
  };

  const selectOnChange = (selectedKeys) => {
    // console.log('Selected Row Keys:', selectedKeys);
    purchaseOrderStore.selectedPurchaseOrderList = selectedKeys;
  }

  const handleSearchClick = async (nativeHandler) => {
    console.log('用户点击了搜索按钮');
    // 在这里添加搜索的自定义逻辑
    purchaseOrderStore.currentPage = 1;
    await purchaseOrderStore.getPurchaseOrders({
      page: purchaseOrderStore.currentPage,
      pageSize: purchaseOrderStore.pageSize,
      operator: purchaseOrderStore.operatorFliter
    });
    nativeHandler(); // 执行原有的过滤确认逻辑
  };

  const handleResetClick = async (nativeHandler) => {
    console.log('用户点击了重置按钮');
    purchaseOrderStore.operatorFliter = ''; // 示例：清空筛选值
    purchaseOrderStore.currentPage = 1;
    await purchaseOrderStore.getPurchaseOrders({
      page: purchaseOrderStore.currentPage,
      pageSize: purchaseOrderStore.pageSize,
      operator: purchaseOrderStore.operatorFliter
    });
    nativeHandler(); // 执行原有的重置逻辑
  };
</script>

<style scoped>
.custom-filter {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

:deep(.arco-btn) {
  margin-right: 8px;
}
</style>