<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="番剧关键词">
      <el-input v-model="form.name" placeholder="可填可选"></el-input>
    </el-form-item>
    <el-form-item label="一共多少集">
      <el-input-number v-model="form.episode" placeholder="默认12集"></el-input-number>
    </el-form-item>
    <el-form-item label="字幕组">
      <el-select placeholder="可填可选" v-model="form.team"></el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">添加</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {ref} from "vue";

let form = ref({
  name: null,
  episode: null,
  team: null
});
let onSubmit = () => {

}
</script>

<style scoped>

</style>