<template>
  <a-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @page-change="$emit('page-change', $event)"
    @page-size-change="$emit('page-size-change', $event)"
    :loading="loading"
    row-key="supplierId"
    :row-selection="rowSelection"
    :scroll="{ x: 1600 }"
  >
    <template #status="{ record }">
      <a-tag :color="getStatusColor(record.status)">
        {{ getStatusText(record.status) }}
      </a-tag>
    </template>
    <template #operations="{ record }">
      <a-button @click="editSupplier(record)" type="primary">修改</a-button>
      <slot name="operations" :record="record"></slot>
    </template>
  </a-table>

  <a-modal
    v-model:visible="editDialogVisible"
    title="编辑供应商"
    @cancel="handleCancel"
    ok-text="保存"
    :mask-closable="false"
    :unmount-on-close="false"
    :on-before-ok="handleBeforeConfirm"
  >
    <a-form :model="editFormData" ref="formRef" :rules="rules">
      <a-form-item field="name" label="供应商名称" required>
        <a-input v-model="editFormData.name" placeholder="请输入供应商名称" />
      </a-form-item>

      <a-form-item field="shippingAddress" label="发货地" required>
        <a-textarea 
          v-model="editFormData.shippingAddress" 
          placeholder="请输入发货地  省/市/县（多仓库，请用 ， 逗号分隔）"
          :auto-size="{ minRows: 2, maxRows: 3 }"
        />
      </a-form-item>

      <a-form-item field="contactPerson" label="联系人">
        <a-input v-model="editFormData.contactPerson" placeholder="请输入联系人姓名" />
      </a-form-item>

      <a-form-item field="contactInfo" label="联系电话">
        <a-input v-model="editFormData.contactInfo" placeholder="请输入联系电话" />
      </a-form-item>

      <a-form-item field="bankName" label="开户行">
        <a-input v-model="editFormData.bankName" placeholder="请输入开户行" />
      </a-form-item>

      <a-form-item field="paymentAccount" label="银行账号">
        <a-input v-model="editFormData.paymentAccount" placeholder="请输入银行账号" />
      </a-form-item>

      <a-form-item field="payee" label="收款人">
        <a-input v-model="editFormData.payee" placeholder="请输入收款人" />
      </a-form-item>

      <a-form-item field="remarks" label="备注">
        <a-textarea 
          v-model="editFormData.remarks" 
          placeholder="请输入备注信息"
          :auto-size="{ minRows: 2, maxRows: 3 }"
        />
      </a-form-item>

      <a-form-item field="status" label="状态">
        <a-switch
          v-model="editFormData.status"
          :checked-value="1"
          :unchecked-value="0"
          checked-text="启用"
          unchecked-text="禁用"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { useSupplyStore } from '@/stores/modules/supply/supplyStore'
import { Message } from '@arco-design/web-vue'
const supplyStore = useSupplyStore()
const editDialogVisible = ref(false)
const editFormData = ref({
  supplierName: '',
  contactInfo: '',
  contactPerson: '',
  paymentAccount: '',
  payee: '',
  bankName: '',
  shippingAddress: '',
  remarks: '',
  status: 1  
})
const formRef = ref(null)

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

const emit = defineEmits(['page-change', 'page-size-change'])

const columns = [
  {
    title: '供应商编号',
    dataIndex: 'supplierId',
    width: 100,
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 200,
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    width: 120,
  },
  {
    title: '联系方式',
    dataIndex: 'contactInfo',
    width: 150,
  },
  {
    title: '开户行',
    dataIndex: 'bankName',
    width: 150,
    ellipsis: true,
  },
  {
    title: '收款账号',
    dataIndex: 'paymentAccount',
    width: 200,
    ellipsis: true,
  },
  {
    title: '收款人',
    dataIndex: 'payee',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    slotName: 'status'
  },
  {
    title: '发货地址',
    dataIndex: 'shippingAddress',
    width: 250,
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 200,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 150,
    fixed: 'right',
    slotName: 'operations'
  }
]

const getStatusColor = (status) => {
  return status === 1 ? 'green' : 'red'
}

const getStatusText = (status) => {
  return status === 1 ? '启用' : '禁用'
}

const editSupplier = (record) => {
  editFormData.value = {
    supplierId: record.supplierId,
    name: record.supplierName || '',
    contactInfo: record.contactInfo || '',
    contactPerson: record.contactPerson || '',
    paymentAccount: record.paymentAccount || '',
    payee: record.payee || '',
    bankName: record.bankName || '',
    shippingAddress: record.shippingAddress || '',
    remarks: record.remarks || '',
    status: record.status || 1,
    createdAt: record.createdAt,
    creatorId: record.creatorId,
    creatorName: record.creatorName,
    status: record.status
  }
  editDialogVisible.value = true
}

const handleCancel = () => {
  editDialogVisible.value = false
  editFormData.value = {
    supplierId:'',
    name: '',
    contactInfo: '',
    contactPerson: '',
    paymentAccount: '',
    payee: '',
    bankName: '',
    shippingAddress: '',
    remarks: '',
    status: 1
  }
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const handleBeforeConfirm = async () => {
  if (formRef.value) {
    try {
      const valid = await formRef.value.validate()
      if (valid) {
        return false
      }
      
      await supplyStore.updateSupplier(editFormData.value)
      Message.success('修改成功')
      editDialogVisible.value = false
      formRef.value.resetFields()
      await supplyStore.getSupplierList({
        page: supplyStore.currentPage,
        pageSize: supplyStore.pageSize
      })
      return true
    } catch (error) {
      if (error.response?.data?.detail === 'Supplier already exists') {
        Message.error('供应商已存在，不可重复添加！')
      }
      return false
    }
  }
  return false
}

const rules = {
  name: [
    { required: true, message: '请输入供应商名称' },
    { maxLength: 100, message: '供应商名称不能超过100个字符' }
  ],
  shippingAddress: [
    { required: true, message: '请输入发货地址' }
  ]
}

// Fetch suppliers when the component is mounted
// onMounted(() => {
//   supplyStore.getSupplierList({
//     page: supplyStore.currentPage,
//     pageSize: supplyStore.pageSize
//   })
// })
</script> 