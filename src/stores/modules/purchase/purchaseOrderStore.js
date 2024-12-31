import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {
  // 状态 (State)
  const purchaseOrders = ref([]);
  const currentOrder = ref(null);
  const loading = ref(false);
  const total = ref(0);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const pageSize = ref(10);

  // 操作 (Actions)
  const getPurchaseOrders = async (params) => {
    try {
      loading.value = true;
      const { page = 1, pageSize: size = 10 } = params;
      
      const response = await request({
        url: '/purchase-orders/',
        method: 'GET',
        params: {
          page,
          page_size: size
        }
      });

      if (response.code === 200) {
        // 更新store中的状态
        purchaseOrders.value = response.data.purchase_orders.map(order => ({
          orderNo: order.order_id,
          orderName: order.description,
          operator: order.creator_full_name,
          operateTime: order.created_at,
          remark: order.remarks,
          orderType: order.order_type,
          orderStatus: getOrderStatus(order.status),
          receiveStatus: getReceiveStatus(order.status),
          approvalStatus: getApprovalStatus(order.status)
        }));
        
        total.value = response.data.total_count;
        currentPage.value = response.data.current_page;
        totalPages.value = response.data.total_pages;
        pageSize.value = response.data.page_size;
      } else {
        throw new Error(response.message || '获取采购订单列表失败');
      }
    } catch (error) {
      console.error('获取采购订单列表错误:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createPurchaseOrder = async (orderData) => {
    try {
      loading.value = true;
      const response = await request({
        url: '/purchase-orders/',
        method: 'POST',
        data: {
          description: orderData.description,
          order_type: orderData.type === 'STORAGE' ? 0 : 1,
          remarks: orderData.remark || ''
        }
      });

      if (response.code === 200) {
        return response.data;
      }
      throw new Error(response.message || '创建采购订单失败');
    } catch (error) {
      console.error('创建采购订单错误:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updatePurchaseOrder = async (orderData) => {
    try {
      console.log(orderData,2222)
      loading.value = true;
      const response = await request({
        url: `/purchase-orders/${orderData.orderId}`,
        method: 'PUT',
        data: {
          description: orderData.description,
          order_type: orderData.type === 'STORAGE' ? 0 : 1,
          remarks: orderData.remarks || ''
        }
      });

      if (response.code === 200) {
        return response.data;
      }
      throw new Error(response.message || '更新采购订单失败');
    } catch (error) {
      console.error('更新采购订单错误:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deletePurchaseOrder = async (orderId) => {
    // 删除采购订单
  };

  const getPurchaseOrderDetail = async (orderId) => {
    // 获取采购订单详情
  };

  const submitForApproval = async (orderId) => {
    // 提交审批
  };

  // 计算属性 (Getters)
  const pendingOrders = () => {
    // 待处理的订单
  };

  const approvedOrders = () => {
    // 已批准的订单
  };

  const rejectedOrders = () => {
    // 已拒绝的订单
  };

  // 辅助函数：转换订单状态
  const getOrderStatus = (status) => {
    const statusMap = {
      0: '未下单',
      1: '已下单',
      // 添加其他状态映射...
    };
    return statusMap[status] || '未知状态';
  };

  const getReceiveStatus = (status) => {
    const statusMap = {
      0: '未收货',
      1: '部分收货',
      2: '已收货',
      // 添加其他状态映射...
    };
    return statusMap[status] || '未知状态';
  };

  const getApprovalStatus = (status) => {
    const statusMap = {
      0: '待审批',
      1: '已通过',
      2: '已驳回',
      // 添加其他状态映射...
    };
    return statusMap[status] || '未知状态';
  };

  return {
    // 状态
    purchaseOrders,
    currentOrder,
    loading,
    total,
    currentPage,
    totalPages,
    pageSize,

    // 操作
    getPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    getPurchaseOrderDetail,
    submitForApproval,

    // 计算属性
    pendingOrders,
    approvedOrders,
    rejectedOrders
  };
});
