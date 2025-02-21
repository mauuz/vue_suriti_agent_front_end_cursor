<template>
  <div class="inventory-receipt">
    <a-input-search
      v-model.trim="searchValue"
      placeholder="请输入关键字"
      search-button
      allow-clear
      @search="handleSearch"
      @keyup.enter="handleSearch(searchValue)"
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
