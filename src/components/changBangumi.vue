<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="关注番剧名" placeholder="番剧名称信息，图片搜索将默认带上">
        <el-input v-model="form.name">
        </el-input>
      </el-form-item>
      <el-form-item label="辅助搜索词"  placeholder="辅助关键词，比如1080p，简日等">
        <el-input v-model="form.word">
        </el-input>
        <div>
          <el-tag v-for="item in tagList" style="cursor: pointer;margin-right: 5px" @click="addTagToInput(item)"
                  :key="item">{{ item }}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="封面URL地址">
        <div class="add-bangumi-image-select flex flex-column flex-start-center">
          <el-input v-model="form.cover" placeholder="输入URL地址">
            <template #append>
              <el-button @click="searchImage">根据关键词查找图片</el-button>
            </template>
          </el-input>
          <el-image fit="contain" v-show="form.cover" :src="form.cover">
            <template #error>
              图片加载失败
            </template>
          </el-image>
        </div>
      </el-form-item>
      <el-form-item label="一共多少集">
        <el-input-number v-model="form.episode" :min="1" placeholder="默认12集"></el-input-number>
      </el-form-item>
      <el-form-item label="字幕组">
        <el-select placeholder="全部字幕组" v-model="form.team">
          <el-option
              v-for="item in selectTeamList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select placeholder="全部分类" v-model="form.sort">
          <el-option
              v-for="item in selectTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ prop.formData.name ? "修改" : "添加" }}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :destroy-on-close="true" :append-to-body="true" v-model="showSearchWord" title="可选图片">
      <search-douban-image :word="form.name" @emitImageAdd="emitImageAdd"></search-douban-image>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref, defineEmits, defineProps} from "vue";
import {getShareAdvancedSearch, handleData} from "@/assets/js/common";
import SearchDoubanImage from "@/components/searchDoubanImage";
import {ElMessage} from "element-plus";

onMounted(async () => {
  await getTagList()
  let {typeList, teamList} = await getShareAdvancedSearch()
  selectTypeList.value = typeList;
  selectTeamList.value = teamList;
  if (prop.formData.name) {
    form.value = prop.formData;
  }
})

let prop = defineProps({formData: Object})
let emit = defineEmits(["saveForm"])
let tagList = ref([])
let form = ref({
  name: null,
  episode: 12,
  watchList: [],// 已经看了多少集
  team: null,
  cover: null,
  sort: null,
  index: 0,
  allCount: 0,// 查询到的全部列表
  newId: "",// 使用链接作为唯一ID判断最新的一条与在线列表对比
  newInfo: null, // 最新一条的内容
  newCount: 0 // 对比的条数
});
let selectTypeList = ref([]);
let selectTeamList = ref([]);
let showSearchWord = ref(false);

let onSubmit = async () => {
  let data = await handleData.getData('loveList');
  if(!form.value.episode){
    form.value.episode = 12
  }
  if (data) {
    // 查询是否有同名
    if (data.findIndex(x => x.name == form.value.name) >= 0 && !prop.formData.name) {
      ElMessage.error('检索到列表内包含同名剧集');
      return
    }
    let index = data.findIndex(x => x.name == prop.formData.name);
    if (index >= 0) {
      data[index] = form.value;
    } else {
      form.value.index = data.length;
      data.push(form.value);
    }
  } else {
    form.value.index = 0;
    data = [form.value];
  }
  await handleData.saveData('loveList', data)
  emit("saveForm");
}

let searchImage = () => {
  showSearchWord.value = true;
}

let emitImageAdd = (url) => {
  form.value.cover = url;
  showSearchWord.value = false;
}
let getTagList = () => {
  handleData.getData('tagList').then(res => {
    if (res) {
      tagList.value = res
    }
  });
}

// 添加标签到搜索输入框
let addTagToInput = (word) => {
  form.value.name += ` ${word} `;
}
</script>

<style lang="scss">
.add-bangumi-image-select {
  .el-image {
    margin-top: 10px;
    height: 100px;
    width: 100%;
  }
}
</style>