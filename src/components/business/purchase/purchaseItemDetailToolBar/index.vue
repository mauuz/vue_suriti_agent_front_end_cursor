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
        提交审批
      </a-button>

      <a-button type="dashed" @click="handleSubmitApproval">
        <template #icon>
          <icon-send />
        </template>
        确认下单
      </a-button>
      
    </a-space>
  </div>
</template>

<script setup>
import { IconPlus, IconDelete, IconUpload, IconDownload, IconLaunch, IconSend } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { usePurchaseItemStore } from '@/stores/modules/purchase/purchaseItemStore'
import ExcelJS from 'exceljs'
import { useRoute } from 'vue-router'
import { ref } from 'vue';



const emit = defineEmits(['add-row', 'delete-rows', 'excel-add', 'excel-replace', 'refresh-data','submit-approval','order-confirm'])


// 获取路由实例
const route = useRoute()

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


</script>
<style scoped>
.toolbar-container {
  margin-bottom: 16px;
}
</style>
