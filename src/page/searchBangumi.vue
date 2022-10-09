<template>
  <div>
    <div>
      <el-input placeholder="输入关键词搜索"></el-input>
    </div>
    <div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="上传时间" width="200">
            <template #default="scope">
              {{scope.row.pubDate[0]}}
            </template>
          </el-table-column>
          <el-table-column prop="date" label="名称" width="500">
            <template #default="scope">
              {{scope.row.title[0]}}
            </template>
          </el-table-column>
          <el-table-column prop="date" label="网站链接" width="180">
            <template #default="scope">
              {{scope.row.link[0]}}
            </template>
          </el-table-column>
          <el-table-column prop="date" label="种子链接" width="180">
            <template #default="scope">
              {{scope.row.pubDate[0]}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>浏览器</div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {convertUTCTimeToLocalTime} from '../../src/assets/js/common'

let resultData = ref({});
let tableData = ref([]);
onMounted(() => {
  func.init()
})
const func = {
  init: async () => {
    window.getData.getList().then(data => {
      let parseString = require('xml2js').parseString;
      parseString(data.data, function (err, result) {
        resultData.value = result;
        if (result
            && result.rss.channel
            && result.rss.channel.length > 0
            && result.rss.channel[0].item
            && result.rss.channel[0].item.length > 0)
          tableData.value = result.rss.channel[0].item;
        console.log(result.rss.channel[0].item[0])
      });
    })
  }
}
</script>

<style scoped>

</style>