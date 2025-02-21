import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const useApprovalStore = defineStore('approval', () => {
  // 状态 (State)
  const approvalList = ref([]);
  const currentApproval = ref(null);
  const loading = ref(false);
  const totalCount = ref(0);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const pageSize = ref(10);

  const approvalHistoryList = ref([]);
  const approvalHistoryTotalCount = ref(0);
  const approvalHistoryCurrentPage = ref(1);
  const approvalHistoryPageSize = ref(10);
  // 操作 (Actions)
  const getApprovalList = async (params) => {
    try {
      loading.value = true;
      const response = await request.get('/approval/pending', {
        params: {
          page: params.page ,
          page_size: params.pageSize
        }
      });
      approvalList.value = response.data.items;
      totalPages.value = response.data.total_pages;
      totalCount.value = response.data.total_count;
      currentPage.value = params.page;
      pageSize.value = params.pageSize;
      return response.data;
    } catch (error) {
      console.error('获取审批列表失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const submitBatchApproval = async (approvalData) => {
    try {
      loading.value = true;
      const response = await request.post('/batch-submit-purchase-items/', approvalData);
      return response.data;
    } catch (error) {
      console.error('提交审批失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const approveItem = async (purchase_item_id, status,approval_comment) => {
    try {
      loading.value = true;
      const response = await request.post(`/approval/${purchase_item_id}`, {
        status:status,
        approval_comment: approval_comment
      });
      return response.data;
    } catch (error) {
      console.error('审批操作失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getApprovalPendingItems = async (purchaseId) => {
    return new Promise((resolve, reject) => {
      loading.value = true;
      request
        .get(`/approval/${purchaseId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('获取审批详情失败:', error);
          reject(error);
        })
        .finally(() => {
          loading.value = false;
        });
    });
  };

  const getAllApprovalHistory = async (params) => {
    try {
      loading.value = true;
      const response = await request.get('/approval-history/list', {
        params: {
          page: params.page,
          page_size: params.pageSize
        }
      });
      approvalHistoryList.value = response.data.items;
      approvalHistoryTotalCount.value = response.data.total_count;
      approvalHistoryCurrentPage.value = params.page;
      approvalHistoryPageSize.value = params.pageSize;
      return response.data;
    } catch (error) {
      console.error('获取审批历史失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  
  const submitAllApprovals = async (purchaseOrderId,approvalReason) => {
    try {
      loading.value = true;
      const response = await request.post(`/purchase-orders/${purchaseOrderId}/approvals`, {
        applicant_reason: approvalReason
      });
      return response.data;
    } catch (error) {
      console.error('提交所有审批失败:', error);  
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 计算属性 (Getters)
  const pendingApprovals = () => {
    return approvalList.value.filter(item => item.status === 'pending');
  };

  const completedApprovals = () => {
    return approvalList.value.filter(item => ['approved', 'rejected'].includes(item.status));
  };

  const cancelBatchApproval = async (payload) => {
    try {
      loading.value = true;
      const response = await request.post('/approval/cancel/batch', payload);
      return response.data;
    }catch(error){
      console.error('撤销审批失败:', error);
      throw error;
    }finally{
      loading.value = false;
    }
  }


  return {
    // 状态
    approvalList,
    currentApproval,
    loading,
    totalCount,
    currentPage,
    totalPages,
    pageSize,

    // 操作
    getApprovalList,
    submitBatchApproval,
    approveItem,
    getApprovalPendingItems,
    getAllApprovalHistory,
    submitAllApprovals,
    cancelBatchApproval,
    // 计算属性
    pendingApprovals,
    completedApprovals,
    approvalHistoryList,
    approvalHistoryTotalCount,
    approvalHistoryCurrentPage,
    approvalHistoryPageSize
  };
});
