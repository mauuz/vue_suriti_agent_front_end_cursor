import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/utils/requests'

export const useApprovalStore = defineStore('approval', () => {
  // 状态 (State)
  const approvalList = ref([]);
  const currentApproval = ref(null);
  const loading = ref(false);

  // 操作 (Actions)
  const getApprovalList = async (params) => {
    try {
      loading.value = true;
      const response = await request.get('/api/approvals', { params });
      approvalList.value = response.data;
      return response.data;
    } catch (error) {
      console.error('获取审批列表失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const submitApproval = async (approvalData) => {
    try {
      loading.value = true;
      const response = await request.post('/api/approvals', approvalData);
      return response.data;
    } catch (error) {
      console.error('提交审批失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const approveRequest = async (approvalId, action, comment) => {
    try {
      loading.value = true;
      const response = await request.put(`/api/approvals/${approvalId}`, {
        action,
        comment
      });
      return response.data;
    } catch (error) {
      console.error('审批操作失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getApprovalDetail = async (approvalId) => {
    try {
      loading.value = true;
      const response = await request.get(`/api/approvals/${approvalId}`);
      currentApproval.value = response.data;
      return response.data;
    } catch (error) {
      console.error('获取审批详情失败:', error);
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

  return {
    // 状态
    approvalList,
    currentApproval,
    loading,

    // 操作
    getApprovalList,
    submitApproval,
    approveRequest,
    getApprovalDetail,

    // 计算属性
    pendingApprovals,
    completedApprovals
  };
});
