<template>
  <div class="order-item-container">
    <div class="toolbar">
      <purchase-item-detail-tool-bar
      @add-row="handleAddRow"
      @delete-rows="handleDeleteRows"
      @excel-add="handleExcelAdd"
      @excel-replace="handleExcelReplace"
      @submit-approval="handleSubmitApproval"
      @order-confirm="handleOrderConfirm"
      @save-postage="handleSavePostage"
      />
    </div>
    <div class="purchase-item-detail-container">
        <div ref="tableContainer" class="table-container"></div>
    </div>
    <!-- Overview Section -->
    <div class="overview-section">
      <div class="overview-item">总共: <span> {{ overViewData.totalItems }}</span> 项</div>
      <div class="overview-item">总价: <span> {{ overViewData.totalPrice }}</span> 元</div>
      <div class="overview-item">含邮费总价: <span> {{ overViewData.totalPriceWithShipping }}</span> 元</div>
    </div>
  </div>
  <upload-image-dialog
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
      :purchase-item-id="currentPurchaseItemId"
      title="上传图片"
      @upload-success="handleUploadSuccess"
  />
  <a-modal
    v-model:visible="addModalVisible"
    title="添加采购项目"
    @before-ok="handleAddSubmit"
    @cancel="handleAddCancel"
    :width="800"
    :mask-closable="false"
    :close-on-esc="false"
  >
    <a-form 
      ref="addFormRef" 
      :model="addFormData" 
      :rules="rules"
      :style="{ width: '100%' }"
      :label-col-props="{ span: 4 }"
      :wrapper-col-props="{ span: 19 }"
    >
      <a-form-item field="sequence" label="序号" :rules="[{ required: true, message: '请输入序号' }]">
        <a-input-number
          v-model="addFormData.sequence"
          placeholder="请输入序号"
          :min="0"
          :precision="0"
          :step="1"
        />
      </a-form-item>

      <a-form-item field="product_code" label="产品编码" :rules="[{ required: true, message: '请输入产品编码' }]">
        <a-input v-model="addFormData.product_code" placeholder="请输入产品编码" />
      </a-form-item>
      
      <a-form-item field="product_name_zh" label="产品名称(中)" :rules="[{ required: true, message: '请输入中文产品名称' }]">
        <a-textarea 
          v-model="addFormData.product_name_zh" 
          placeholder="请输入中文产品名称"
          :auto-size="{ minRows: 2, maxRows: 3 }"
        />
      </a-form-item>

      <a-form-item 
        field="product_name_en" 
        label="产品名称(英)" 
        :rules="[{ required: true, message: '请输入英文产品名称' }]"
      >
        <a-textarea 
          v-model="addFormData.product_name_en" 
          placeholder="请输入英文产品名称"
          :auto-size="{ minRows: 2, maxRows: 3 }"
        />
      </a-form-item>

      <a-form-item field="specification" label="规格" :rules="[{ required: true, message: '请输入规格' }]">
        <a-input v-model="addFormData.specification" placeholder="请输入规格" />
      </a-form-item>

      <a-form-item field="quantity" label="数量" :rules="[{ required: true, message: '请输入数量' }]">
        <a-input-number 
          v-model="addFormData.quantity" 
          placeholder="请输入数量" 
          :min="0" 
          :precision="0"
          :step="1"
        />
      </a-form-item>

      <a-form-item field="unit" label="单位" :rules="[{ required: true, message: '请输入单位' }]">
        <a-input v-model="addFormData.unit" placeholder="请输入单位" />
      </a-form-item>

      <a-form-item field="unit_price" label="单价" :rules="[{ required: true, message: '请输入单价' }]">
        <a-input-number 
          v-model="addFormData.unit_price" 
          placeholder="请输入单价" 
          :min="0" 
          :precision="8"
          :step="0.00000001"
        />
      </a-form-item>
      
      <a-form-item field="remark" label="备注">
        <a-textarea v-model="addFormData.remark" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 添加隐藏的文件输入框 -->
  <input
    type="file"
    ref="excelAddInputRef"
    accept=".xlsx,.xls"
    style="display: none"
    @change="handleExcelAddFileChange"
  />
  <input
    type="file"
    ref="excelReplaceInputRef"
    accept=".xlsx,.xls"
    style="display: none"
    @change="handleExcelReplaceFileChange"
  />

  <!-- Excel预览表格组件 -->
  <excel-preview-table
    v-model:visible="previewModalVisible"
    :data="previewData"
    @ok="handlePreviewOk"
    @cancel="handlePreviewCancel"
    @refresh-data="fetchOrderDetail"
  />
  
  <approval-submit-table
    v-model:visible="approvalModalVisible"
    :data = "approvalData"
    @submit="handleApprovalOk"
    @cancel="handleApprovalCancel"
  />


  <ConfirmOrderTable
    v-model:visible="confirmOrderModalVisible"
    :data="confirmOrderData"
    @submit="handleConfirmOrderOk"
    @cancel="handleConfirmOrderCancel"
  />


