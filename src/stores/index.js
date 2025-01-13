import { createPinia } from 'pinia';
import { useSupplyStore } from './modules/supply/supplyStore.js';
import { useStorageStore } from './modules/storage/storageStore';
import { usePurchaseOrderStore } from './modules/purchase/purchaseOrderStore.js';
import { usePurchaseItemStore } from './modules/purchase/purchaseItemStore.js';
import { useApprovalStore } from './modules/approval/approvalStore.js';
import { useUserStore } from './modules/user/userStore';
import { useReceiptStore } from './modules/storage/receipt.js';

const pinia = createPinia();

export {
    pinia,
    useSupplyStore,
    useStorageStore,
    usePurchaseOrderStore,
    usePurchaseItemStore,
    useApprovalStore,
    useUserStore,
    useReceiptStore,
};
