<template>
    <div class="toolbar">
      <div class="left">
        <a-space>
          <a-button type="primary" @click="openModal">
            <template #icon>
              <icon-plus />
            </template>
            创建订单
          </a-button>
          <a-button status="danger">
            <template #icon>
              <icon-delete />
            </template>
            删除
          </a-button>
        </a-space>
      </div>
      <div class="right">
        <a-input-search
          :style="{ width: '320px' }"
          placeholder="请输入搜索内容"
          search-button
        />
      </div>
    </div>

    <a-modal
      v-model:visible="visible"
      title="创建采购订单"
      @cancel="handleCancel"
      :mask-closable="false"
    >
      <a-form :model="formData" ref="formRef">
        
        <a-form-item
          field="description"
          label="订单描述"
          :rules="[{ required: true, message: '请输入订单描述' }]"
        >
          <a-input
            v-model="formData.description"
            placeholder="请输入订单描述"
          />
        </a-form-item>
        <a-form-item 
        field="supplier_id" 
        label="供应商" 
        :rules="[{ required: true, message: '请选择供应商' }]"
      >
        <a-select
          v-model="formData.supplier_id"
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
      
      
        <a-form-item field="type" label="订单类型">
          <a-select
            v-model="formData.type"
            placeholder="请选择订单类型"
          >
            <a-option value="STORAGE">外采入库</a-option>
            <a-option value="DIRECT">外采直供</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="remark" label="批注">
          <a-textarea
            v-model="formData.remark"
            placeholder="请输入批注信息"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon'
  import { Message } from '@arco-design/web-vue'
  import { usePurchaseOrderStore } from '@/stores'
  import { useSupplyStore } from '@/stores'
  const searchKey = ref('')
  const purchaseOrderStore = usePurchaseOrderStore()
  const supplyStore = useSupplyStore()
  const visible = ref(false)
  const formRef = ref(null)
  const formData = ref({
    description: '',
    type: 'STORAGE',
    remark: '',
    supplier_id: ''
  })

  const loading = ref(false)
  const supplierOptions = ref([])

  const openModal = () => {
    visible.value = true
  }

  const handleCancel = () => {
    formRef.value?.resetFields()
    visible.value = false
  }

  const handleOk = async () => {
    try {
      console.log(formData.value)
      const validResult = await formRef.value?.validate()
      console.log('验证结果:', validResult)
      if (!validResult) {
        await purchaseOrderStore.createPurchaseOrder(formData.value)
        Message.success('创建订单成功')
        visible.value = false
        formRef.value?.resetFields()
        // 刷新订单列表
        await purchaseOrderStore.getPurchaseOrders({
          page: 1,
          pageSize: purchaseOrderStore.pageSize
        })
      }
    } catch (error) {
      Message.error(error.message || '创建订单失败')
    }
  }

  const handleSupplierSearch = async (searchValue) => {
    searchKey.value = searchValue; // 保存搜索关键词
    await fetchSuppliers(); // 调用搜索接口
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