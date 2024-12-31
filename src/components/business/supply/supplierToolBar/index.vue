<template>
  <div class="toolbar">
    <div class="left">
      <a-space>
        <a-button type="primary" @click="showCreateDialog">
          <template #icon>
            <icon-plus />
          </template>
          新增供应商
        </a-button>
        <a-button status="danger">
          <template #icon>
            <icon-stop />
          </template>
          禁用
        </a-button>
      </a-space>
    </div>
    <div class="right">
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="请输入供应商名称/编号"
        search-button
      />
    </div>
  </div>

  <a-modal
    v-model:visible="createDialogVisible"
    title="新增供应商"
    @cancel="handleCancel"
    :mask-closable="false"
    :unmount-on-close="false"
    :on-before-ok="handleBeforeConfirm"
  >
    <a-form :model="formData" ref="formRef" :rules="rules">
      <a-form-item field="name" label="供应商名称" required>
        <a-input v-model="formData.name" placeholder="请输入供应商名称 tb-xxxx" />
      </a-form-item>
      
      <a-form-item field="shipping_address" label="发货地" required>
        <a-textarea 
          v-model="formData.shipping_address" 
          placeholder="请输入发货地  省/市/县（多仓库，请用 ， 逗号分隔）"
          :auto-size="{ minRows: 2, maxRows: 3 }"
        />
      </a-form-item>
      <a-form-item field="contactPerson" label="联系人">
        <a-input v-model="formData.contact_person" placeholder="请输入联系人姓名" />
      </a-form-item>

      <a-form-item field="contactInfo" label="联系电话">
        <a-input v-model="formData.contact_info" placeholder="请输入联系电话" />
      </a-form-item>

      <a-form-item field="bankName" label="开户行">
        <a-input v-model="formData.bank_name" placeholder="请输入开户行" />
      </a-form-item>

      <a-form-item field="paymentAccount" label="银行账号">
        <a-input v-model="formData.payment_account" placeholder="请输入银行账号" />
      </a-form-item>

      <a-form-item field="payee" label="收款人">
        <a-input v-model="formData.payee" placeholder="请输入收款人" />
      </a-form-item>

      <a-form-item field="remarks" label="备注">
        <a-textarea 
          v-model="formData.remarks" 
          placeholder="请输入备注信息"
          :auto-size="{ minRows: 2, maxRows: 3 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { IconPlus, IconStop } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { useSupplyStore } from '@/stores'

const supplyStore = useSupplyStore()

// 表单引用
const formRef = ref(null)

// 弹窗显示状态
const createDialogVisible = ref(false)

// 表单数据
const formData = ref({
  name: '',
  contact_info: '',
  contact_person: '',
  payment_account: '',
  payee: '',
  bank_name: '',
  shipping_address: '',
  remarks: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入供应商名称' },
    { maxLength: 100, message: '供应商名称不能超过100个字符' }
  ],
  shipping_address: [
    { required: true, message: '请输入发货地址' }
  ]
}

// 显示创建弹窗
const showCreateDialog = () => {
  createDialogVisible.value = true
}

// 处理取消
const handleCancel = () => {
  createDialogVisible.value = false
  formRef.value.resetFields()
}

// 处理确认前的验证
const handleBeforeConfirm = async (done) => {
  try {
    const validResult = await formRef.value.validate()
    if (validResult === undefined || validResult === null) {
      await supplyStore.createSupplier(formData.value)
      Message.success('创建供应商成功')
      formRef.value.resetFields()
      await supplyStore.getSupplierList({
        page: 1,
        page_size: supplyStore.pageSize
      })
      done(true)
    } else {
      done(false)
    }
  } catch (error) {
    console.log(error)
    Message.error("供应商已存在，不可重复添加！")
    done(false)
  }
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