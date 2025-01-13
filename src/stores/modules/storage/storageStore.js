import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const useStorageStore = defineStore('storage', () => {
  // 状态 (State)
  const storageItems = ref([]);
  const currentItem = ref(null);
  const loading = ref(false);
  const total_count = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const searchKey = ref('');
  const selectedRows = ref('');

  // 操作 (Actions)
  const getStorageList = async (params) => {
    loading.value = true;
    try {
      const response = await request({
        url: '/storage/items',
        method: 'GET',
        params: {
          page: params.page,
          page_size: params.pageSize
        }
      });
      storageItems.value = response.data.items;
      total_count.value = response.data.total_count; // Assuming the API returns total count
      currentPage.value = params.page;
      pageSize.value = params.pageSize;
    } catch (error) {
      console.error('Failed to fetch storage list:', error);
    } finally {
      loading.value = false;
    }
  };

  const createStorageItem = (itemData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request({
          url: '/storage/',
          method: 'POST',
          data: itemData
        });
        resolve(response); // Resolve the promise with the response
      } catch (error) {
        console.error('Failed to create storage item:', error);
        reject(error); // Reject with the server's error response
        
      }
    });
  };

  const updateStorageItem = (itemId, itemData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request({
          url: `/storage/${itemId}`,
          method: 'PUT',
          data: itemData
        });
        resolve(response); // Resolve the promise with the response
      } catch (error) {
        console.error('Failed to update storage item:', error);
        reject(error); // Reject with the server's error response
      }
    });
  };

  const deleteStorageItem = (itemId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request({
          url: `/storage/${itemId}`,
          method: 'DELETE'
        });
        resolve(response); // Resolve the promise with the response
      } catch (error) {
        console.error('Failed to delete storage item:', error);
        reject(error); // Reject the promise with the error
      }
    });
  };

  const searchStorageItem = async (params) => {
    try {
      const { keyword, page, page_size, goods_id } = params;
      let query = `page=${page}&page_size=${page_size}`;

      if (keyword) {
        query += `&keyword=${keyword}`;
      } 
      // else if (goods_id) {
      //   query += `&goods_id=${goods_id}`;
      // }

      const response = await request({
        url: `/storage?${query}`,
        method: 'GET'
      });
      storageItems.value = response.data.items;
      total_count.value = response.data.total_count; // Assuming the API returns total count
      currentPage.value = params.page;
      pageSize.value = params.page_size;
      return response; // Return the response for further processing
    } catch (error) {
      console.error('Failed to search storage item:', error);
      throw error; // Throw error for handling in calling function
    }
  };

  const getStorageDetail = async (itemId) => {
    // 获取库存详情
  };

  const checkInStorage = async (itemId, quantity) => {
    // 入库操作
  };

  const checkOutStorage = async (itemId, quantity) => {
    // 出库操作
  };

  // 计算属性 (Getters)
  const lowStockItems = () => {
    // 库存不足的商品
  };

  const outOfStockItems = () => {
    // 缺货商品
  };

  return {
    // 状态
    storageItems,
    currentItem,
    loading,
    total_count,
    currentPage,
    pageSize,
    searchKey,
    selectedRows,

    // 操作
    getStorageList,
    createStorageItem,
    updateStorageItem,
    deleteStorageItem,
    getStorageDetail,
    checkInStorage,
    checkOutStorage,
    searchStorageItem,

    // 计算属性
    lowStockItems,
    outOfStockItems
  };
});
