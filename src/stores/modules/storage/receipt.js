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

  async function updateReceipt(purchaseOrderId, receiptData) {
    // try {
    //   const response = await request({
    //     url: `/inventory/order/${purchaseOrderId}?page=1&page_size=3&type=0`,
    //     method: 'PUT',
    //     data: receiptData
    //   });
    //   return response;
    // } catch (error) {
    //   console.error('Failed to update receipt:', error);
    //   throw error;
    // }
  }

  const getReceiptDetail = async ({ orderId, page = 1, pageSize = 10, type }) => {
    try {
      // 根据状态映射type参数
      
      const response = await request({
        url: `/inventory/order/${orderId}`,
        method: 'GET',
        params: {
          page,
          page_size: pageSize,
          type
        }
      });

      if (response.code === 200) {
        return response;
      }
      throw new Error(response.message || '获取收货单详情失败');
    } catch (error) {
      console.error('获取收货单详情错误:', error);
      throw error;
    }
  };

  const searchReceipt = async (params) => {
    try {
      const response = await request({
        url: `/inventory/search?keyword=${params.keywords}&page=${params.page}&page_size=${params.page_size}`,
        method: 'GET'
      });
      receiptItems.value = response.data.items;
      total_count.value = response.data.total_orders;
      currentPage.value = params.page;
      pageSize.value = params.page_size;
      return response;
    } catch (error) {
      console.error('Failed to search receipts:', error);
      throw error;
    }
  }

  const receiveReceipt = async (purchaseOrderItemId, receiptData) => {
    try {
      const response = await request({
        url: `/inventory/${purchaseOrderItemId}`,
        method: 'POST',
        data: receiptData
      });
      return response;
    } catch (error) {
      console.error('Failed to receive receipt:', error);
      throw error;
    }
  }

  const receiveAllReceipt = async (purchaseOrderId) => {
    try {
      const response = await request({
        url: `/inventory/received-all/${purchaseOrderId}`,
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Failed to receive all receipts:', error);
      throw error;
    }
  }

  const cancelAllReceipt = async (purchaseOrderId) => {
    try {
      const response = await request({
        url: `/inventory/cancel-all/${purchaseOrderId}`,
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Failed to cancel all receipts:', error);
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
    receiveReceipt,
    receiveAllReceipt,
    cancelAllReceipt
  };
});
