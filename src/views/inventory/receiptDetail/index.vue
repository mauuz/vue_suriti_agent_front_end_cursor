<template>
    <div class="receipt-detail">
      <div class="tool-bar">
        <InventoryReceiptDetailToolBar 
          :order-id="orderId"
          @search="handleSearch"
          @refresh="fetchData"
        />
      </div>

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="unreceived" title="未收货">
          <div class="table-container">
            <InventoryReceiptDetailTable 
              :data="unreceivedData"
              :loading="loading"
              :pagination="unreceivedPagination"
              @page-change="(page) => handlePageChange(page, 'unreceived')"
              @page-size-change="(size) => handlePageSizeChange(size, 'unreceived')"
              @refresh="fetchData"
            />
          </div>
        </a-tab-pane>

        <a-tab-pane key="partial" title="部分收货">
          <div class="table-container">
            <InventoryReceiptDetailTable 
              :data="partialData"
              :loading="loading"
              :pagination="partialPagination"
              @page-change="(page) => handlePageChange(page, 'partial')"
              @page-size-change="(size) => handlePageSizeChange(size, 'partial')"
              @refresh="fetchData"
            />
          </div>
        </a-tab-pane>

        <a-tab-pane key="received" title="已收货">
          <div class="table-container">
            <InventoryReceiptDetailTable 
              :data="receivedData"
              :loading="loading"
              :pagination="receivedPagination"
              @page-change="(page) => handlePageChange(page, 'received')"
              @page-size-change="(size) => handlePageSizeChange(size, 'received')"
              @refresh="fetchData"
            />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useReceiptStore } from '@/stores';
  import InventoryReceiptDetailToolBar from '@/components/business/inventory/inventoryReceiptDetailToolBar/index.vue';
  import InventoryReceiptDetailTable from '@/components/business/inventory/inventoryReceiptDetailTable/index.vue';

  const route = useRoute();
  const receiptStore = useReceiptStore();
  const orderId = route.params.id;
  const activeTab = ref('unreceived');
  const loading = ref(false);
  const searchQuery = ref('');

  // 初始化数据
  const unreceivedData = ref([]);
  const partialData = ref([]);
  const receivedData = ref([]);

  // 初始化分页配置
  const createPagination = () => ({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: true,
    showPageSize: true,
    pageSizeOptions: [10, 20, 50, 100],
    showJumper: true
  });

  const unreceivedPagination = ref(createPagination());
  const partialPagination = ref(createPagination());
  const receivedPagination = ref(createPagination());

  // 获取对应tab的分页对象
  const getPaginationByTab = (tab) => {
    const paginationMap = {
      unreceived: unreceivedPagination,
      partial: partialPagination,
      received: receivedPagination
    };
    return paginationMap[tab];
  };

  // 获取对应tab的数据数组
  const getDataRefByTab = (tab) => {
    const dataMap = {
      unreceived: unreceivedData,
      partial: partialData,
      received: receivedData
    };
    return dataMap[tab];
  };

  const fetchData = async () => {
    if (!orderId) return;
    
    loading.value = true;
    try {
      // 根据 activeTab 映射到对应的 type
      const typeMap = {
        'unreceived': 0,  // 未收货
        'partial': 1,     // 部分收货
        'received': 2     // 已收货
      };
      console.log(typeMap[activeTab.value],111)
      const pagination = getPaginationByTab(activeTab.value).value;
      const response = await receiptStore.getReceiptDetail({
        orderId,
        page: pagination.current,
        pageSize: pagination.pageSize,
        type: typeMap[activeTab.value]
      });

      // 根据当前激活的 tab 更新对应的数据
      const dataRef = getDataRefByTab(activeTab.value);
      if (response.data && Array.isArray(response.data.items)) {
        dataRef.value = response.data.items;
        pagination.total = response.data.total_count;
      } else {
        dataRef.value = [];
        pagination.total = 0;
        console.warn('Response data format is unexpected:', response);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      // 清空当前 tab 的数据
      const dataRef = getDataRefByTab(activeTab.value);
      dataRef.value = [];
      getPaginationByTab(activeTab.value).value.total = 0;
    } finally {
      loading.value = false;
    }
  };

  const handlePageChange = (page, tab) => {
    const pagination = getPaginationByTab(tab).value;
    pagination.current = page;
    fetchData();
  };

  const handlePageSizeChange = (pageSize, tab) => {
    const pagination = getPaginationByTab(tab).value;
    pagination.pageSize = pageSize;
    pagination.current = 1;
    fetchData();
  };

  const handleSearch = async (value) => {
    console.log(value);
    // await receiptStore.searchReceipt({
    //   keywords: value,
    //   page: 1,
    //   page_size: 10
    // });
  };

  // 监听 tab 切换
  watch(activeTab, async() => {
    await fetchData();
  });

  onMounted(async () => {
    await fetchData();
  });
  </script>
  
  <style scoped>
  .receipt-detail {
    padding: 16px;
  }
  .tool-bar {
    margin-bottom: 16px;
  }
  
  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .table-container {
    background: #fff;
    padding: 16px;

  }
  </style>