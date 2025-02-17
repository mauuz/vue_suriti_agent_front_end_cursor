<template>
  <div class="stock-in-out-management">
     <InventoryReceiptToolBar 
        @search="handleSearch"
      />
      <div class="table-container">
        <InventoryReceiptTable 
          :orders="receiptStore.receiptItems"
          :loading="receiptStore.loading"
          :pagination="{
            current: receiptStore.currentPage,
            pageSize: receiptStore.pageSize,
            total: receiptStore.total_count,
            showTotal: true,
            showPageSize: true,
            pageSizeOptions: [10, 20, 50, 100],
            showJumper: true
          }"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
  </div>

</template>

<script setup>
import { onActivated, onMounted } from 'vue';
import InventoryReceiptToolBar from '@/components/business/inventory/inventoryReceiptToolBar/index.vue';
import InventoryReceiptTable from '@/components/business/inventory/inventoryReceiptTable/index.vue';
import { useReceiptStore } from '@/stores';
const receiptStore = useReceiptStore();   

const handleSearch = async (value) =>  {
  console.log('Search query:', value);
  receiptStore.searchKey = value;
  if(value) {
    await receiptStore.searchReceipt({
      keywords: value,
      page: 1,
      page_size: 10
    });
  } else {
    await fetchReceiptList();
  }
}

const handlePageChange = async (page) => {
  if(receiptStore.searchKey) {
    await receiptStore.searchReceipt({
      keywords: receiptStore.searchKey,
      page: receiptStore.currentPage,
      page_size: receiptStore.pageSize
    });
  } else {
    await receiptStore.getReceiptList({ page, pageSize: receiptStore.pageSize });
  }
}

const handlePageSizeChange = async (pageSize) => {
  receiptStore.pageSize = pageSize;
  if(receiptStore.searchKey) {
    await receiptStore.searchReceipt({
      keywords: receiptStore.searchKey,
      page: receiptStore.currentPage,
      page_size: pageSize
    });
  } else {
    await receiptStore.getReceiptList({ page: receiptStore.currentPage, pageSize });
  }
}

const fetchReceiptList = async () => {

  if(receiptStore.searchKey) {  
    await receiptStore.searchReceipt({
      keywords: receiptStore.searchKey,
      page: receiptStore.currentPage,
      page_size: receiptStore.pageSize
    });
  } else {
    await receiptStore.getReceiptList({ page: receiptStore.currentPage, pageSize: receiptStore.pageSize });
  }
}

// onMounted(async () => {
//   await fetchReceiptList();
// });

onActivated(async () => {
  console.log('activated inventory-receipt')
  await fetchReceiptList();
});
</script>

<style scoped>
.stock-in-out-management {
  padding: 16px;
}
</style> 