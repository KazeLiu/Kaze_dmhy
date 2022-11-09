<template>
  <div class="search-bangumi">
    <div class="search-bangumi-top" ref="searchBangumiTop">
      <el-input
          v-model="form.keyword"
          placeholder="输入或者点击标签快速输入"
      >
        <template #prepend>
          <div class="search-bangumi-top-select">
            <el-select style="width: 140px;" title="category" placeholder="全部分类" v-model="form.sort_id">
              <el-option
                  v-for="item in selectTypeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
              >
              </el-option>
            </el-select>
            <el-select style="width: 140px;" title="category" placeholder="全部字幕组" v-model="form.team_id">
              <el-option
                  v-for="item in selectTeamList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </template>
        <template #append>
          <el-button :icon="Search" @click="func.getResultList"/>
        </template>
      </el-input>
      <div class="tag-area flex flex-row flex-align-center">
        <el-button @click="func.addBangumi">关注本次搜索结果</el-button>
        <div class="tag-area-main">
          <el-tag v-for="item in tagList" @click="func.addTagToInput(item)" closable @close="handleTag.removeTag(item)"
                  :key="item">{{ item }}
          </el-tag>
        </div>
        <el-button @click="func.addTagMsg" :icon="Plus" circle/>
      </div>
    </div>
    <div class="flex flex-row">
      <el-table :data="tableData" v-loading="loadData" :height="hdHeight">
        <el-table-column type="selection" width="55"/>
        <el-table-column label="名称" prop="title" header-align="center"/>
        <el-table-column label="类别" prop="category._" align="center" header-align="center" width="120">
          <template #default="scope">
            <div>{{ scope.row.category["_"] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" header-align="center" align="center" width="160">
          <template #default="scope">
            <div v-html="convertUTCTimeToLocalTime(scope.row.pubDate)"></div>
          </template>
        </el-table-column>
        <el-table-column label="上传者" prop="author" align="center" header-align="center" width="160"/>
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
        <el-table-column label="提取" header-align="center" align="center" width="60">
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
      <get-word :word="allWord"
                v-if="getWordVisible"
                @addTag="handleTag.addTag"
                @search="func.getResultListInWord"
                @close="getWordVisible = false">

      </get-word>
    </el-dialog>
    <el-dialog title="添加关注" v-model="showAddBangumi" :destroy-on-close="true">
      <add-bangumi :is-edit="false" :formData="bangumiInfo" @saveForm="func.saveForm"></add-bangumi>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref, nextTick} from "vue";
import {
  convertUTCTimeToLocalTime,
  getShareRSSList,
  getShareAdvancedSearch,
  handleData
} from '../../src/assets/js/common'
import HtmlToPage from "@/components/htmlToPage";
import AddBangumi from "@/components/changBangumi";
import GetWord from "@/components/getWord";
import {Plus, Search} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute} from "vue-router";

let route = useRoute();
let form = ref({
  sort_id: null,// 分类ID
  team_id: null,//字幕组ID
  keyword: ""
})
let showAddBangumi = ref(false)
let bangumiInfo = ref({})
let resultData = ref([]);
let tableData = ref([]);
let pageHtml = ref("");
let allWord = ref("")
let tagList = ref([])
let searchBangumiTop = ref(null);
let hdHeight = ref(0);
let selectTypeList = ref([]);
let selectTeamList = ref([]);
let loadData = ref(false);

let htmlToPageVisible = ref(false);
let getWordVisible = ref(false);

onMounted(() => {
  if (route.query) {
    form.value = route.query;
  }
  func.init()
})

const func = {
  init: async () => {
    await func.getTagList()
    await func.getShareAdvancedSearch()
    await func.getResultList();
  },
  getResultListInWord(word) {
    func.resetForm();
    form.value.keyword = word;
    func.getResultList();
  },
  // 获取搜索结果
  getResultList() {
    loadData.value = true
    getShareRSSList(form.value).then(({channel, resultData}) => {
      resultData.value = channel;
      tableData.value = resultData;
      loadData.value = false
    })
  },
  // 获取高级分类
  async getShareAdvancedSearch() {
    let {typeList, teamList} = await getShareAdvancedSearch();
    selectTypeList.value = typeList;
    selectTeamList.value = teamList;
  },
  // 获取tag标签
  getTagList() {
    handleData.getData('tagList').then(res => {
      if (res) {
        tagList.value = res
      }
      // 计算表格高度
      func.changeTableHeight();
    });
  },
  // 渲染HTML页面
  getHtml(data) {
    htmlToPageVisible.value = true
    pageHtml.value = data
  },
  // 提取关键字页面
  getWord(data) {
    getWordVisible.value = true
    allWord.value = data
  },
  // 动态计算表格高度
  async changeTableHeight() {
    await nextTick();
    hdHeight.value = window.innerHeight - searchBangumiTop.value.clientHeight - 20;
  },
  // 添加标签弹窗
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
          // ElMessage.error('啥都没有输入')
        })
  },

  // 添加标签到搜索输入框
  addTagToInput(word) {
    form.value.keyword += ` ${word} `
  },
  resetForm() {
    form.value = {
      sort_id: null,// 分类ID
      team_id: null,//字幕组ID
      keyword: ""
    };
  },
  // 将搜索关键词放入关注列表
  addBangumi() {
    if (form.value.keyword.trim().length <= 0) {
      return;
    }
    let formData = {};
    formData.sort = form.value.sort_id;
    formData.team = form.value.team_id;
    formData.name = form.value.keyword.split(' ')[0];
    if (form.value.keyword.split(formData.name).length >= 1) {
      formData.word = form.value.keyword.split(formData.name)[1];
    }

    bangumiInfo.value = formData;
    showAddBangumi.value = true;
  }
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

    .search-bangumi-top-select {
      margin-left: -20px;
      margin-right: -20px;
      margin-top: -1px;

      .el-select {
        margin: 0;
      }
    }

    .tag-area {
      margin: 10px 0;

      .tag-area-main {
        margin-left: 20px;
        max-height: 290px;
        overflow: auto;

        .el-tag {
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }

  }
}


</style>
