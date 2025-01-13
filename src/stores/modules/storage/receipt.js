import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const useReceiptStore = defineStore('receipt', () => {
  // 状态 (State)
  const receiptItems = ref([]);
  const currentItem = ref(null);
  const loading = ref(false);
  const total_count = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const searchKey = ref('');
  const selectedRows = ref([]);

  // 操作 (Actions)
  async function getReceiptList(params) {
    loading.value = true;
    try {
      const response = await request({
        url: '/inventory/summary',
        method: 'GET',
        params: {
          page: params.page,
          page_size: params.pageSize
        }
      });
      receiptItems.value = response.data.items;
      total_count.value = response.data.total_count;
      currentPage.value = params.page;
      pageSize.value = params.pageSize;
    } catch (error) {
      console.error('Failed to fetch receipt list:', error);
    } finally {
      loading.value = false;
    }
  }

  async function createReceipt(receiptData) {
    try {
      const response = await request({
        url: '/storage/receipts/',
        method: 'POST',
        data: receiptData
      });
      return response;
    } catch (error) {
      console.error('Failed to create receipt:', error);
      throw error;
    }
  }

  async function updateReceipt(receiptId, receiptData) {
    try {
      const response = await request({
        url: `/storage/receipts/${receiptId}`,
        method: 'PUT',
        data: receiptData
      });
      return response;
    } catch (error) {
      console.error('Failed to update receipt:', error);
      throw error;
    }
  }

  async function getReceiptDetail(receiptId) {
    try {
      const response = await request({
        url: `/storage/receipts/${receiptId}`,
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Failed to get receipt detail:', error);
      throw error;
    }
  }

  async function searchReceipt(params) {
    try {
      const { keyword, page, page_size, order_type, status } = params;
      let query = `page=${page}&page_size=${page_size}`;

      if (keyword) {
        query += `&keyword=${keyword}`;
      }
      if (order_type !== undefined) {
        query += `&order_type=${order_type}`;
      }
      if (status !== undefined) {
        query += `&status=${status}`;
      }

      const response = await request({
        url: `/storage/receipts?${query}`,
        method: 'GET'
      });
      receiptItems.value = response.data.items;
      total_count.value = response.data.total_count;
      currentPage.value = params.page;
      pageSize.value = params.page_size;
      return response;
    } catch (error) {
      console.error('Failed to search receipts:', error);
      throw error;
    }
  }

  async function confirmReceipt(receiptId, receiptData) {
    try {
      const response = await request({
        url: `/storage/receipts/${receiptId}/confirm`,
        method: 'POST',
        data: receiptData
      });
      return response;
    } catch (error) {
      console.error('Failed to confirm receipt:', error);
      throw error;
    }
  }

  return {
    // 状态
    receiptItems,
    currentItem,
    loading,
    total_count,
    currentPage,
    pageSize,
    searchKey,
    selectedRows,

    // 操作
    getReceiptList,
    createReceipt,
    updateReceipt,
    getReceiptDetail,
    searchReceipt,
    confirmReceipt
  };
});
