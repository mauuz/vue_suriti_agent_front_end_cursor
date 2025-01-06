<template>
  <div class="inventory">
    <div class="toolbar">
      <inventory-tool-bar 
      @search="handleSearch"
      @refresh="handleDeleteRefresh"
    />
    </div>

    <inventory-table
      :data="storageStore.storageItems"
      :loading="storageStore.loading"
      :pagination="{
        current: storageStore.currentPage,
        pageSize: storageStore.pageSize,
        total: storageStore.total_count,
        showTotal: true,
        showPageSize: true,
        pageSizeOptions: [10, 20, 50, 100],
        showJumper: true
      }"
      :row-selection="rowSelection"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @refresh="fetchInventoryData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted,onActivated } from 'vue';
import InventoryToolBar from '@/components/business/inventory/inventoryToolBar/index.vue';
import InventoryTable from '@/components/business/inventory/inventoryTable/index.vue';
import { useStorageStore } from '@/stores/modules/storage/storageStore';

const storageStore = useStorageStore();
const rowSelection = {
  type: 'radio',
  showCheckedAll: true,
  onlyCurrent: false
};

const fetchInventoryData = async () => {
  await storageStore.getStorageList({
    page: storageStore.currentPage,
    pageSize: storageStore.pageSize
  });
};

const handlePageChange = async(page) => {
  storageStore.currentPage = page;
  if (storageStore.searchKey) {
    await fetchSearchInventoryData();
  } else {
    await fetchInventoryData();
  }
 
};

const handlePageSizeChange = async (size) => {
  storageStore.pageSize = size;
  if (storageStore.searchKey) {
    await fetchSearchInventoryData();
  } else {
    await fetchInventoryData();
  }
};

const fetchSearchInventoryData = async(params)=>{
  const isNumeric = /^\d+$/.test(storageStore.searchKey);
  await storageStore.searchStorageItem({
    keyword: isNumeric ? undefined : storageStore.searchKey,
    goods_id: isNumeric ? storageStore.searchKey : undefined,
    page: params?.page||storageStore.currentPage,
    page_size: storageStore.pageSize
  });
}

const handleDeleteRefresh = async () => {
  console.log(storageStore.searchKey)
  if (storageStore.searchKey) {
    await fetchSearchInventoryData();
  } else {
    await fetchInventoryData();
  }
}

const handleSearch = async (value) => {
  if (!value) {
    fetchInventoryData();
    return;
  }
  await fetchSearchInventoryData({page:1});
};

// onActivated(async () => {
//   console.log('activated inventory')
//   await fetchInventoryData();
// });
onMounted(async () => {
  console.log('onmounted inventory')
  await fetchInventoryData();
});
</script>

<style scoped>
.inventory {
  padding: 16px;
}
.toolbar {
  margin-bottom: 16px;
}
</style> 