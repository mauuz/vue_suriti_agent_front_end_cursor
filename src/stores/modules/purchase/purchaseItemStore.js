import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const usePurchaseItemStore = defineStore('purchaseItem', () => {
  // 状态 (State)
  const purchaseItems = ref([]);
  const currentItem = ref(null);
  const loading = ref(false);

  // 操作 (Actions)
  const getPurchaseItems = async (params) => {
    // 获取采购项目列表
  };

  const createPurchaseItem = async (itemData) => {
    // 创建新的采购项目
  };

  const updatePurchaseItem = async (itemId, itemData) => {
    // 更新采购项目
  };

  const deletePurchaseItem = async (itemId) => {
    // 删除采购项目
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

    // 计算属性
    activePurchaseItems,
    completedPurchaseItems
  };
});