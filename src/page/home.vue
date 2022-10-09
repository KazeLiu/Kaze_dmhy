<template>
  <div>
    <div>订阅番剧</div>
    {{ list }}
    <el-button>打开搜索</el-button>
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
    window.getData.getList().then(data => {
      let parseString = require('xml2js').parseString;
      parseString(data.data, function (err, result) {
        list.value = result;
      });
    })
  }
}
</script>

<style scoped>

</style>