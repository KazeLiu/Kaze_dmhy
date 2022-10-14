<template>
  <div>
<!--    <div>订阅番剧</div>-->
    <el-button @click="func.openSearch">打开搜索</el-button>
<!--    <el-button @click="save">存</el-button>-->
<!--    <el-button @click="load">取</el-button>-->
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {handleData} from "@/assets/js/common";

let list = ref({});
onMounted(() => {
  func.init()
})
const func = {
  init: async () => {

  },
  openSearch: () => {
    window.operate.openWindow({router: 'searchBangumi', name: '搜索番剧', width: 1000, height: 600});
  }
}

let save = () => {
  let a = handleData.saveData("test", [1, 2, 3])
  console.log(a)
}

let load = () => {
  handleData.getData("test").then(res=>{
    console.log(res)
  })
}
</script>

<style scoped>

</style>
