<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="关注关键词">
        <el-input v-model="form.name" :readonly="prop.formData.name">
        </el-input>
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
  let {typeList, teamList} = await getShareAdvancedSearch()
  selectTypeList.value = typeList;
  selectTeamList.value = teamList;
  if (prop.formData.name) {
    form.value = prop.formData;
  }
})

let prop = defineProps({formData: Object})
let emit = defineEmits(["saveForm"])
let form = ref({
  name: null,
  episode: 12,
  watched: null,// 已经看了多少集
  team: null,
  cover: null,
  sort: null,
  index: 0
});
let selectTypeList = ref([]);
let selectTeamList = ref([]);
let showSearchWord = ref(false);

let onSubmit = async () => {
  let data = await handleData.getData('loveList');
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