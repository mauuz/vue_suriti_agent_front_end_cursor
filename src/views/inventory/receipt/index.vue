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
import { onMounted } from 'vue';
import InventoryReceiptToolBar from '@/components/business/inventory/inventoryReceiptToolBar/index.vue';
import InventoryReceiptTable from '@/components/business/inventory/inventoryReceiptTable/index.vue';
import { useReceiptStore } from '@/stores';
const receiptStore = useReceiptStore();   

const handleSearch = (value) =>  {
  console.log('Search query:', value);
}

const handlePageChange = (page) => {
  receiptStore.getReceiptList({ page, pageSize: receiptStore.pageSize });
}

const handlePageSizeChange = (pageSize) => {
  receiptStore.getReceiptList({ page: receiptStore.currentPage, pageSize });
}

const fetchReceiptList = async () => {
  await receiptStore.getReceiptList({ page: receiptStore.currentPage, pageSize: receiptStore.pageSize });
}

onMounted(async () => {
  await fetchReceiptList();
});
</script>

<style scoped>
.stock-in-out-management {
  padding: 16px;
}
</style> 