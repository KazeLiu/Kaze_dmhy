<template>
  <div>
    <div>
      <el-input placeholder="输入关键词搜索"></el-input>
    </div>
    <div>tag</div>
    <div>
      <el-button>搜索</el-button>
      <el-button>关闭</el-button>
    </div>
    <div class="flex flex-row">
      <el-table :data="tableData">
        <el-table-column type="selection" width="55"/>
        <el-table-column label="上传时间" header-align="center" align="center" width="110">
          <template #default="scope">
            <div v-html="convertUTCTimeToLocalTime(scope.row.pubDate)"></div>
          </template>
        </el-table-column>
        <el-table-column label="类别" prop="nyaa:category" header-align="center" width="60"/>
        <el-table-column label="名称" prop="title" header-align="center"/>
        <el-table-column label="大小" prop="nyaa:size" header-align="center" align="center" width="100"/>
        <el-table-column label="链接" header-align="center" align="center" width="60">
          <template #default="scope">
            <el-button size="small" @click="func.toLink(scope.row.link[0])">
              <el-icon>
                <Paperclip/>
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="种子" header-align="center" align="center" width="60">
          <template #default="scope">
            <el-button size="small" @click="func.toLink(scope.row.enclosure[0].$.url)">
              <el-icon>
                <Download/>
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="关键词提取" header-align="center" align="center" width="100">
          <!--跳转到添加-->
          <template #default="scope">
            <el-button size="small" @click="func.getWord(scope.row.title)">
              <el-icon>
                <Notebook/>
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {convertUTCTimeToLocalTime} from '../../src/assets/js/common'

let resultData = ref({});
let tableData = ref([]);
let pageHtml = ref("");

onMounted(() => {
  console.log('onMounted')
  func.init()
})
const func = {
  init: async () => {
    window.getData.getList().then(data => {
      let parseString = require('xml2js').parseString;
      parseString(data.data, {explicitArray: false}, function (err, result) {
        resultData.value = result.rss.channel;
        if (result
            && result.rss.channel
            && result.rss.channel.item
            && result.rss.channel.item.length > 0)
          tableData.value = result.rss.channel.item;
      });
    })
  },
  toLink(url) {
    if (url) {
      window.open(url);
    } else {
      alert("有问题")
    }
  },
  getHtml(data) {
    pageHtml.value = data;
  },
  getWord(word) {
    window.operate.openWindow({router: 'getWord', name: '提取关键词', width: 400, height: 400, data: word});
  },

}
</script>

<style scoped>

</style>