<template>
  <div>
    <div v-text="wordList"></div>
    <el-button style="margin-top: 20px" @click="addTag">将选中文字添加到词库</el-button>
    <el-button style="margin-top: 20px" @click="search">直接搜索该词</el-button>
  </div>
</template>

<script setup>
import {ElMessage} from 'element-plus'
import {ref, defineProps,defineEmits} from "vue";
import {handleData} from "@/assets/js/common";

let textarea = ref("");
const emit = defineEmits(["addTag",'search','close']);

const props = defineProps({
  word: {
    type: String,
    required: true
  }
})
let wordList = ref(props.word);

let addTag = () => {
  let selecter = window.getSelection().toString();
  if (selecter != null && selecter.trim() != "") {
    emit('addTag',selecter);
    ElMessage.success(`已添加tag: ${selecter}`)
  } else {
    ElMessage.error('没有获取到文字')
  }
}
let search = ()=>{
  debugger
  let selecter = window.getSelection().toString();
  if (selecter != null && selecter.trim() != "") {
    emit('search',selecter);
    emit('close');
  }
}
</script>

<style scoped>

</style>
