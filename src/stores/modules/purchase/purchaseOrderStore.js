import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {
  // 状态 (State)
  const purchaseOrders = ref([]);
  const currentOrder = ref(null);
  const loading = ref(false);

  // 操作 (Actions)
  const getPurchaseOrders = async (params) => {
    try {
      loading.value = true;
      const { page = 1, pageSize = 10 } = params;
      
      const response = await request({
        url: '/purchase-orders/',
        method: 'GET',
        params: {
          page,
          page_size: pageSize
        }
      });

      if (response.code === 200) {
        // 转换后端数据格式为前端所需格式
        purchaseOrders.value = response.data.purchase_orders.map(order => ({
          orderNo: order.order_id,
          orderName: order.description,
          operator: order.creator_full_name,
          operateTime: order.created_at,
          remark: order.remarks,
          orderType: order.order_type,
          orderStatus: getOrderStatus(order.status),
          // 如果后端没有提供这些状态，可以根据 status 值来映射
          receiveStatus: getReceiveStatus(order.status),
          approvalStatus: getApprovalStatus(order.status)
        }));

        return {
          data: purchaseOrders.value,
          total: response.data.total_count,
          current: response.data.current_page,
          totalPages: response.data.total_pages,
          pageSize: response.data.page_size
        };
      }
      throw new Error(response.message || '获取采购订单列表失败');
    } catch (error) {
      console.error('获取采购订单列表错误:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createPurchaseOrder = async (orderData) => {
    // 创建新的采购订单
  };

  const updatePurchaseOrder = async (orderId, orderData) => {
    // 更新采购订单
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
