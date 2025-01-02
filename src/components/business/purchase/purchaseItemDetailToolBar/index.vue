<template>
  <div class="toolbar-container">
    <a-space>
      <a-button type="primary" @click="handleAddRow">
        <template #icon>
          <icon-plus />
        </template>
        添加新行
      </a-button>

      <a-button status="danger" @click="handleDeleteRows">
        <template #icon>
          <icon-delete />
        </template>
        删除选中行
      </a-button>
     
      <a-button type="primary" @click="handleAddRow">
        <template #icon>
          <icon-upload/>
        </template>
        Excel导入（新增导入）
      </a-button>


      <a-button type="primary" @click="handleAddRow">
        <template #icon>
          <icon-upload />
        </template>
        Excel导入（覆盖导入）
      </a-button>
      
    </a-space>
  </div>
</template>

<script setup>
import { IconPlus, IconDelete, IconUpload, IconSync } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { usePurchaseItemStore } from '@/stores/modules/purchase/purchaseItemStore'



const emit = defineEmits(['add-row', 'delete-rows'])

const purchaseItemStore = usePurchaseItemStore()

// 添加新行
const handleAddRow = () => {
  emit('add-row')
}

// 删除选中行
const handleDeleteRows = () => {
  emit('delete-rows')
}

// Excel新增上传
const handleExcelAdd = async (option) => {
  
}

// Excel替换上传
const handleExcelReplace = async (option) => {
  
}
</script>

<style scoped>
.toolbar-container {
  margin-bottom: 16px;
}
</style>
