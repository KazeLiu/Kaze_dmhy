<template>
  <div class="home">
    <div class="flex flex-between-center">
      <span>已关注剧集</span>
      <el-button @click="func.openChangeLoveList(true)">添加关注</el-button>
      <el-button @click="func.checkUpData()">检查更新</el-button>
    </div>
    <el-table :data="listData">
      <el-table-column label="封面" width="120" align="center" header-align="center">
        <template #default="scope">
          <el-image fit="contain" style="height: 100px" :src="scope.row.cover"/>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="名称/关键字" prop="name"></el-table-column>
      <el-table-column align="center" width="60" header-align="center" label="集数" prop="episode"></el-table-column>
      <el-table-column align="center" width="130" header-align="center" label="字幕组">
        <template #default="scope">
          {{ func.findTeam(scope.row.team) }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" header-align="center" label="类别">
        <template #default="scope">
          {{ func.findType(scope.row.sort) }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" header-align="center" label="最新一条">
        <template #default="scope">
          <el-popover
              v-if="scope.row.newInfo"
              placement="top-start"
              title="最新一条标题"
              :width="200"
              trigger="hover"
          >
            {{ scope.row.newInfo.title }}
            <br/>
            <el-button>下载</el-button>
            <template #reference>
              <el-button>查看</el-button>
            </template>
          </el-popover>
          <div v-else>
            当前关键词暂无数据，我们会关注更新
          </div>
        </template>
      </el-table-column>
      <el-table-column label="已观看集数" width="120" align="center" header-align="center">
        <template #default="scope">
          <el-button link @click="func.showChangeWatch(scope.row)">
            已观看{{ scope.row.watchList ? scope.row.watchList.length : 0 }}集
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" width="60" header-align="center" label="搜索">
        <template #default="scope">
          <el-button @click="func.toSearch(scope.row)">
            <el-icon>
              <Search/>
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" header-align="center" prop="name">
        <template #default="scope">
          <el-button link @click="func.changeLoveList(scope.row)">
            <el-icon>
              <Edit/>
            </el-icon>
          </el-button>
          <el-button link @click="func.removeLoveList(scope.row.name)">
            <el-icon>
              <Delete/>
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加关注的剧" v-model="showAddBangumi" :destroy-on-close="true">
      <add-bangumi :formData="bangumiInfo" @saveForm="func.saveForm"></add-bangumi>
    </el-dialog>
    <el-dialog title="点亮已经看完的剧集" @close="func.getWatchNumber" v-model="showWatchNumber"
               :destroy-on-close="true">
      <change-watched ref="changeWatchedComponents" :bangumiInfo="bangumiInfo"></change-watched>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getMoreShareRSSList, getShareAdvancedSearch, getShareRSSList, handleData} from "@/assets/js/common";
import AddBangumi from "@/components/changBangumi";
import ChangeWatched from "@/components/changeWatched";
import {useRouter} from "vue-router";

const router = useRouter()
let listData = ref([]);
let showAddBangumi = ref(false);
let selectTypeList = ref([])
let selectTeamList = ref([])
let bangumiInfo = ref({}) // 当前选中的剧

let showWatchNumber = ref(false)

let changeWatchedComponents = ref(null);

onMounted(async () => {
  await func.getShareAdvancedSearch();
  await func.getTable();
})
const func = {
  // 打开调整番剧数据的窗口
  openChangeLoveList: (clear) => {
    if (clear) {
      bangumiInfo.value = {};
    }
    showAddBangumi.value = true
  },
  // 调整关注番剧
  changeLoveList: (data) => {
    bangumiInfo.value = data;
    func.openChangeLoveList()
  },
  // 删除关注番剧
  removeLoveList: async (name) => {
    let temp = await handleData.getData('loveList');
    temp = temp.filter(x => x.name != name);
    await handleData.saveData('loveList', temp);
    await func.getTable()
  },
  // 保存番剧数据后回调
  saveForm: () => {
    showAddBangumi.value = false;
    func.getTable();
  },
  // 获取列表
  getTable: async () => {
    let temp = await handleData.getData('loveList');
    console.log(temp)
    if (temp && temp.length > 0) {
      listData.value = temp
    }
  },
  // 展示调整观看数据的页面
  showChangeWatch(data) {
    bangumiInfo.value = data;
    showWatchNumber.value = true;
  },
  // 快速搜索
  toSearch(data) {
    debugger
    router.push({
      name: "searchBangumi",
      query: {
        keyword: data.name + ' ' + data.word,
        team_id: data.team,
        sort_id: data.sort
      }
    })
  },
  async getWatchNumber() {
    let watchList = changeWatchedComponents.value.watchList;
    let loveList = await handleData.getData('loveList');
    let data = loveList.find(x => x.name == bangumiInfo.value.name)
    data.watchList = watchList;
    await handleData.saveData('loveList', loveList);
    await func.getTable();
  },
  // 获取高级分类
  getShareAdvancedSearch: async () => {
    let {typeList, teamList} = await getShareAdvancedSearch();
    selectTypeList.value = typeList;
    selectTeamList.value = teamList;
  },
  // 寻找类别
  findType: (id) => {
    if (id) {
      let temp = selectTypeList.value.find(x => x.id == id)
      if (temp) {
        return temp.label;
      }
      return id;
    } else {
      return "全部"
    }
  },
  // 寻找字幕组
  findTeam: (id) => {
    if (id) {
      let temp = selectTeamList.value.find(x => x.id == id)
      if (temp) {
        return temp.label;
      }
      return id;
    } else {
      return "全部"
    }
  },
  checkUpData: async () => {
    listData.value.forEach(data => {
      data.hasNew = false;
      getShareRSSList({
        keyword: data.name + ' ' + data.word,
        team_id: data.team,
        sort_id: data.sort
      }).then(({channel, resultData}) => {
        if (resultData.length > 0) {
          data.newId = resultData[0].link // 最新一条的数据 以网址作为ID
          data.newInfo = resultData[0];
        }
        // 检查如果有newId 则在结果中查找是否有包含的ID 然后计算多出来的数据
        if (data.newId && resultData.length > 0) {
          data.newCount = resultData.findIndex(x => x.link == data.newId);
        } else {
          data.newCount = 0
        }
        data.hasNew = true;  // 表示已经更新过
        data.update = new Date() // 更新时间
        data.allCount = resultData.length // 一共查询到的结果
        handleData.saveData('loveList', listData.value);
      })
    });
  }
}


</script>

<style lang="scss">
.home {
  padding-top: 10px;
}
</style>
