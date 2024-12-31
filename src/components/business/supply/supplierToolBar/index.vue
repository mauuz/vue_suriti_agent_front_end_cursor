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
            <icon-delete />
          </template>
          删除
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
      <a-form-item field="supplierName" label="供应商名称" required>
        <a-input v-model="formData.supplierName" placeholder="请输入供应商名称" />
      </a-form-item>
      
      <a-form-item field="contactPerson" label="联系人" required>
        <a-input v-model="formData.contactPerson" placeholder="请输入联系人姓名" />
      </a-form-item>

      <a-form-item field="contactPhone" label="联系电话" required>
        <a-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
      </a-form-item>

      <a-form-item field="address" label="地址">
        <a-textarea 
          v-model="formData.address" 
          placeholder="请输入地址"
          :auto-size="{ minRows: 2, maxRows: 3 }"
        />
      </a-form-item>

      <a-form-item field="remark" label="备注">
        <a-textarea 
          v-model="formData.remark" 
          placeholder="请输入备注信息"
          :auto-size="{ minRows: 2, maxRows: 3 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { useSupplyStore } from '@/stores'

const supplyStore = useSupplyStore()

// 表单引用
const formRef = ref(null)

// 弹窗显示状态
const createDialogVisible = ref(false)

// 表单数据
const formData = ref({
  supplierName: '',
  contactPerson: '',
  contactPhone: '',
  address: '',
  remark: ''
})

// 表单验证规则
const rules = {
  supplierName: [
    { required: true, message: '请输入供应商名称' },
    { maxLength: 100, message: '供应商名称不能超过100个字符' }
  ],
  contactPerson: [
    { required: true, message: '请输入联系人姓名' },
    { maxLength: 50, message: '联系人姓名不能超过50个字符' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
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
      emit('refresh')
      done(true)
    } else {
      done(false)
    }
  } catch (error) {
    console.log(error)
    Message.error(error.message || '创建供应商失败')
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