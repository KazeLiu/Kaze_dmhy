<template>
  <div v-html="html"></div>
</template>

<script setup>
import {ref,defineProps} from "vue";

let html = ref("");
const props = defineProps(['html'])

</script>

<style scoped>

</style>