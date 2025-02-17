<template>
  <a-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @page-size-change="$emit('page-size-change', $event)"
    @selection-change="handleTableChange"
    :loading="loading"
    row-key="goods_id"
    :row-selection="rowSelection"
    :scroll="{ x: 1500 }"
  >
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
    <template #isOnSale="{ record }">
      <a-tag :color="getSaleStatusColor(record.is_on_sale)">
        {{ record.is_on_sale === 1 ? '在售' : '非售' }}
      </a-tag>
    </template>
  </a-table>

  <a-modal
    v-model:visible="editVisible"
    title="修改库存信息"
    @before-ok="handleEditSubmit"
    @cancel="handleEditCancel"
    :mask-closable="false"
  > 
    <a-form :model="editForm" ref="editFormRef">
      <a-form-item field="name_zh" label="中文名称" :rules="[{ required: true, message: '请输入商品名称' }]">
        <a-input v-model="editForm.name_zh" placeholder="请输入商品名称" />
      </a-form-item>
      <a-form-item field="name_en" label="英文名称" :rules="[{ required: true, message: '请输入商品名称 (EN)' }]">
        <a-input v-model="editForm.name_en" placeholder="请输入商品名称 (EN)" />
      </a-form-item>
      <a-form-item field="description_zh" label="中文描述" :rules="[{ required: true, message: '请输入描述' }]">
        <a-textarea v-model="editForm.description_zh" placeholder="请输入描述" />
      </a-form-item>
      <a-form-item field="description_en" label="英文描述" :rules="[{ required: true, message: '请输入描述 (EN)' }]">
        <a-textarea v-model="editForm.description_en" placeholder="请输入描述 (EN)" />
      </a-form-item>
      <a-form-item field="specification" label="规格">
        <a-input v-model="editForm.specification" placeholder="请输入规格" />
      </a-form-item>
      <a-form-item field="unit" label="单位" :rules="[{ required: true, message: '请输入单位' }]">
        <a-input v-model="editForm.unit" placeholder="请输入单位" />
      </a-form-item>
      <a-form-item field="price" label="价格" :rules="[{ required: true, message: '请输入价格' }]">
        <a-input-number v-model="editForm.price" placeholder="请输入价格" :default-value="Number(editForm.price)"/>
      </a-form-item>
      <a-form-item field="available_quantity" label="可用数量" :rules="[{ required: true, message: '请输入可用数量' }]">
        <a-input-number v-model="editForm.available_quantity" placeholder="请输入可用数量" />
      </a-form-item>
      <a-form-item field="total_quantity" label="总数量" :rules="[{ required: true, message: '请输入总数量' }]">
        <a-input-number v-model="editForm.total_quantity" placeholder="请输入总数量" />
      </a-form-item>
      <a-form-item field="alt_product_id" label="备用产品ID">
        <a-input v-model="editForm.alt_product_id" placeholder="请输入备用产品ID" />
      </a-form-item>
      <a-form-item field="base_rule_for_pricing" label="定价规则">
        <a-input v-model="editForm.base_rule_for_pricing" placeholder="请输入定价规则" />
      </a-form-item>
       <a-form-item field="is_on_sale" label="是否在售">
        <a-switch
          v-model="editForm.is_on_sale"
          :checked-value="1"
          :unchecked-value="0"
          checked-text="可售卖"
          unchecked-text="不可售卖"
        />
      </a-form-item>
      <a-form-item field="remark" label="备注">
        <a-textarea v-model="editForm.remark" placeholder="请输入备注信息" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useStorageStore } from '@/stores'; // Assuming you have an inventory store
import { useRouter } from 'vue-router';
const storageStore = useStorageStore();
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

const emit = defineEmits(['page-change', 'page-size-change', 'refresh'])

const columns = [
  {
    title: '商品ID',
    dataIndex: 'goods_id',
    width: 150,
  },
  {
    title: '商品名称',
    dataIndex: 'name_zh',
    width: 200,
  },
  {
    title: '商品名称 (EN)',
    dataIndex: 'name_en',
    width: 200,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
  },
  {
    title: '规格',
    dataIndex: 'specification',
    width: 150,
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 100,
  },
  {
    title: '可用数量',
    dataIndex: 'available_quantity',
    width: 100,
  },
  {
    title: '总数量',
    dataIndex: 'total_quantity',
    width: 100,
  },
  {
    title: '库存警戒值',
    dataIndex: 'inventory_alert_quantity',
    width: 100,
  },
  {
    title: '描述(AI识别用)',
    dataIndex: 'description_zh',
    width: 300,
  },
  {
    title: '描述 (EN) (AI识别用)',
    dataIndex: 'description_en',
    width: 300,
  },
  {
    title: '定价规则 (AI识别用)',
    dataIndex: 'base_rule_for_pricing',
    width: 150,
  },
  {
    title: '备用产品ID (AI识别用)',
    dataIndex: 'alt_product_id',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
  },
  {
    title: '是否在售',
    dataIndex: 'is_on_sale',
    width: 100,
    slotName: 'isOnSale'
  },
  {
    title: '操作员',
    dataIndex: 'operator_full_name',
    width: 150,
  },
  {
    title: '入库时间',
    dataIndex: 'timestamp',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 150,
    slotName: 'operations',
    fixed: 'right'
  },
]

const editVisible = ref(false);
const editFormRef = ref(null);
const editForm = ref({
  name_zh: '',
  name_en: '',
  description_zh: '',
  description_en: '',
  unit: '',
  specification: '',
  price: 0,
  available_quantity: 0,
  total_quantity: 0,
  alt_product_id: '',
  base_rule_for_pricing: '',
  remark: ''
});
const handleTableChange = (record) => {
  storageStore.selectedRows = record[0];
}
const router = useRouter();
// const inventoryStore = useInventoryStore();

const handleEdit = (record) => {
  editForm.value = { ...record };
  editVisible.value = true;
};

const handleEditSubmit = async () => {
  try {
    const validResult = await editFormRef.value.validate();
    if (validResult) return false;
    // Update inventory item logic here
    //editForm.value.goods_id
    await storageStore.updateStorageItem(editForm.value.goods_id, {
      name_en: editForm.value.name_en,
      name_zh: editForm.value.name_zh,
      description_en: editForm.value.description_en,
      description_zh: editForm.value.description_zh,
      unit: editForm.value.unit,
      specification: editForm.value.specification,
      price: editForm.value.price,
      alt_product_id: editForm.value.alt_product_id,
      base_rule_for_pricing: editForm.value.base_rule_for_pricing,
      inventory_alert_quantity: editForm.value.inventory_alert_quantity,
      remark: editForm.value.remark,
      is_on_sale: editForm.value.is_on_sale,
      available_quantity: editForm.value.available_quantity,
      total_quantity: editForm.value.total_quantity
    });
    console.log(editForm.value)
    Message.success('修改库存成功');
    emit('refresh');
    editVisible.value = false;
    return true;
  } catch (error) {
    // Handle validation error
    Message.error('修改库存失败');
    return false;
  }
};

const handleEditCancel = () => {
  editVisible.value = false;
  editFormRef.value?.resetFields();
};

const handleView = (record) => {
    console.log(record);
//   router.push({
//     name: 'InventoryDetail', // Assuming you have a detail view for inventory
//     params: {
//       id: record.goods_id
//     }
//   });
};

const getSaleStatusColor = (status) => {
  return status === 1 ? 'green' : 'red';
};
</script>

<style scoped>
:deep(.arco-btn) {
  margin-right: 8px;
}

:deep(.arco-table-fixed-right) {
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}
</style>