</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, h,computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { usePurchaseItemStore, useSupplyStore,useApprovalStore,useStorageStore,usePurchaseOrderStore} from '@/stores';
import * as VTable from '@visactor/vtable';
import { Message, Modal, Image, ImagePreviewGroup } from '@arco-design/web-vue';
import UploadImageDialog from '@/components/business/purchase/purchaseItemUploadPic/index.vue'
import PurchaseItemDetailToolBar from '@/components/business/purchase/purchaseItemDetailToolBar/index.vue'
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import ExcelPreviewTable from '@/components/business/purchase/excelPreviewTable/index.vue';
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
import ApprovalSubmitTable from '@/components/business/approval/approvalSubmitTable/index.vue';
import ConfirmOrderTable from '@/components/business/purchase/purchaseConfirmOrder/index.vue';


const approvalStore = useApprovalStore();
const route = useRoute();
const purchaseOrderItemStore = usePurchaseItemStore();
const purchaseOrderStore = usePurchaseOrderStore();
const tableContainer = ref(null);
let tableInstance = null;
const dialogVisible = ref(false)
const currentPurchaseItemId = ref('')
const addModalVisible = ref(false)
const addFormRef = ref(null)
const addFormData = ref({
  sequence: 0,
  product_code: '',
  product_name_zh: '',
  product_name_en: '',
  specification: '',
  quantity: 0,
  unit: '',
  unit_price: 0,
  supplier: '',
  remark: ''
})
const confirmOrderModalVisible = ref(false)
const confirmOrderData = ref({
  orderedItems: [], // 存放已下单的列表
  unOrderedItems: [] // 存
})


const supplierOptions = ref([])
const excelAddInputRef = ref(null);
const excelReplaceInputRef = ref(null);
const approvalData = ref([])
const shippingFee = computed({
  get: () => {
    return purchaseOrderStore.getshippingFeeFromPurchaseOrderID(route.params.id)
  },
  set: (value) => {
    purchaseOrderStore.updateShippingFee(route.params.id, value);
  }
});

const overViewData = ref({
  totalItems: 0,
  totalPrice: 0,
  totalPriceWithShipping:0
});
const showUploadDialog = (purchaseItemId) => {
  currentPurchaseItemId.value = purchaseItemId
  dialogVisible.value = true
}

// 触发文件选择
const handleExcelAdd = () => {
  excelAddInputRef.value?.click();
};

const handleExcelReplace = () => {
  excelReplaceInputRef.value?.click();
};

// 处理文件选择变化 - 新增导入
const handleExcelAddFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const binaryString = e.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // 将工作表转换为数组
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // 获取表头
        const headers = sheetData[0];
        const data = [];
        let sequence = 1;
        
        // 定义表头映射关系
        const headerMapping = {
          '产品代码': 'product_code',
          '产品描述': 'product_name_en',
          '规格': 'specification',
          '中文翻译': 'product_name_zh',
          '数量': 'quantity',
          '单位': 'unit',
          '成本价': 'unit_price',
          '备注': 'remark'  // 添加备注字段
        };

        // 验证表头是否包含必要字段
        const requiredHeaders = ['产品代码', '产品描述', '规格', '中文翻译', '数量', '单位', '成本价'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        
        if (missingHeaders.length > 0) {
          Message.error(`Excel 缺少必要的列: ${missingHeaders.join(', ')}`);
          return;
        }

        // 处理数据行（跳过表头）
        for (let i = 1; i < sheetData.length; i++) {
          const row = sheetData[i];
          if (!row || row.length === 0) continue; // 跳过空行
          
          const rowData = {
            key: sequence.toString(),
            sequence: sequence
          };

          // 遍历每一列
          headers.forEach((header, index) => {
            const mappedField = headerMapping[header];
            if (mappedField) {
              let value = row[index];
              
              // 确保值不是 undefined
              if (value !== undefined) {
                // 对数字类型字段进行转换
                if (mappedField === 'quantity') {
                  value = parseInt(value) || 0;
                } else if (mappedField === 'unit_price') {
                  value = parseFloat(value).toFixed(8) || 0;
                } else {
                  value = String(value).trim();
                }
                
                rowData[mappedField] = value;
              }
            }
          });

          // 计算总价
          rowData.total_price = Number(rowData.quantity * rowData.unit_price).toFixed(8);

          // 检查必填字段是否都有值
          const requiredFields = ['product_code', 'product_name_en', 'specification', 
                                'product_name_zh', 'quantity', 'unit', 'unit_price'];
          const isValid = requiredFields.every(field => {
            const value = rowData[field];
            return value !== undefined && value !== null && value !== '';
          });

          // 只添加有效的数据行
          if (isValid) {
            data.push(rowData);
            sequence++;
          }
        }

        if (data.length === 0) {
          Message.error('没有找到有效数据');
          return;
        }

        // 更新预览数据并显示预览表格
        previewData.value = data;
        nextTick(() => {
          previewModalVisible.value = true;
        });

      } catch (innerError) {
        console.error('数据处理错误:', innerError);
        Message.error('数据处理失败：' + (innerError.message || '未知错误'));
      }
    };

    reader.onerror = (error) => {
      console.error('文件读取错误:', error);
      Message.error('文件读取失败');
    };

    // 以二进制方式读取文件
    reader.readAsBinaryString(file);

  } catch (error) {
    console.error('Excel处理错误:', error);
    Message.error('Excel处理失败：' + (error.message || '未知错误'));
  } finally {
    event.target.value = '';
  }
};

