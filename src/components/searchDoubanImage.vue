<template>
  <el-input v-model="imageKey">
    <template #append>
      <el-button @click="searchImage">搜索图片</el-button>
    </template>
  </el-input>
  <div class="search-douban-image-area flex flex-start-start" v-if="imageInfoList.length>0">
    <span :key="item.cover"
          v-for="item in imageInfoList"
          class="flex flex-column flex-center-center"
          @click="emitImageAdd(item.cover)">
       <div class="title">{{ item.title }}</div>
       <el-image fit="cover"
                 :src="item.cover"
                 :title="item.title">
       </el-image>
      <div class="old-title">{{ item.oldTitle }}</div>
    </span>
  </div>
  <div v-else>
    正在从豆瓣抓取数据……
  </div>
</template>

<script setup>
import {computed, defineProps, onMounted, ref, defineEmits} from "vue"

const props = defineProps({word: String})

let imageKey = ref("");
let imageInfoList = ref([]);
let emit = defineEmits(["emitImageAdd"]);
let infoText = ref("");


onMounted(() => {
  imageKey.value = props.word.trim();
  searchImage();
});

let searchImage = () => {
  infoText.value = "正在从豆瓣抓取数据……";
  window.getHttp.getDoubanSearch(imageKey.value).then(data => {
    imageInfoList.value = [];
    let div = document.createElement("div");
    div.innerHTML = data.data;
    let result = div.querySelectorAll('.result');
    if (result.length > 0) {
      result.forEach(item => {
        if (item.querySelector('img')) {
          imageInfoList.value.push({
            cover: item.querySelector('img')?.src,
            title: item.querySelector('.title a')?.innerText,
            oldTitle: item.querySelector('.subject-cast')?.innerText
          })
        }
      })
      if(imageInfoList.value.length>0){
        infoText.value = "展示中……";
      }else{
        infoText.value = "没有搜索到图片，请更换关键词";
      }
    }
  })
}
let emitImageAdd = (url) => {
  emit("emitImageAdd", url)
}
</script>

<style lang="scss">
.search-douban-image-area {
  width: 100%;
  overflow: auto;

  > span {
    margin: 0 10px;
    min-width: 200px;

    > div {
      margin-top: 5px;
    }

    .el-image {
    }
  }
}
</style>