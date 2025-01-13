<template>
    <div class="receipt-detail">
      <div class="tool-bar">
        <InventoryReceiptDetailToolBar />
      </div>
      <div class="table-container">
        
      </div>
    </div>
  </template>
  
  <script setup>
  import InventoryReceiptDetailToolBar from '@/components/business/inventory/inventoryReceiptDetailToolBar/index.vue';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useReceiptStore } from '@/stores';
  import { Message } from '@arco-design/web-vue';
  
  </script>
  
  <style scoped>
  .receipt-detail {
    padding: 16px;
  }
  
  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>