<template>
  <div>
    <div>订阅番剧</div>
    <el-button @click="func.openSearch">打开搜索</el-button>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";

let list = ref({});
onMounted(() => {
  func.init()
})
const func = {
  init: async () => {

  },
  openSearch: () => {
    window.operate.openWindow({router: 'searchBangumi', name: '搜索番剧',width:1000,height:600});
  }
}
</script>

<style scoped>

</style>
