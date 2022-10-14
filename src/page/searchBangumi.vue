<template>
  <div class="search-bangumi">
    <div class="search-bangumi-top" ref="searchBangumiTop">
      <el-input
          v-model="searchKey"
          placeholder="输入或者点击tag快速输入"
      >
        <template #prepend>
          <el-select style="width: 200px;" title="category" placeholder="你也可以不选择类别" v-model="categoryId">
            <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
            >
              <div class="category-select" :class="item.isTop?'is-big':''">
                <span class="category-option-left">{{ item.directions }}</span>
                <span class="category-option-right">{{ item.chinese }}</span>
              </div>
            </el-option>
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" @click="search"/>
        </template>
      </el-input>
      <div class="tag-area flex flex-row">
        <div class="tag-area-main">
          <el-tag v-for="item in tagList" @click="func.addTagToInput(item)" closable @close="handleTag.removeTag(item)"
                  :key="item">{{ item }}
          </el-tag>
        </div>
        <el-button @click="func.addTagMsg" :icon="Plus" circle/>
        <el-button @click="handleTag.removeAllTag">清空</el-button>
      </div>
    </div>
    <div class="flex flex-row">
      <el-table :data="tableData" :height="hdHeight">
        <el-table-column type="selection" width="55"/>
        <el-table-column label="上传时间" header-align="center" align="center" width="160">
          <template #default="scope">
            <div v-html="convertUTCTimeToLocalTime(scope.row.pubDate)"></div>
          </template>
        </el-table-column>
        <el-table-column label="类别" prop="nyaa:categoryId" header-align="center" width="60"/>
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
        <el-table-column label="提取" header-align="center" align="center" width="100">
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
    <el-dialog v-model="htmlToPageVisible" title="页面查看">
      <html-to-page :html="pageHtml"></html-to-page>
    </el-dialog>
    <el-dialog v-model="getWordVisible" title="快速添加关键词">
      <get-word :word="allWord" v-if="getWordVisible" @addTag="handleTag.addTag"></get-word>
    </el-dialog>

  </div>
</template>

<script setup>
import {onMounted, ref, nextTick} from "vue";
import {convertUTCTimeToLocalTime, handleData} from '../../src/assets/js/common'
import HtmlToPage from "@/components/htmlToPage";
import GetWord from "@/components/getWord";
import {Plus, Search} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {categoryList} from "@/assets/js/constant"

let searchKey = ref("");
let categoryId = ref("");
let resultData = ref([]);
let tableData = ref([]);
let pageHtml = ref("");
let allWord = ref("")
let tagList = ref([])
let searchBangumiTop = ref(null);
let hdHeight = ref(0);

let htmlToPageVisible = ref(false);
let getWordVisible = ref(false);

onMounted(() => {
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
    });
    func.getTagList()
  },
  getTagList() {
    handleData.getData('tagList').then(res => {
      tagList.value = res
      // 计算表格高度
      func.changeTableHeight();
    });
  },
  getHtml(data) {
    htmlToPageVisible.value = true
    pageHtml.value = data
  },
  getWord(data) {
    getWordVisible.value = true
    allWord.value = data
  },
  async changeTableHeight() {
    await nextTick();
    hdHeight.value = window.innerHeight - searchBangumiTop.value.clientHeight - 20;
  },
  addTagMsg() {
    ElMessageBox.prompt('后续直接点击标签即可输入到搜索框', '添加关键词', {
      confirmButtonText: '添加',
      cancelButtonText: '取消',
      inputPattern:
          /\S/,
      inputErrorMessage: '至少打个空格吧',
    })
        .then(({value}) => {
          handleTag.addTag(value);
          ElMessage.success(`已添加tag: ${value}`)
        })
        .catch((e) => {
          ElMessage.error('啥都没有输入')
        })
  },
  addTagToInput(word) {
    searchKey.value += `${word} `
  },
  search(){

  },
}

const handleTag = {
  addTag(value) {
    tagList.value.push(value);
    handleData.saveData('tagList', tagList.value, 'array')
  },
  removeTag(value) {
    tagList.value = tagList.value.filter(x => x != value);
    handleData.saveData('tagList', tagList.value, 'array')
  },
  removeAllTag() {
    handleData.removeData('tagList').then(_ => {
      func.getTagList();
    });
  },
}
</script>

<style lang="scss">
.search-bangumi {
  padding-top: 10px;

  .search-bangumi-top {

    .tag-area {
      margin: 10px 0;

      .tag-area-main {
        max-height: 290px;
        overflow: auto;

        .el-tag {
          margin-right: 10px;
          cursor: pointer;
          margin-bottom: 10px;
        }
      }
    }

    .category-select {
      &.is-big {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          background: var(--el-text-color-secondary);;
        }

        .category-option-left, .category-option-right {
          font-size: 18px;
        }
      }

      .category-option-left {
        float: left;
      }

      .category-option-right {
        float: right;
        color: var(--el-text-color-secondary);
        font-size: 13px;
      }
    }

  }
}


</style>
