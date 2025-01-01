<template>
  <div class="purchase-item-detail-container">
      <div ref="tableContainer" class="table-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, h } from 'vue';
import { useRoute } from 'vue-router';
import { usePurchaseItemStore } from '@/stores';
import * as VTable from '@visactor/vtable';
import { Message, Modal, Image, ImagePreviewGroup } from '@arco-design/web-vue';

const route = useRoute();
const purchaseOrderItemStore = usePurchaseItemStore();
const tableContainer = ref(null);
let tableInstance = null;

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
    field: 'purchase_item_id',
    title: '采购项目编号',
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
    records: data.map(item => ({
      ...item,
      // pics: Array.isArray(item.pics) && item.pics.length > 0 ? item.pics[0] : ''
    })),
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
  tableInstance.on(ICON_CLICK, (args) => {
    console.log('Icon click args:', args);
    if (args.name === 'view') {
      console.log('Icon click args:', args);
      const cellValue = tableInstance.getCellValue(args.col, args.row);
      console.log('Cell value:', cellValue);
      
      if (Array.isArray(cellValue) && cellValue.length > 0) {
        Modal.info({
          title: tableInstance.getCellValue(7, args.row),
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
            }, cellValue.map(url => 
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
      }
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
        unit_price: Number(item.unit_price).toFixed(2),
        total_price: Number(item.total_price).toFixed(2),
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
</script>

<style scoped>
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
