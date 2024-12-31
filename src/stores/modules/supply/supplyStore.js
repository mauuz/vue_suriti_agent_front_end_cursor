import { ref } from 'vue'
import { defineStore } from 'pinia'
import request from '@/utils/requests'

export const useSupplyStore = defineStore('supply', () => {
    const suppliers = ref([])
    const currentSupplier = ref(null);
    const loading = ref(false)
    const total = ref(0)
    const currentPage = ref(1)
    const totalPages = ref(1);
    const pageSize = ref(10)

  // 操作 (Actions)
  const getSupplierList = async (params) => {
    try {
      loading.value = true;
      const { page = 1, pageSize: size = 10 } = params;
      
      const response = await request({
        url: '/suppliers/all',
        method: 'GET',
        params: {
          page,
          page_size: size
        }
      });

      if (response.code === 200) {
        suppliers.value = response.data.suppliers.map(supplier => ({
          supplierId: supplier.id,
          supplierName: supplier.name,
          contactPerson: supplier.contact_person,
          contactInfo: supplier.contact_info,
          paymentAccount: supplier.payment_account,
          payee: supplier.payee,
          bankName: supplier.bank_name,
          shippingAddress: supplier.shipping_address,
          status: supplier.status,
          createdAt: supplier.created_at,
          remarks: supplier.remarks,
          creatorId: supplier.creator_id,
          creatorName: supplier.full_name
        }));
        
        total.value = response.data.total_suppliers;
        currentPage.value = response.data.current_page;
        totalPages.value = response.data.total_pages;
        pageSize.value = response.data.page_size;
      } else {
        throw new Error(response.message || '获取供应商列表失败');
      }
    } catch (error) {
      console.error('获取供应商列表错误:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createSupplier = async (supplierData) => {
    try {
      console.log(supplierData)
      loading.value = true;
      const response = await request({
        url: '/suppliers',
        method: 'POST',
        data: {
          name: supplierData.name,
          contact_info: supplierData.contact_info,
          contact_person: supplierData.contact_person,
          payment_account: supplierData.payment_account,
          payee: supplierData.payee,
          bank_name: supplierData.bank_name,
          shipping_address: supplierData.shipping_address,
          remarks: supplierData.remarks || ''
        }
      });

      if (response.code === 200) {
        return response.data;
      }
      throw new Error(response.message || '创建供应商失败');
    } catch (error) {
      console.error('创建供应商错误:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateSupplier = async (supplierData) => {
    try {
      loading.value = true;
      console.log(supplierData)
      const response = await request({
        url: `/suppliers/${supplierData.supplierId}`,
        method: 'PUT',
        data: {
          supplier_name: supplierData.supplierName,
          contact_info: supplierData.contactInfo,
          contact_person: supplierData.contactPerson,
          payment_account: supplierData.paymentAccount,
          payee: supplierData.payee,
          bank_name: supplierData.bankName,
          shipping_address: supplierData.shippingAddress,
          remarks: supplierData.remarks || '',
          status: supplierData.status
        }
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteSupplier = async (supplierId) => {
    // 删除供应商
  };

  const getSupplierDetail = async (supplierId) => {
    // 获取供应商详情
  };

  const evaluateSupplier = async (supplierId, evaluationData) => {
    // 供应商评估
  };

  // 计算属性 (Getters)
  const activeSuppliers = () => {
    // 活跃的供应商
  };

  const preferredSuppliers = () => {
    // 优选供应商
  };

  const blacklistedSuppliers = () => {
    // 黑名单供应商
  };

    return {
        suppliers,
        loading,
        total,
        currentPage,
        totalPages,
        pageSize,
        currentSupplier,
        getSupplierList,
        createSupplier,
        updateSupplier
    }
})
