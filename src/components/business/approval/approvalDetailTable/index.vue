<template>
    <div>
        <div class="statistics-info">
            <div class="approval-toolbar">
        <a-space>
            <a-button type="primary" @click="handleApprove">
                <template #icon><icon-check /></template>
                通过
            </a-button>
            <a-button status="danger" @click="handleReject">
                <template #icon><icon-close /></template>
                驳回
            </a-button>
        </a-space>

        <!-- 审批通过弹窗 -->
        <a-modal
            v-model:visible="approveModalVisible"
            title="审批通过"
            @ok="submitApprove"
            @cancel="approveModalVisible = false"
        >
            <a-form :model="approveForm" ref="approveFormRef">
                <a-form-item
                    field="reason"
                    label="通过原因(可选)"
                >
                    <a-textarea
                        v-model="approveForm.reason"
                        placeholder="请输入通过原因（选填）"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                    />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 审批驳回弹窗 -->
        <a-modal
            v-model:visible="rejectModalVisible"
            title="审批驳回"
            @before-ok="submitReject"
            @cancel="rejectModalVisible = false"
            :mask-closable="false"
        >
            <a-form :model="rejectForm" ref="rejectFormRef">
                <a-form-item
                    field="reason"
                    label="驳回原因"
                    :rules="[{ required: true, message: '请填写驳回原因' }]"
                >
                    <a-textarea
                        v-model="rejectForm.reason"
                        placeholder="请输入驳回原因"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
        </div>
        <a-table 
            :columns="columns" 
            :data="data"  
            :row-selection="rowSelection"  
            :virtual-list-props="{ height: 600 }" 
            :pagination="false" 
            :scroll="{ x: 1000 }" 
            row-key="purchase_item_id"
            @selection-change="handleSelectionChange"
        >
        <template #pics="{ record }">
            <a-image-preview-group infinite>
                <a-space>
                    <a-image
                        v-for="(pic, index) in record.pics"
                        :key="index"
                        :src="pic"
                        :width="50"
                        :height="50"
                        fit="cover"
                    />
                </a-space>
            </a-image-preview-group>
        </template>
        </a-table>
    </div>
    <div class="statistics-summary">
        <span class="stat-item">总项数：{{ data?.length || 0 }} 项</span>
        <span class="stat-item">总金额：¥ {{ totalPrice || '0.00000000' }}</span>
        <span class="stat-item">已选：{{ selectedCount }} 项</span>
        <span class="stat-item">已选金额：¥ {{ selectedTotalPrice || '0.00000000' }}</span>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import { ref, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useApprovalStore} from '@/stores';
const approvalStore = useApprovalStore()
const router = useRouter()
const props = defineProps({ 
    data: {
        type: Array,
        required: true,
        default: () => []
    }
});
const approveModalVisible = ref(false);
const rejectModalVisible = ref(false);
const selectedRows = ref([]);
const selectedCount = computed(() => selectedRows.value.length);

// 计算总价
const totalPrice = computed(() => {
    if (!props.data?.length) return '0.00000000';
    return props.data.reduce((sum, item) => {
        return sum + (Number(item.total_price) || 0);
    }, 0).toFixed(8);
});

// 计算已选项目的总价
const selectedTotalPrice = computed(() => {
    if (!props.data?.length || !selectedRows.value.length) return '0.00000000';
    return props.data
        .filter(item => selectedRows.value.includes(item.purchase_item_id))
        .reduce((sum, item) => {
            return sum + (Number(item.total_price) || 0);
        }, 0).toFixed(8);
});

// 处理选择变化
const handleSelectionChange = (rowKeys) => {
    selectedRows.value = rowKeys;
};

const columns = [
    { title: '序号', dataIndex: 'sequence', key: 'sequence' },
    { title: '采购订单ID', dataIndex: 'purchase_order_id', key: 'purchase_order_id' },
    { title: '供应商名称', dataIndex: 'supplier_name', key: 'supplier_name' },
    { title: '产品代码', dataIndex: 'product_code', key: 'product_code' },
    { title: '产品名称(中文)', dataIndex: 'product_name_zh', key: 'product_name_zh' },
    { title: '产品名称(英文)', dataIndex: 'product_name_en', key: 'product_name_en' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '单价', dataIndex: 'unit_price', key: 'unit_price' },
    { title: '总价', dataIndex: 'total_price', key: 'total_price' },
    { title: '图片', dataIndex: 'pics', key: 'pics' ,slotName: 'pics'},
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { title: '申请人', dataIndex: 'applicant_name', key: 'applicant_name' },
    { title: '申请理由', dataIndex: 'applicant_reason', key: 'apply_reason' },
    { title: '采购项目ID', dataIndex: 'purchase_item_id', key: 'purchase_item_id' },
    { title: '采购创建者名称', dataIndex: 'creator_name', key: 'creator_name' },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at' }
];

const rowSelection = {
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false
};

const approveForm = ref({
    reason: ''
});
const rejectForm = ref({
    reason: ''
});

// 添加 emit 声明
const emit = defineEmits(['refresh']);

// 添加表单引用
const approveFormRef = ref(null);
const rejectFormRef = ref(null);

// 处理通过按钮点击
const handleApprove = () => {
if (selectedRows.value.length === 0) {
        Message.warning('请至少选择一项进行审批');
        return;
    }
    approveModalVisible.value = true;
};

// 处理驳回按钮点击
const handleReject = () => {
    if (selectedRows.value.length === 0) {
            Message.warning('请至少选择一项进行驳回');
            return;
        }
    rejectModalVisible.value = true;
};

// 提交通过
const submitApprove = async () => {
    
    try {
        for (const itemId of selectedRows.value) {
            await approvalStore.approveItem(itemId, 1,approveForm.value.reason || "通过")
        }
        Message.success('批量审批通过成功!')
        approveModalVisible.value = false
        approveForm.value.reason = ''
        emit('refresh')  // 刷新数据
    } catch (error) {
        Message.error(`审批失败: ${error.message}`)
    }
};

// 提交驳回
const submitReject = async (done) => {
    try {
        const result = await rejectFormRef.value.validate();
        if (result) {
            done(false);
            return;
        }
        
        for (const itemId of selectedRows.value) {
            await approvalStore.approveItem(itemId,2 ,rejectForm.value.reason);
        }
        
        Message.success('批量驳回成功!');
        rejectForm.value.reason = '';
        emit('refresh');  // 刷新数据
        done(true); // 允许关闭对话框
    } catch (error) {
        console.error('驳回失败:', error);
        Message.error(`驳回失败: ${error.message || '未知错误'}`);
        done(false); // 不允许关闭对话框
    }
};

</script>

<style scoped>
.statistics-info {
    margin-bottom: 16px;
}

.statistics-summary {
    margin: 16px 0;
    font-size: 14px;
    color: var(--color-text-2);
}

.stat-item {
    margin-right: 24px;
}

.stat-item:last-child {
    margin-right: 0;
}
</style>