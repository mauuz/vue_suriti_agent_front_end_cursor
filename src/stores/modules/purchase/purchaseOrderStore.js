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
  const shippingFees = ref({});
  const selectedPurchaseOrderList = ref([]);

  const operatorFliter = ref('');

  // 操作 (Actions)
  const getPurchaseOrders = async (params) => {
    try {
      loading.value = true;
      const { page = 1, pageSize: size = 10 } = params;
      
      const response = await request({
        url: '/purchase-orders',
        method: 'GET',
        params: {
          page,
          page_size: size,
          creator_full_name: operatorFliter.value
        }
      });

      if (response.code === 200) {
        // 更新store中的状态
        purchaseOrders.value = response.data.items.map(order => ({
          orderNo: order.order_id,
          orderName: order.description,
          operator: order.creator_full_name,
          operateTime: order.created_at,
          remark: order.remarks,
          orderType: order.order_type,
          supplierName: order.supplier_name,
          supplierId: order.supplier_id,
          shippingFee: order.shipping_fee,
          totalPrice: parseFloat(order.sub_total) + parseFloat(order.shipping_fee),
          orderStatus: getOrderStatus(order.order_status),
          receiveStatus: getReceiveStatus(order.inventory_status),
          approvalStatus: getApprovalStatus(order.approval_status)
        }));
        
        total.value = response.data.total_count;
        currentPage.value = response.data.page;
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
        url: '/purchase-orders',
        method: 'POST',
        data: {
          description: orderData.description,
          supplier_id: orderData.supplier_id,
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
      console.log(orderData, 2222);
      loading.value = true;

      // Prepare the data object conditionally
      const data = {};
      const allowedFields = ['description', 'type', 'remarks', 'supplier_id', 'shipping_fee'];

      allowedFields.forEach(field => {
        if (orderData[field] !== undefined) {
          if (field === 'type') {
            data['order_type'] = orderData[field] === 'STORAGE' ? 0 : 1;
          } else {
            data[field] = orderData[field];
          }
        }
      });

      const response = await request({
        url: `/purchase-orders/${orderData.orderId}`,
        method: 'PUT',
        data
      });

      if (response.code === 200) {
        return response;
      }
      throw new Error(response.message || '更新采购订单失败');
    } catch (error) {
      console.error('更新采购订单错误:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const getShippingFee = async (orderId) => {
    try {
      const response = await request({
        url: `/purchase-orders/${orderId}/shipping-fee`,
        method: 'GET'
      });

      if (response.code === 200) {
        // 更新 shippingFees
        shippingFees.value[orderId] = response.data.shipping_fee;
        return response.data.shipping_fee;
      } else {
        throw new Error(response.message || '获取邮费失败');
      }
    } catch (error) {
      console.error('获取邮费错误:', error);
      throw error;
    }
  };

  const deletePurchaseOrder = async (orderId) => {
    // 删除采购订单
  };

  const getPurchaseOrderDetail = async (orderId) => {
    const response = await request({
      url: `/purchase-orders/${orderId}`,
      method: 'GET'
    });
    return response;
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
      1: '部分下单',
      2: '已下单',
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
      0: '未提交',
      1: '审核中',
      2: '未通过',
      3: '已通过',
      // 添加其他状态映射...
    };
    return statusMap[status] || '未知状态';
  };

  // 更新采购订单的邮费
  const updateShippingFee = (orderId, fee) => {
    shippingFees.value[orderId] = fee; 
  }

  const getshippingFeeFromPurchaseOrderID = (orderId)=>{
      return shippingFees.value[orderId]
  }

  return {
    // 状态
    purchaseOrders,
    currentOrder,
    loading,
    total,
    currentPage,
    totalPages,
    pageSize,
    shippingFees,
    selectedPurchaseOrderList,
    operatorFliter,

    // 操作
    getPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    getPurchaseOrderDetail,
    submitForApproval,
    getShippingFee,
    updateShippingFee,
    getshippingFeeFromPurchaseOrderID,

    // 计算属性
    pendingOrders,
    approvedOrders,
    rejectedOrders
  };
});
