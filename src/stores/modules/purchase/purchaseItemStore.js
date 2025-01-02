import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const usePurchaseItemStore = defineStore('purchaseItem', () => {
  // 状态 (State)
  const purchaseItems = ref([]);
  const currentItem = ref(null);
  const loading = ref(false);

  // 操作 (Actions)
  const getPurchaseItems = async (orderId) => {
    try {
      loading.value = true;
      const response = await request({
        url: `/items/${orderId}`,
        method: 'GET'
      });

      if (response.code === 200) {
        purchaseItems.value = response.data;
        return response;
      }
      throw new Error(response.message || '获取采购项目列表失败');
    } catch (error) {
      console.error('获取采购项目列表错误:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getAllPurchaseItemPic = async (itemId) => {
    try {
      const response = await request({
        url: `/images/${itemId}`,
        method: 'GET'
      });
      if (response.code === 200) {
        return response;
      }
      throw new Error(response.message || '获取采购项目图片失败');
    } catch (error) {
      console.error('获取采购项目图片错误:', error);
      throw error;
    }
  }

  const deletePurchaseItemPic = async (picId) => {
    try {
      const response = await request({
        url: `/images/?pic_url=${picId}`,
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('删除采购项目图片错误:', error);
      throw error;
    }
  }

  const uploadPurchaseItemPic = async (itemId, file, onProgress) => {
    try {
      console.log("uploadPurchaseItemPic", itemId, file, onProgress)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('purchase_item_id', itemId)
      
      const response = await request({
        url: '/images',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(percentCompleted)
          }
        }
      });
      return response;
    } catch (error) {
      console.error('上传采购项目图片错误:', error);
      throw error;
    }
  };

  const createPurchaseItem = async (itemData) => {
    // 创建新的采购项目
    try {
      const response = await request({
        url: '/items/',
        method: 'POST',
        data: itemData
      });
      return response;
    } catch (error) {
      console.error('创建采购项目错误:', error);
      throw error;
    }
  };

  const updatePurchaseItem = async (itemId, itemData) => {
    // 更新采购项目
  };

  const deletePurchaseItem = async (itemId) => {
    try {
      const response = await request({
        url: `/items/${itemId}`,
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('删除采购项目错误:', error);
      throw error;
    }
  };

  const getPurchaseItemDetail = async (itemId) => {
    // 获取采购项目详情
  };

  // 计算属性 (Getters)
  const activePurchaseItems = () => {
    // 获取活跃的采购项目
  };

  const completedPurchaseItems = () => {
    // 获取已完成的采购项目
  };


  return {
    // 状态
    purchaseItems,
    currentItem,
    loading,

    // 操作
    getPurchaseItems,
    createPurchaseItem,
    updatePurchaseItem,
    deletePurchaseItem,
    getPurchaseItemDetail,
    deletePurchaseItemPic,
    uploadPurchaseItemPic,

    // 计算属性
    activePurchaseItems,
    completedPurchaseItems,
    getAllPurchaseItemPic,
  };
});
