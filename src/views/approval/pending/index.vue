<template>
    <div class="page-title">
        <h1>{{ title }}</h1>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 定义一个标题变量
const title = ref('待审批项目')
</script>

<style scoped>
/* 如果有其他样式可以在这里添加 */
</style>