// submit approval
const handleApprovalOk = async (params) => {
  try {
    // Extract selected keys and reason from params
    const { selectedKeys, reason } = params;

    // Construct the payload
    const payload = {
      purchase_item_id_list: selectedKeys,
      applicant_reason: reason
    };

    // Submit the approval request
    await approvalStore.submitBatchApproval(payload);

    // Provide success feedback to the user
    Message.success('审批提交成功');
    await fetchOrderDetail();
  } catch (error) {
    console.error('审批提交失败:', error);
    // Provide error feedback to the user
    Message.error('审批提交失败：' + (error.message || '未知错误'));
  }
};

const handleApprovalCancel = async()=>{
  
}

// 处理文件选择变化 - 覆盖导入
const handleExcelReplaceFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const worksheet = workbook.worksheets[0]; // 获取第一个工作表
    
    console.log('Excel内容:', worksheet);
    // 这里先简单打印一下读取到的内容
    worksheet.eachRow((row, rowNumber) => {
      console.log(`Row ${rowNumber}:`, row.values);
    });

  } catch (error) {
    console.error('Excel处理错误:', error);
    Message.error('Excel处理失败：' + (error.message || '未知错误'));
  } finally {
    // 清空文件输入框，允许重复选择同一文件
    event.target.value = '';
  }
};

const handleUploadSuccess = (files) => {
  console.log('上传的文件列表：', files)
  console.log('当前采购项目ID：', currentPurchaseItemId.value)
  // 这里可以添加上传成功后的刷新逻辑
}
const handleConfirmOrderOk = async(params)=>{
    
  if(params.action === 'confirm'){
    console.log('确认下单')
    console.log(params.selectedKeys)
    for(let i = 0; i < params.selectedKeys.length; i++){
      await purchaseOrderItemStore.updatePurchaseItemOrderStatus(params.selectedKeys[i], 1)
    }
  
    //await purchaseOrderItemStore.updatePurchaseItemOrderStatus(currentPurchaseItemId.value, 1)
  }else{
    console.log('取消下单')
    console.log(params.selectedKeys)
    for(let i = 0; i < params.selectedKeys.length; i++){
      await purchaseOrderItemStore.updatePurchaseItemOrderStatus(params.selectedKeys[i], 0)
    }
    //await purchaseOrderItemStore.updatePurchaseItemOrderStatus(currentPurchaseItemId.value, 0)
  }
  Message.success('操作成功')
  await fetchOrderDetail()
}

const handleConfirmOrderCancel = async()=>{
  console.log('取消')
}

