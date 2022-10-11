<template>
  <div>
    <el-input
        v-model="textarea"
        :rows="2"
        type="textarea"
        placeholder="Please input"
    />
    <el-button>添加到词组库</el-button>
  </div>
</template>

<script setup>
import {ref} from "vue";

let textarea = ref("");
</script>

<style scoped>

</style>