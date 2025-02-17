<template>
  <div class="toolbar">
    <div class="button-group">
      <a-space>
        <a-button type="primary" @click="handleBatchReceive">
          <template #icon>
            <icon-check />
          </template>
          整单收货
        </a-button>
        <a-button status="danger" @click="handleBatchCancel">
          <template #icon>
            <icon-close />
          </template>
          整单撤销收货
        </a-button>
      </a-space>
    </div>

    <div class="search-container">
      <a-input-search
        v-model="searchQuery"
        placeholder="请输入商品名称"
        search-button
        @search="onSearch"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { IconCheck, IconClose } from '@arco-design/web-vue/es/icon';
import { useReceiptStore } from '@/stores';
import { useRoute } from 'vue-router';

const receiptStore = useReceiptStore();
const searchQuery = ref('');
const route = useRoute();

const emit = defineEmits(['search', 'refresh']);


const onSearch = (value) => {
//   emit('search', value);
};

const handleBatchReceive = () => {
  Modal.confirm({
    title: '确认整单收货',
    content: '确定要将该订单所有商品标记为已收货吗？',
    onOk: async () => {
      try {
        //console.log(route.params.id);
        await receiptStore.receiveAllReceipt(route.params.id);
        Message.success('整单收货成功');
        emit('refresh');
      } catch (error) {
        Message.error('整单收货失败：' + (error.message || '未知错误'));
      }
    }
  });
};

const handleBatchCancel = () => {
  Modal.confirm({
    title: '确认撤销收货',
    content: '确定要撤销该订单所有商品的收货状态吗？',
    onOk: async () => {
      try {
        //console.log(route.params.id);
        await receiptStore.cancelAllReceipt(route.params.id);
        Message.success('撤销收货成功');
        emit('refresh');
      } catch (error) {
        Message.error('撤销收货失败：' + (error.message || '未知错误'));
      }
    }
  });
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 8px;
}

.search-container {
  display: flex;
  width: 320px;
  align-items: center;
}
</style>
