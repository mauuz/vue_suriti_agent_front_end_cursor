<template>
    <div class="toolbar">
      <div class="left">
        <a-space>
          <a-button type="primary">
            <template #icon>
              <icon-plus />
            </template>
            创建订单
          </a-button>
          <a-button status="danger">
            <template #icon>
              <icon-delete />
            </template>
            删除
          </a-button>
        </a-space>
      </div>
      <div class="right">
        <a-input-search
          :style="{ width: '320px' }"
          placeholder="请输入搜索内容"
          search-button
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { IconPlus, IconDelete } from '@arco-design/web-vue/es/icon'
  </script>
  
  <style scoped>
  .toolbar {
    width: 100%;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>