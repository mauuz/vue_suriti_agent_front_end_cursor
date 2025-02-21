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
     
      <a-button type="primary" @click="handleExcelAdd">
        <template #icon>
          <icon-upload/>
        </template>
        Excel导入（新增导入）
      </a-button>

      <a-button type="primary" @click="handleExcelDownload">
        <template #icon>
          <icon-download />
        </template>
        模板下载
      </a-button>

      <a-button type="dashed" @click="handleSubmitApproval">
        <template #icon>
          <icon-launch />
        </template>
        提交审批/撤回审批
      </a-button>

      <a-button type="dashed" @click="handleOrder">
        <template #icon>
          <icon-send />
        </template>
        下单/取消下单
      </a-button>

      <a-button type="dashed" @click="showModal = true">
        <template #icon>
          <icon-download />
        </template>
        导出采购订单（PDF）
      </a-button>
    </a-space>
    <div class="postage-container">
      邮费:
      <a-input-number
        v-model="postage"
        :min="0"
        :max="99999999.99999999"
        :precision="8"
        placeholder="输入邮费"
        style="width: 200px;"
      />

      <a-button type="primary" @click="handleSavePostage">
        <template #icon>
          <icon-save />
        </template>
        保存邮费
      </a-button>
    </div>
    

  <a-modal v-model:visible="showModal" title="导出采购订单" @ok="handlePurchaseOrderDownload" @before-open="handleBeforeOpenPDFOutput">
    <a-form :model="formData">
      <a-form-item label="供应商地址">
        <a-input v-model="formData.address" />
      </a-form-item>
      <a-form-item label="电话">
        <a-input v-model="formData.phone" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model="formData.email" />
      </a-form-item>
      <a-form-item label="收款人">
        <a-input v-model="formData.recipient" />
      </a-form-item>
      <a-form-item label="银行账户">
        <a-input v-model="formData.account" />
      </a-form-item>
      <a-form-item label="开户行名称">
        <a-input v-model="formData.bank" />
      </a-form-item>
      <a-form-item label="开户行地址">
        <a-input v-model="formData.bank_address" />
      </a-form-item>
      <a-form-item label="收货地址" :rules="[{ required: true, message: '请输入收货地址' }]">
        <a-textarea v-model="formData.delivery_address" placeholder="请输入收货地址" />
      </a-form-item>
    </a-form>
  </a-modal>
  </div>
</template>

<script setup>
import { IconPlus, IconDelete, IconUpload, IconDownload, IconLaunch, IconSend, IconSave } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import ExcelJS from 'exceljs'
import { useRoute } from 'vue-router'
import { ref,computed } from 'vue';
import { usePurchaseOrderStore,usePurchaseItemStore,useSupplyStore } from '@/stores'
const purchaseOrderStore = usePurchaseOrderStore()
const purchaseItemStore = usePurchaseItemStore()
const supplyStore = useSupplyStore()
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const emit = defineEmits(['add-row', 'delete-rows', 'excel-add', 'excel-replace', 'refresh-data','submit-approval','order-confirm','save-postage'])
const route = useRoute()
const orderId = route.params.id 
const postage = computed({
  get: () =>  {
    return purchaseOrderStore.getshippingFeeFromPurchaseOrderID(orderId)
  },
  set: (value) => {
    purchaseOrderStore.updateShippingFee(orderId, value);
  }
});
const showModal = ref(false)
const formData = ref({
  delivery_address: '',
  address: '',
  phone: '',
  email: '',
  account: '',
  recipient: '',
  bank: '',
  bank_address: ''
})

// 添加新行
const handleAddRow = () => {
  emit('add-row')
}

// 删除选中行
const handleDeleteRows = () => {
  emit('delete-rows')
}

// Excel新增上传
const handleExcelAdd = () => {
  emit('excel-add')
}

const handleOrder = ()=>{
  emit("order-confirm")
}


const handleSubmitApproval = () => {
  emit('submit-approval')
}

// 下载excel 模板
const handleExcelDownload = async () => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('采购明细模板')

  // 定义表头
  const headers = [
    '产品序号',
    '产品代码（客户）',
    '产品代码',
    '产品描述',
    '规格',
    '中文翻译',
    '数量',
    '单位',
    '成本价',
    '售价',
    '供应商简称',
    '船部门',
    '备注',
    '品牌'
  ]

  // 设置列宽
  worksheet.columns = headers.map(() => ({ width: 15 }))

  // 添加表头行
  const headerRow = worksheet.addRow(headers)
  
  // 设置需要黄色背景的列
  const yellowColumns = [1, 3, 4, 5, 6, 7, 8, 9] // 对应需要黄色背景的列索引
  yellowColumns.forEach(colIndex => {
    headerRow.getCell(colIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' } // 黄色背景
    }
  })

  // 生成并下载文件
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  
  // 从路由参数中获取采购订单号
  const purchaseOrderId = route.params.id || route.query.id

  // 创建下载链接
  const link = document.createElement('a')
  link.href = url
  link.download = `${purchaseOrderId}.xlsx`
  link.click()
  window.URL.revokeObjectURL(url)
}


// Handle save postage
const handleSavePostage = () => {

  // Emit or handle the postage value as needed
  console.log('邮费已保存:', postage.value)
  emit('save-postage', postage.value)
}

const handlePurchaseOrderDownload = async () => {
  try {
    const response = await purchaseItemStore.downloadPurchaseItemDetailPDF(orderId, {
      delivery_address: formData.value.delivery_address,
      address: formData.value.address,
      phone: formData.value.phone,
      email: formData.value.email,
      account: formData.value.account,
      recipient: formData.value.recipient,
      bank: formData.value.bank,
      bank_address: formData.value.bank_address
    });

    // Log the response to check its structure
    console.log('Response:', response);

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    console.log('contentDisposition:', contentDisposition, 1111);

    if (!contentDisposition) {
      throw new Error('Content-Disposition header is missing');
    }

    const filenameMatch = contentDisposition.match(/filename\*?=['"]?UTF-8''([^;]+)['"]?/);
    if (!filenameMatch || filenameMatch.length <= 1) {
      throw new Error('Filename not found in Content-Disposition header');
    }

    const filename = decodeURIComponent(filenameMatch[1]);
    console.log('Original filename:', filename);

    // Ensure response.data is a Blob
    if (!(response.data instanceof Blob)) {
      throw new Error('Response is not a Blob');
    }

    const blob = response.data;

    // Create a URL for the Blob and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link); // Append to body to ensure it works in all browsers
    link.click();
    document.body.removeChild(link); // Clean up

    // Revoke the object URL
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('下载采购项目详情PDF错误:', error);
  }
};

const handleBeforeOpenPDFOutput = async () => {
  const response = await purchaseOrderStore.getPurchaseOrderDetail(orderId)
  let supplierId = response.data.supplier_id
  const supplierResponse = await supplyStore.getSupplierDetail(supplierId)
  console.log('supplierResponse:', supplierResponse)
  let supplyList = supplierResponse.suppliers 
  let supply = supplyList.find(item => item.id === supplierId)
  formData.value.address = supply.shipping_address || ''
  formData.value.phone = supply.contact_info || ''
  formData.value.email = supply.email||''
  formData.value.account = supply.payment_account||''
  formData.value.recipient = supply.payee||''
  formData.value.bank = supply.bank_name||''
  formData.value.bank_address = supply.bank_address||''
  formData.value.delivery_address = `${purchaseItemStore.delivery_address} ${orderId.slice(-4)}室 库存`;
}
</script>
<style scoped>
.toolbar-container {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}

.postage-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px; /* Optional: adds space between the input and button */
}
</style>