const handleOrderConfirm = async() => {
  //下单
  //过滤 下单状态是否是未下单
  try {
    const orderId = route.params.id;
    const response = await purchaseOrderItemStore.getPurchaseItems(orderId);
    if (response.code === 200 && Array.isArray(response.data)) {
      // Filter items where approval_status.status is not equal to 1
      confirmOrderData.value.unOrderedItems = response.data.filter(item => 
        item.order_status === 0 && item.approval_status.status === 1
      );

      confirmOrderData.value.orderedItems = response.data.filter(item => 
        item.order_status === 1 && item.approval_status.status === 1
      );
      
      // Open the approval modal if there are items to approve
      // if (confirmOrderData.value.orderedItems.length > 0) {
      confirmOrderModalVisible.value = true
      // } else {
      //   Message.info('没有可下单的项目');
      // }
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    Message.error('获取下单数据失败');
    console.error('获取下单数据失败:', error);
  }
}


// vtable
// 解构事件类型
const { DBLCLICK_CELL,ICON_CLICK} = VTable.ListTable.EVENT_TYPE;
const inputEditor = new InputEditor();
VTable.register.editor('input-editor', inputEditor);
VTable.register.icon('view', {
  type: 'svg',
  svg: '<svg t="1735723680994" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6321" width="32" height="32"><path d="M928.842245 512.091074c0-5.006014-0.846274-9.193383-1.086751-9.691733-0.182149-2.480494-1.028423-7.001461-1.815345-9.374508-0.210801-0.590448-0.484024-1.209548-0.724501-1.799996-0.424672-1.360997-0.876973-2.691295-1.390673-3.749394-76.871785-168.137395-242.376213-281.144168-411.782507-281.144168-169.375595 0-334.865697 112.902396-411.388535 280.130072-0.921999 1.815345-1.572822 3.553942-1.981121 5.066389-0.181125 0.49835-0.39295 0.967024-0.558725 1.406023-1.512447 4.430916-1.542122 7.514137-1.421372 6.712889-0.710175 3.251044-1.360997 9.722432-1.360997 9.722432-0.181125 1.949398-0.181125 3.50687 0.030699 5.442966 0 0 0.649799 5.65479 0.968048 6.80294 0.090051 1.602498 0.483001 3.931542 0.951675 6.048763l-0.030699 0c0.408299 1.814322 0.968048 3.568269 1.738597 5.291516 0.393973 1.330298 0.862647 2.570545 1.270946 3.507894 76.976162 168.166047 242.436588 281.20352 411.781484 281.20352 169.436994 0 334.941422-112.945375 410.936233-279.328823 1.177825-2.177596 1.935072-4.233418 2.448772-6.018064 0.2415-0.543376 0.454348-1.027399 0.604774-1.511423 1.331321-3.872191 1.602498-7.227612 1.481747-7.227612l-0.028653 0.029676C928.027693 520.921183 928.842245 516.89959 928.842245 512.091074zM872.717993 514.146896c-0.029676 0.121773-0.091074 0.272199-0.151449 0.393973-0.090051 0.36225-0.240477 0.785899-0.332575 1.209548-68.403926 147.420561-212.830293 246.337431-360.191502 246.337431-146.997935 0-291.168476-98.642624-360.252901-246.578931-0.166799-0.5137-0.287549-0.998747-0.468674-1.481747-0.030699-0.484024-0.12075-0.876973-0.150426-1.150196-0.060375-0.300852-0.12075-0.724501-0.166799-1.088798l0-0.3776c0.166799-0.620124 0.286526-1.239224 0.347924-1.919722 0.12075-0.36225 0.211824-0.710175 0.347924-1.103124C220.132094 360.89042 364.680235 261.928524 512.041444 261.928524c147.420561 0 291.940049 99.051947 360.161826 246.322082 0.060375 0.287549 0.121773 0.530073 0.212848 0.726547 0.060375 0.2415 0.119727 0.484024 0.240477 0.740874 0.151449 1.104147 0.272199 2.192945 0.423649 2.736321C872.899118 513.028423 872.809067 513.572822 872.717993 514.146896z" fill="#272536" p-id="6322"></path><path d="M512.041444 373.060601c-76.598562 0-138.954749 62.325487-138.954749 138.939399 0 76.598562 62.356187 138.954749 138.954749 138.954749 76.598562 0 138.954749-62.356187 138.954749-138.954749C650.996193 435.386088 588.640006 373.060601 512.041444 373.060601zM512.041444 595.372849c-45.935192 0-83.371826-37.406958-83.371826-83.371826 0-45.950542 37.436634-83.356476 83.371826-83.356476 45.964868 0 83.373873 37.406958 83.373873 83.356476C595.414293 557.965891 558.006312 595.372849 512.041444 595.372849z" fill="#272536" p-id="6323"></path></svg>',
  width: 30,
  height: 30,
  name: 'view',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 20,
  cursor: 'pointer',
});
// 注册上传图标
VTable.register.icon('upload', {
  type: 'svg',
  svg: '<svg t="1735723643329" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5187" width="48" height="48"><path d="M481.749333 353.792c16.682667-16.64 43.690667-16.64 60.373334 0l120.917333 120.832 3.541333 4.010667a42.666667 42.666667 0 0 1-63.872 56.32L554.666667 486.954667V896a42.666667 42.666667 0 0 1-85.333334 0v-409.173333l-48.170666 48.128a42.666667 42.666667 0 0 1-60.330667 0l-3.541333-4.010667a42.666667 42.666667 0 0 1 3.541333-56.32zM512 85.333333c122.538667 0 227.84 73.813333 273.92 179.370667A213.333333 213.333333 0 0 1 725.333333 682.666667a42.666667 42.666667 0 0 1-4.992-85.034667L725.333333 597.333333a128 128 0 0 0 36.394667-250.794666l-38.144-11.264-15.914667-36.437334a213.376 213.376 0 0 0-407.296 58.026667l-7.381333 58.368-57.173333 13.824A85.418667 85.418667 0 0 0 256 597.333333h42.666667a42.666667 42.666667 0 0 1 0 85.333334H256a170.666667 170.666667 0 0 1-40.277333-336.554667A298.709333 298.709333 0 0 1 512 85.333333z" fill="#333333" p-id="5188"></path></svg>',
  width: 30,
  height: 30,
  name: 'upload',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 20,
  cursor: 'pointer',
});


// 定义表格列配置
const columns = [
  {
    field: 'sequence',
    title: '序号',
    minWidth: 90,
    width: 90,
    sort: (v1, v2, order) => {
        // 使用自定义排序逻辑
        if (order === 'desc') {
          return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
    },
    editor: 'input-editor'
  },
  {
    field: 'product_code',
    title: '产品编码',
    minWidth: 100,
    width: 100,
    editor: 'input-editor'
  },
  {
    field: 'product_name_zh',
    title: '产品名称(中)',
    minWidth: 100,
    width: 100,
    editor: 'input-editor'
  },
  {
    field: 'product_name_en',
    title: '产品名称(英)',
    minWidth: 150,
    width: 150,
    editor: 'input-editor'
  },
  {
    field: 'specification',
    title: '规格',
    minWidth: 150,
    width: 150,
    editor: 'input-editor',
    // aggregation: {
    //     aggregationType: VTable.TYPES.AggregationType.SUM,
    //     formatFun(value) {
    //         return "共计:";
    //     }
    // }
  },
  {
    field: 'quantity',
    title: '数量',
    minWidth: 100,
    width: 100,
    editor: 'input-editor',
    // aggregation: {
    //     aggregationType: VTable.TYPES.AggregationType.SUM,
    //     formatFun(value) {
    //         return value ? `${Number(value).toFixed(8)}` : '';
    //     }
    // }
  },
  {
    field: 'unit',
    title: '单位',
    minWidth: 80,
    width: 80,
    editor: 'input-editor'
  },
  {
    field: 'unit_price',
    title: '单价',
    minWidth: 120,
    width: 120,
    editor: 'input-editor',
    // aggregation: {
    //     aggregationType: VTable.TYPES.AggregationType.SUM,
    //     formatFun(value) {
    //         return "共计:";
    //     }
    // }
  },
  {
    field: 'total_price',
    title: '总价',
    minWidth: 120,
    width: 120,
    // fieldFormat(data, col, row, table) {
    //   return row - 1;
    // },
    editor: 'input-editor',
    // aggregation: {
    //     aggregationType: VTable.TYPES.AggregationType.SUM,
    //     formatFun(value) {
    //         return value ? `${Number(value).toFixed(8)}`: '';
    //     }
    // }
  },
  {
    field: 'pics',
    title: '产品图片',
    minWidth: 112,
    width: 112,
    headerStyle: {
      textAlign: 'center',
      fontWeight: 'bold',
      backgroundColor: '#f2f3f5'
    },
    icon:['upload', 'view'],
    // icon: ({ row, table }) => {
    //   // 检查是否是最后一行
    //   const isLastRow = row === table.rowCount-1;
    //   // 如果是最后一行返回空数组，否则返回原有的图标
    //   return isLastRow ? [] : ['upload', 'view'];
    // },
    cellStyle: () => ({
      textAlign: 'center'
    }),
  },
  {
    field: 'creator',
    title: '创建人',
    minWidth: 100,
    width: 100,
  },
  {
    field: 'approval_status',
    title: '审批状态',
    minWidth: 100,
    width: 100,
    style: ({dataValue}) => {
      const colorMap = {
        '未提交': '#86909c',
        '正在审核': '#4080ff',
        '通过': '#4cd263',  
        '驳回': '#f53f3f'   
      };
      return {
        color: colorMap[dataValue]
      };
    }
  },
  {
      field: 'approval_comment',
      title: '审批意见',
      minWidth: 150,
      width: 150,
  
  },
  {
    field: 'order_status',
    title: '下单状态',
    minWidth: 100,
    width: 100,
    style: ({ dataValue }) => {
      const colorMap = {
        "未下单": '#f7ba1e',  // orange
        "已下单": '#00b42a',  // green
      };
      return {
        color: colorMap[dataValue] || '#86909c'
      };
    }
  },
  {
    field: 'remark',
    title: '备注',
    minWidth: 200,
    width: 200,
    editor: 'input-editor'
  },
  {
    field: 'purchaser',
    title: '采购员',
    minWidth: 100,
    width: 100,
  },
  {
    field: 'purchase_item_id',
    title: '采购项目编号',
    minWidth: 160,
    width: 160,
  },
  {
    field: 'created_at',
    title: '创建时间',
    minWidth: 180,
    width: 180,
  },
  {
    field: 'order_time',
    title: '下单时间',
    minWidth: 180,
    width: 180,
  }
];

// 初始化表格
const initTable = (data) => {
  if (tableInstance) {
    tableInstance.dispose();
  }

  tableInstance = new VTable.ListTable({
    container: tableContainer.value,
    columns,
    records: data.map(({ pics, ...rest }) => rest),
    showFrozenIcon: true,
    defaultHeaderRowHeight: 35,
    defaultRowHeight: 30,
    keyboardOptions: {
    copySelected: true
  },
    hover: {
      highlightMode: 'row'
    },
    theme: {
      defaultStyle: {
        fontFamily: 'Arial',
        fontSize: 17,
        lineHeight: 1.5,
        color: '#1d2129',
        borderColor: '#e5e6eb'
      },
      headerStyle: {
        backgroundColor: '#f2f3f5',
        fontWeight: 'bold',
      },
      bottomFrozenStyle: {
      bgColor: '#f2f3f5',
      borderLineWidth: [6, 0, 1, 0],
    },
      bodyStyle: {
        hover: {
          backgroundColor: '#f2f3f5',
        },
        cell: {
          padding: [8, 12]
        }
      }
    },
    // bottomFrozenRowCount: 1,
    fieldFormat(record){
      console.log('record:', record,123123);
    },
    checkboxColumn: {
      checkAll: true,  // 是否显示全选框
      width: 40,  // 复选框列宽度
    },
    // 添加选择变化的事件监听
    onSelectedChange: (selectedRows) => {
      console.log('Selected rows:', selectedRows);
      // 这里可以处理选中行变化的逻辑
    }
  });

  // 监听单元格值变化,并同步
  tableInstance.on('change_cell_value', async(args) => {
    const purchaseItemIdIndex = columns.findIndex(col => col.field === 'purchase_item_id');
    // 获取当前行的采购项目ID
    const purchaseItemId = tableInstance.getCellValue(purchaseItemIdIndex, args.row);
    const updatedItemName = columns[args.col].field;
    
    // 获取当前行的所有数据
    const currentRowData = {};
    columns.forEach(col => {
      currentRowData[col.field] = tableInstance.getCellValue(
        columns.findIndex(c => c.field === col.field),
        args.row
      );
    });
    
    // 计算新的值
    let quantity = parseInt(currentRowData.quantity);
    let unitPrice = Number(currentRowData.unit_price);
    let totalPrice = Number(currentRowData.total_price);

    if (updatedItemName === 'quantity') {
      quantity = parseInt(args.changedValue) || 0;
      totalPrice = quantity * unitPrice;
    } else if (updatedItemName === 'unit_price') {
      unitPrice = Number(args.changedValue);
      totalPrice = quantity * unitPrice;
    } else if (updatedItemName === 'total_price') {
      totalPrice = Number(args.changedValue);
      if (quantity !== 0) {
        unitPrice = totalPrice / quantity;
      }
    }

    // 更新表格显示 - 保留原有数据,只更新计算相关的字段
    tableInstance.updateRecords(
      [{
        ...currentRowData,
        quantity: quantity,
        unit_price: unitPrice.toFixed(8),
        total_price: totalPrice.toFixed(8)
      }],
      [args.row - 1]
    );

    // 更新后端数据
    try {
      await purchaseOrderItemStore.updatePurchaseItem(purchaseItemId, {
        [updatedItemName]: args.changedValue,
        quantity: quantity,
        unit_price: unitPrice.toFixed(8),
        total_price: totalPrice.toFixed(8)
      });
      Message.success('更新成功');
      await fetchOrderDetail();
    } catch (error) {
      console.error('更新失败:', error);
      Message.error('更新失败：' + (error.message || '未知错误'));
      await fetchOrderDetail();
    }
  });
  
  // 监听产品图片列的双击事件
  tableInstance.on(ICON_CLICK, async(args) => {
    console.log('Icon click args:', args);
    const purchaseItemIdIndex = columns.findIndex(col => col.field === 'purchase_item_id'); 
    const purchaseItemId = tableInstance.getCellValue(purchaseItemIdIndex, args.row);
    const purchaseItemProductNameIndex = columns.findIndex(col => col.field === 'product_name_zh'); 
    const purchaseItemProductName = tableInstance.getCellValue(purchaseItemProductNameIndex, args.row);
    const purchaseItemSpecificationIndex = columns.findIndex(col => col.field === 'specification'); 
    const purchaseItemSpecification = tableInstance.getCellValue(purchaseItemSpecificationIndex, args.row);

    //查看图片
    if (args.name === 'view') {
      const response = await purchaseOrderItemStore.getAllPurchaseItemPic(purchaseItemId);
      console.log('response:', response);
      if(response.code === 200 && response.data.pic_url.length > 0){
          Modal.info({
              title:`${purchaseItemProductName} : ${purchaseItemSpecification}`,
              width: '50%',
              modalClass: 'preview-modal',
              escToClose: true,
              maskClosable: true,
              content: () => h(ImagePreviewGroup, {}, () => 
                h('div', {
                  style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '20px',
                    justifyContent: 'center'
                  }
                }, response.data.pic_url.map(url => 
                  h(Image, {
                    src: url,
                    width: 200,
                    height: 200,
                    style: {
                      objectFit: 'contain',
                      border: '1px solid #e5e6eb',
                      borderRadius: '4px',
                      padding: '4px'
                    }
                  })
                ))
              )
          });
      }else {
        Message.info('该采购项目没有图片');
      }
      // if (Array.isArray(cellValue) && cellValue.length > 0) {
      
      // }
    }

    if(args.name === 'upload'){
      // const purchaseItemIdIndex = columns.findIndex(col => col.field === 'purchase_item_id'); 
      // const purchaseItemId = tableInstance.getCellValue(purchaseItemIdIndex, args.row);
      console.log('purchaseItemId:', purchaseItemId);
      showUploadDialog(purchaseItemId);
    }
  });

  tableInstance.on(DBLCLICK_CELL, (args) => {
    if (args.title === '产品图片') {
      console.log('Double clicked pics cell:', args);
    }
  });
};

// 获取订单详情数据
const fetchOrderDetail = async () => {
  try {
    const orderId = route.params.id;
    const response = await purchaseOrderItemStore.getPurchaseItems(orderId);
    
    console.log('API Response:', response);

    if (response.code === 200 && Array.isArray(response.data)) {
      // 确保数据是数组格式
      const formattedData = response.data.map(item => ({
        ...item,
        unit_price: Number(item.unit_price).toFixed(8),
        total_price: Number(item.total_price).toFixed(8),
        order_time: item.order_time || '-',
        reviewer: item.reviewer || '-',
        purchaser: item.purchaser || '-',
        order_status: item.order_status === 1 ? '已下单' : '未下单',  // 直接处理状态显示
        approval_status: item.approval_status.status === null ? '未提交' : 
              item.approval_status.status === 0 ? '正在审核' :
              item.approval_status.status === 1 ? '通过' :
              item.approval_status.status === 2 ? '驳回' : '未知状态',
        approval_comment: item.approval_status.approval_comment || '-',
      }));

      console.log('Formatted Data:', formattedData);
      // 确保DOM元素已经准备好
      nextTick(() => {
        initTable(formattedData);
        updateTotalPrice();
      });
      // 更新总价
      //updateTotalPrice();
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    Message.error('获取订单详情失败');
    console.error('获取订单详情失败:', error);
  }
};

function getPurchaseItemId(row){
  const purchaseItemIdIndex = columns.findIndex(col => col.field === 'purchase_item_id'); 
  const purchaseItemId = tableInstance.getCellValue(purchaseItemIdIndex, row);
  return purchaseItemId
}

// 确保在组件挂载后DOM元素已经准备好
onMounted(async() => {
  nextTick(async () => {
    await fetchOrderDetail();
  });
});

// 清理表格实例
onUnmounted(() => {
  if (tableInstance) {
    tableInstance.dispose();
  }
});

const handleAddRow = () => {
  addFormData.value.sequence = nextSequence.value;
  addModalVisible.value = true
}

const handleAddSubmit = async () => {
  if (addFormRef.value) {
    try {
      const valid = await addFormRef.value.validate()
      if (valid) {
        Message.error('请填写完整的表单信息')
        return false
      }

      // 计算总价
      const total_price = addFormData.value.quantity * addFormData.value.unit_price

      // 构建基础提交数据
      const submitData = {
        purchase_order_id: route.params.id,
        sequence: addFormData.value.sequence,
        product_code: addFormData.value.product_code,
        product_name_zh: addFormData.value.product_name_zh,
        product_name_en: addFormData.value.product_name_en,
        specification: addFormData.value.specification,
        quantity: addFormData.value.quantity,
        unit: addFormData.value.unit,
        unit_price: addFormData.value.unit_price,
        total_price: total_price,
      }

      // 如果 remark 不为空，才添加到提交数据中
      if (addFormData.value.remark?.trim()) {
        submitData.remark = addFormData.value.remark
      }

      // API调用
      const response = await purchaseOrderItemStore.createPurchaseItem(submitData);
      console.log('API Response:', response);

      if (response.code === 200) {
        // 构建新记录
        const newRecord = {
          ...response.data,
          unit_price: Number(response.data.unit_price).toFixed(8),
          total_price: Number(response.data.total_price).toFixed(8)
        }
        
        // 添加到表格
        //tableInstance.addRecord(newRecord, 0)
        await fetchOrderDetail()
        addModalVisible.value = false
        addFormRef.value.resetFields()
        Message.success('添加成功')
        return true
      } else {
        Message.error(response.message || '添加失败')
        return false
      }
    } catch (error) {
      console.error('添加失败:', error)
      Message.error(error.response?.data?.message || '添加失败')
      return false
    }
  }
  return false
}

const handleAddCancel = () => {
  addModalVisible.value = false
  supplierOptions.value = []
  addFormRef.value?.resetFields()
}

const handleDeleteRows = () => {
  // 获取选中的单元格信息
  const selectedCellInfos = tableInstance.getSelectedCellInfos()
  // 提取唯一的行索引到新数组
  const selectedRowIndexes = [...new Set(
    selectedCellInfos
      .map(cell => cell[0].row - 1)
      .filter(index => index >= 0)
  )]
  console.log('selectedRowIndexes:', selectedRowIndexes)
  if (!selectedCellInfos || selectedRowIndexes.length === 0) {
    Message.warning('请先选择要删除的行')
    return
  }

  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRowIndexes.length} 行数据吗？`,
    okText: '确认',
    cancelText: '取消',
    okButtonProps: {
      status: 'danger'
    },
    onOk: async () => {
      try {
        // 收集所有要删除的 purchaseItemId
        const purchaseItemIds = selectedRowIndexes.map(row => {
          const purchaseItemId = getPurchaseItemId(row + 1)
          return purchaseItemId
        }).filter(id => id) // 过滤掉可能的空值

        if (purchaseItemIds.length === 0) {
          Message.warning('没有找到有效的采购项目ID')
          return
        }

        // 使用 Promise.all 批量删除
        await Promise.all(
          purchaseItemIds.map(id => 
            purchaseOrderItemStore.deletePurchaseItem(id)
          )
        )

        // 所有删除请求都成功后，删除表格中的行
        //tableInstance.deleteRecords(selectedRowIndexes)
        Message.success(`成功删除 ${selectedRowIndexes.length} 行数据`)
        await fetchOrderDetail()
      } catch (error) {
        console.error('删除失败:', error)
        Message.error('删除失败：' + (error.message || '未知错误'))
      }
    }
  })
}

const rules = {
  product_code: [
    { required: true, message: '请输入产品编码' }
  ],
  product_name_zh: [
    { required: true, message: '请输入中文产品名称' }
  ],
  product_name_en: [
    { required: true, message: '请输入英文产品名称' }
  ],
  specification: [
    { required: true, message: '请输入规格' }
  ],
  quantity: [
    { required: true, message: '请输入数量' },
    { type: 'number', min: 0, message: '数量必须大于0' }
  ],
  unit: [
    { required: true, message: '请输入单位' }
  ],
  unit_price: [
    { required: true, message: '请输入单价' },
    { type: 'number', min: 0, message: '单价必须大于0' }
  ],
  supplier: [
    { required: true, message: '请选择供应商' }
  ]
}

const nextSequence = computed(() => {
  return tableInstance.rowCount
});

// 预览相关的响应式变量
const previewModalVisible = ref(false);
const previewData = ref([]);

// 处理预览确认
const handlePreviewOk = async () => {
  console.log('handlePreviewOk');
};

// 处理预览取消
const handlePreviewCancel = () => {
  previewModalVisible.value = false;
  previewData.value = [];
};

const approvalModalVisible = ref(false);
const approvalForm = ref({
  reason: ''
});


// 打开审批弹窗
const handleSubmitApproval = async () => {
  try {
    const orderId = route.params.id;
    const response = await purchaseOrderItemStore.getPurchaseItems(orderId);

    if (response.code === 200 && Array.isArray(response.data)) {
      // Filter items where approval_status.status is not equal to 1
      approvalData.value = response.data.filter(item => 
        item.approval_status.status === null || item.approval_status.status === 2
      );
      
      // Open the approval modal if there are items to approve
      if (approvalData.value.length > 0) {
        approvalModalVisible.value = true;
      } else {
        Message.info('没有可提交审批的项目');
      }
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    Message.error('获取审批数据失败');
    console.error('获取审批数据失败:', error);
  }
};

// 提交审批
const submitApproval = () => {
  approvalModalVisible.value = false;
  approvalForm.value.reason = '';
};

const handleSavePostage = async (postage) => {
  // console.log('邮费已保存:', postage);
  shippingFee.value = postage
  const res = await purchaseOrderStore.updatePurchaseOrder({
    orderId: route.params.id,
    shipping_fee: shippingFee.value
  })
  if(res.code === 200){
    Message.success('邮费已保存')
    updateTotalPrice()
  }else{
    Message.error('邮费保存失败')
  }
  //postage.value = postage
};

const updateTotalPrice = async () => {
  await purchaseOrderStore.getShippingFee(route.params.id);
  const records = tableInstance.records;
  console.log('records:', records);

  // Calculate total items
  overViewData.value.totalItems = records.length;

  // Calculate total price
  overViewData.value.totalPrice = records.reduce((sum, record) => {
    return sum + parseFloat(record.total_price || 0);
  }, 0).toFixed(2);

  // Calculate total price with shipping
  overViewData.value.totalPriceWithShipping = (
    parseFloat(overViewData.value.totalPrice) + parseFloat(shippingFee.value)
  ).toFixed(2);

  console.log('overViewData:', overViewData.value);
};

// // Computed properties for overview
// const totalItems = computed(() => tableInstance.records.length);

// // const totalPrice = computed(() => {
// //   return tableInstance.records.reduce((sum, record) => {
// //     return sum + parseFloat(record.total_price || 0);
// //   }, 0).toFixed(8);
// // });

// // const totalPriceWithShipping = computed(() => {
// //   return (parseFloat(totalPrice.value) + parseFloat(shippingFee.value)).toFixed(8);
// // });
</script>
<style scoped>

.order-item-container {
  padding: 16px;
}

.toolbar {
  margin-bottom: 16px;
}

.purchase-item-detail-container {
  padding: 20px;
}

.general-card {
  margin-bottom: 20px;
}

.table-container {
  /* width: 100%;*/
  height: 660px; 
  /* overflow: auto; */
  -webkit-overflow-scrolling: touch;
}

:deep(.vpc-table) {
  overscroll-behavior: contain;
}

.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.total-count {
  width: 100%;
  margin-top: 16px;
}

:deep(.arco-table) {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.approval-preview {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.full-width-table {
  width: 100%;
}

.approval-reason {
  margin-top: 16px;
}

.overview-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #e5e6eb;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 18px;
  line-height: 1.5;
}

.overview-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-weight: bold;
  color: #333;
}

.overview-item span {
  font-size: 18px;
  color: #165dff;
}
</style>

