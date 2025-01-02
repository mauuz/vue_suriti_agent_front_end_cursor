<template>
  <div class="order-item-container">
    <div class="toolbar">
      <purchase-item-detail-tool-bar
      @add-row="handleAddRow"
      @delete-rows="handleDeleteRows"
      />
    </div>
    <div class="purchase-item-detail-container">
        <div ref="tableContainer" class="table-container"></div>
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

      <a-form-item 
        field="supplier" 
        label="供应商" 
        :rules="[{ required: true, message: '请选择供应商' }]"
      >
        <a-select
          v-model="addFormData.supplier"
          placeholder="请选择供应商"
          allow-search
          :loading="supplyStore.loading"
          :filter-option="true"
          :model-value="addFormData.supplier"
          @search="handleSupplierSearch"
        >
          <a-option
            v-for="option in supplierOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            {{ option.label }}
          </a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="remark" label="备注">
        <a-textarea v-model="addFormData.remark" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, h,computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePurchaseItemStore, useSupplyStore } from '@/stores';
import * as VTable from '@visactor/vtable';
import { Message, Modal, Image, ImagePreviewGroup } from '@arco-design/web-vue';
import UploadImageDialog from '@/components/business/purchase/purchaseItemUploadPic/index.vue'
import PurchaseItemDetailToolBar from '@/components/business/purchase/purchaseItemDetailToolBar/index.vue'
const route = useRoute();
const purchaseOrderItemStore = usePurchaseItemStore();
const supplyStore = useSupplyStore();
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
const supplierOptions = ref([])
const searchKey = ref('')
const showUploadDialog = (purchaseItemId) => {
  currentPurchaseItemId.value = purchaseItemId
  dialogVisible.value = true
}

const handleUploadSuccess = (files) => {
  console.log('上传的文件列表：', files)
  console.log('当前采购项目ID：', currentPurchaseItemId.value)
  // 这里可以添加上传成功后的刷新逻辑
}
// 解构事件类型
const { DBLCLICK_CELL,ICON_CLICK} = VTable.ListTable.EVENT_TYPE;

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
    minWidth: 100,
    sort: (v1, v2, order) => {
        // 使用自定义排序逻辑
        if (order === 'desc') {
          return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
  },
  {
    field: 'product_code',
    title: '产品编码',
    minWidth: 160,
  },
  {
    field: 'product_name_zh',
    title: '产品名称(中)',
    width: 150,
  },
  {
    field: 'product_name_en',
    title: '产品名称(英)',
    width: 150,
  },
  {
    field: 'specification',
    title: '规格',
    width: 150,
  },
  {
    field: 'quantity',
    title: '数量',
    width: 100,
  },
  {
    field: 'unit',
    title: '单位',
    width: 80,
  },
  {
    field: 'unit_price',
    title: '单价',
    width: 120,
    formatter: (value) => Number(value).toFixed(2)
  },
  {
    field: 'total_price',
    title: '总价',
    width: 120,
    formatter: (value) => Number(value).toFixed(2)
  },
  {
    field: 'pics',
    title: '产品图片',
    minWidth: 112,
    headerStyle: {
      textAlign: 'center',
      fontWeight: 'bold',
      backgroundColor: '#f2f3f5'
    },
    icon:['upload','view'],
    cellStyle: () => ({
      textAlign: 'center'
    })
  },
  {
    field: 'creator',
    title: '创建人',
    width: 100,
  },
  {
    field: 'supplier',
    title: '供应商',
    width: 150,
  },
  {
    field: 'purchaser',
    title: '采购员',
    width: 100,
  },
  {
    field: 'remark',
    title: '备注',
    width: 200,
  },
  {
    field: 'purchase_item_id',
    title: '采购项目编号',
    minWidth: 160,
  },
  {
    field: 'created_at',
    title: '创建时间',
    width: 180,
  },
  {
    field: 'order_time',
    title: '下单时间',
    width: 180,
  },
  {
    field: 'order_status',
    title: '状态',
    width: 100,
    formatter: (value) => {
      const statusMap = {
        0: '待处理',
        1: '已下单',
        2: '已取消'
      };
      return statusMap[value] || '未知状态';
    },
    style: (value) => {
      const colorMap = {
        0: '#f7ba1e',  // orange
        1: '#00b42a',  // green
        2: '#f53f3f'   // red
      };
      return {
        color: colorMap[value] || '#86909c'
      };
    }
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
    width: '100%',
    height: 2000,
    showFrozenIcon: true,
    defaultHeaderRowHeight: 50,
    defaultRowHeight: 40,
    hover: {
      highlightMode: 'row'
    },
    theme: {
      defaultStyle: {
        fontFamily: 'Arial',
        fontSize: 20,
        lineHeight: 1.5,
        color: '#1d2129',
        borderColor: '#e5e6eb'
      },
      headerStyle: {
        backgroundColor: '#f2f3f5',
        fontWeight: 'bold',
      },
      bodyStyle: {
        hover: {
          backgroundColor: '#f2f3f5',
        },
        cell: {
          padding: [8, 12]
        }
      }
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
        purchaser: item.purchaser || '-'
      }));

      console.log('Formatted Data:', formattedData);
      
      // 确保DOM元素已经准备好
      nextTick(() => {
        initTable(formattedData);
      });
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
onMounted(() => {
  nextTick(() => {
    fetchOrderDetail();
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
        supplier_id: addFormData.value.supplier,
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
        tableInstance.deleteRecords(selectedRowIndexes)
        Message.success(`成功删除 ${selectedRowIndexes.length} 行数据`)
      } catch (error) {
        console.error('删除失败:', error)
        Message.error('删除失败：' + (error.message || '未知错误'))
      }
    }
  })
}

// 获取供应商列表
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

// 修改搜索处理函数
const handleSupplierSearch = async (searchValue) => {
  searchKey.value = searchValue; // 保存搜索关键词
  await fetchSuppliers(); // 调用搜索接口
};

// 在 script setup 中添加 rules 定义
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
  width: 100%;
  height: 600px;
  overflow: auto;
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
</style>

