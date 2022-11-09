<template>
  <div class="flex flex-row flex-between-center">
    <meta name="referrer" content="no-referrer" />
    <div class="home-menu flex flex-column flex-center-center" v-if="showMenu">
      <div class="flex flex-column flex-center-center home-menu-once" v-for="item in menuList" :key="item.name"
           @click="toLink(item.router)">
        <el-icon :size="26">
          <component :is="item.icon"/>
        </el-icon>
        {{ item.name }}
      </div>
    </div>
    <div class="home-router">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

let showMenu = ref(false)

let menuList = ref([{
  name: '关注',
  icon: 'Star',
  router: '/'
}, {
  name: '搜索',
  icon: 'Monitor',
  router: '/searchBangumi'
}]);

onMounted(() => {
  const route = useRoute()
  if (route.params.showMenu == false) {
    showMenu.value = false;
  } else {
    showMenu.value = true;
  }
})

const router = useRouter()
let toLink = (url) => {
  router.push(url)
}
</script>

<style lang="scss">
.home-menu {
  width: 100px;
  height: 100vh;
  background: #23ade5;
  margin-right: 6px;

  .home-menu-once {
    color: #ffffff;
    margin: 10px auto;
    font-size: 22px;
    border: 1px solid #ffffff;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;

    i {
      margin-bottom: 3px;
    }
  }
}

.home-router {
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding: 0 10px;
}
</style>
