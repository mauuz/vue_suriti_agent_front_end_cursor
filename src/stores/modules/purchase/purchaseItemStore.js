import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const usePurchaseItemStore = defineStore('purchaseItem', () => {
  // 状态 (State)
  const purchaseItems = ref([]);
  const currentItem = ref(null);
  const loading = ref(false);
  const delivery_address = ref('江苏省太仓市归庄镇渠泾村香归路华龙用呢');

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
        url: '/images/',
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
    try {
      const response = await request({
        url: `/items/${itemId}`,
        method: 'PUT',
        data: itemData
      });
      return response;
    } catch (error) {
      console.error('更新采购项目错误:', error);
      throw error;
    }
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

  const createPurchaseItemBatch = async (purchaseOrderId, itemData) => {
    // 批量创建采购项目
    try {
      const response = await request({
        url: `/items/batch/${purchaseOrderId}`,
        method: 'POST',
        data: {items:itemData}
      });
      return response;
    } catch (error) {
      console.error('批量创建采购项目错误:', error);
      throw error;
    }
  };  

  const updatePurchaseItemOrderStatus = async (purchaseOrderId, status) => {
    // 更新采购项目下单状态
    try {
      const response = await request({
        url: `/items/${purchaseOrderId}?status=${status}`,
        method: 'PATCH',
      });
      return response;
    } catch (error) {
      console.error('更新采购项目下单状态错误:', error);
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

  const downloadPurchaseItemDetailPDF = async (purchaseOrderId, info) => {
    // 下载采购项目详情PDF
    try {
      const data = {
        delivery_address: info.delivery_address,
        ...(info.address && { address: info.address }),
        ...(info.phone && { phone: info.phone }),
        ...(info.email && { email: info.email }),
        ...(info.account && { account: info.account }),
        ...(info.recipient && { recipient: info.recipient }),
        ...(info.bank && { bank: info.bank }),
        ...(info.bank_address && { bank_address: info.bank_address })
      };

      const response = await request({
        url: `/items/${purchaseOrderId}/pdf`,
        method: 'POST',
        data: data,
        responseType: 'blob' // Ensure the response is treated as a blob
      });
      
      // Return both the data and headers
      return response;
    } catch (error) {
      console.error('下载采购项目详情PDF错误:', error);
      throw error;
    }
  };

  return {
    // 状态
    purchaseItems,
    currentItem,
    loading,
    delivery_address,
    // 操作
    getPurchaseItems,
    createPurchaseItem,
    updatePurchaseItem,
    deletePurchaseItem,
    getPurchaseItemDetail,
    deletePurchaseItemPic,
    uploadPurchaseItemPic,
    createPurchaseItemBatch,
    updatePurchaseItemOrderStatus,
    downloadPurchaseItemDetailPDF,

    // 计算属性
    activePurchaseItems,
    completedPurchaseItems,
    getAllPurchaseItemPic,
  };
});
