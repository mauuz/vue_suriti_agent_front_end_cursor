<template>
  <div class="inventory-receipt">
    <a-input-search
      v-model="searchValue"
      placeholder="请输入订单号"
      search-button
      @search="handleSearch"
      class="search-input"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const searchValue = ref('');
const emit = defineEmits(['search']);

const handleSearch = (value) => {
  emit('search', value);
};
</script>

<style scoped>
.inventory-receipt {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.search-input {
  width: 320px;
}
</style>
