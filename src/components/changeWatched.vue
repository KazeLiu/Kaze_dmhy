<template>
  <div class="change-watch">
    <span v-for="item in episodeNumber" :class="watchList.includes(item)?'active':''" class="episodes" :key="item"
          @click="changeSelect(item)">{{ item }}</span>
  </div>
</template>

<script setup>
import {defineProps, onMounted, ref, defineEmits} from "vue"

let prop = defineProps({
  bangumiInfo: {
    episode: Number,
    watchList: []
  }
})
let emit = defineEmits(["changeWatched"])
let episodeNumber = prop.bangumiInfo.episode;
let watchList = prop.bangumiInfo.watchList;
let changeSelect = (number) => {
  let index = watchList.findIndex(x => x == number);
  if (index >= 0) {
    watchList.splice(index, 1);
  } else {
    watchList.push(number)
  }
}
defineExpose({
  watchList,
})
</script>

<style lang="scss">
.change-watch {
  .episodes {
    margin: 0 5px 5px 0;
    border-radius: 6px;
    padding: 3px 6px;
    text-align: center;
    border: 1px solid #23ade5;
    cursor: pointer;
    display: inline-block;
    min-width: 30px;
    transition: all 0.5s;

    &.active {
      background: #23ade5;
      color: #ffffff;
    }
  }

  .episodes:first-child {
    margin-left: 0;
  }
}
</style>