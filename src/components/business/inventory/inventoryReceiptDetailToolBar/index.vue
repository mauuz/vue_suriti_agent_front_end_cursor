<template>
  <div class="toolbar">
    <!-- Other toolbar content -->
    <div class="search-container">
      <a-input-search
        v-model="searchQuery"
        placeholder="请输入商品名称"
        search-button
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Input, Button } from '@arco-design/web-vue';

const searchQuery = ref('');

const onSearch = () => {
  // Handle the search logic here
  console.log('Searching for:', searchQuery.value);
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-container {
  display: flex;
  width: 320px;
  align-items: center;
  margin-left: auto; /* Pushes the search container to the right */
}
</style>
