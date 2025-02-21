<template>
  <div class="toolbar">
    <div class="left">
      <a-space>
        <a-button type="primary" @click="openAddInventoryModal">
          <template #icon>
            <icon-plus />
          </template>
          添加新库存
        </a-button>
        <a-button status="danger" @click="confirmDelete">
          <template #icon>
            <icon-delete />
          </template>
          删除
        </a-button>
      </a-space>
    </div>
    <div class="right">
      <a-input-search
        v-model="storageStore.searchKey"
        :style="{ width: '320px' }"
        placeholder="请输入货物ID/货物名称"
        search-button
        :allow-clear="true"
        @search="handleSearch"
        @keyup.enter="handleSearch(storageStore.searchKey)"
      />
    </div>
  </div>

  <a-modal
    v-model:visible="addInventoryVisible"
    title="添加新库存"
    @cancel="handleCancel"
    :mask-closable="false"
    draggable
  >
    <a-form :model="inventoryFormData" ref="inventoryFormRef">
      <a-form-item
        field="goods_id"
        label="商品ID"
        :rules="[{ required: true, message: '请输入商品ID' }]"
      >
        <a-input
          v-model="inventoryFormData.goods_id"
          placeholder="请输入商品ID"
        />
      </a-form-item>
      <a-form-item
        field="name_en"
        label="英文名称"
        :rules="[{ required: true, message: '请输入英文名称' }]"
      >
        <a-input
          v-model="inventoryFormData.name_en"
          placeholder="请输入英文名称"
        />
      </a-form-item>
      <a-form-item
        field="name_zh"
        label="中文名称"
        :rules="[{ required: true, message: '请输入中文名称' }]"
      >
        <a-input
          v-model="inventoryFormData.name_zh"
          placeholder="请输入中文名称"
        />
      </a-form-item>
      <a-form-item
        field="description_en"
        label="英文描述"
        :rules="[{ required: true, message: '请输入英文描述' }]"
      >
        <a-textarea
          v-model="inventoryFormData.description_en"
          placeholder="请输入英文描述"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
      <a-form-item
        field="description_zh"
        label="中文描述"
        :rules="[{ required: true, message: '请输入中文描述' }]"
      >
        <a-textarea
          v-model="inventoryFormData.description_zh"
          placeholder="请输入中文描述"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
      <a-form-item
        field="specification"
        label="规格"
        :rules="[{ required: true, message: '请输入规格' }]"
      >
        <a-input
          v-model="inventoryFormData.specification"
          placeholder="请输入规格"
        />
      </a-form-item>
      <a-form-item
        field="unit"
        label="单位"
        :rules="[{ required: true, message: '请输入单位' }]"
      >
        <a-input
          v-model="inventoryFormData.unit"
          placeholder="请输入单位"
        />
      </a-form-item>
      <a-form-item
        field="price"
        label="价格"
        :rules="[{ required: true, message: '请输入价格' }]"
      >
        <a-input-number
          v-model="inventoryFormData.price"
          placeholder="请输入价格"
          :min="0.00000001"
          :precision="8"
        />
      </a-form-item>
      <a-form-item
        field="available_quantity"
        label="可用数量"
        :rules="[{ required: true, message: '请输入可用数量' }]"
      >
        <a-input-number
          v-model="inventoryFormData.available_quantity"
          placeholder="请输入可用数量"
          :min="1"
          :step="1"
        />
      </a-form-item>
      <a-form-item
        field="total_quantity"
        label="总数量"
        :rules="[{ required: true, message: '请输入总数量' }]"
      >
        <a-input-number
          v-model="inventoryFormData.total_quantity"
          placeholder="请输入总数量"
          :min="1"
          :step="1"
        />
      </a-form-item>
      <a-form-item
        field="inventory_alert_quantity"
        label="库存警戒值"
        :rules="[{ required: true, message: '请输入库存警戒值' }]"
      >
        <a-input-number
          v-model="inventoryFormData.inventory_alert_quantity"
          placeholder="请输入库存警戒值"
          :min="0"
          :step="1"
          :precision="0"
        />
      </a-form-item>
      <a-form-item field="is_on_sale" label="是否在售">
        <a-switch
          v-model="inventoryFormData.is_on_sale"
          :checked-value="1"
          :unchecked-value="0"
          checked-text="可售卖"
          unchecked-text="不可售卖"
        />
      </a-form-item>
      <a-form-item
        field="remark"
        label="备注"
      >
        <a-input
          v-model="inventoryFormData.remark"
          placeholder="请输入备注"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleAddInventory">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon'
import { Message, Modal } from '@arco-design/web-vue'
import { useStorageStore } from '@/stores'
const storageStore = useStorageStore()
const addInventoryVisible = ref(false)
const inventoryFormRef = ref(null)
const inventoryFormData = ref({
  is_on_sale: 1
})
const emit = defineEmits(['search','refresh'])
const openAddInventoryModal = () => {
  addInventoryVisible.value = true
}

const handleCancel = () => {
  inventoryFormRef.value?.resetFields()
  addInventoryVisible.value = false
}

const handleAddInventory = async () => {
  try {
    const validResult = await inventoryFormRef.value?.validate();
    if (validResult) return false;

    console.log(inventoryFormData.value);
    const response = await storageStore.createStorageItem(inventoryFormData.value);
    console.log(response);
   
    Message.success('添加库存成功');
    addInventoryVisible.value = false;
    inventoryFormRef.value?.resetFields();
    
  } catch (error) {
    console.error('Error adding inventory:', error);
    Message.error("该商品ID已存在");
  }
}

const selectedRow = ref(null);


const confirmDelete = () => {
  if (storageStore.selectedRows) {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个商品吗？此操作不可恢复',
      onOk: async () => {
        try {
          await storageStore.deleteStorageItem(storageStore.selectedRows);
          emit('refresh');
          Message.success('商品删除成功');
        } catch (error) {
          Message.error('删除失败');
        }
      }
    });
  } else {
    Message.error("请先选择要删除的商品");
  }
};



const handleSearch = (value) => {
  emit('search', value)
}
</script>

<style scoped>
.toolbar {
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
