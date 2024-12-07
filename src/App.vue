<script setup lang="ts">
import { useWebApp, useWebAppMainButton } from 'vue-tg'
import UploadFiles from './components/author/UploadFiles.vue';
import UserHeader from './components/author/UserHeader.vue';
import UserHeaderConsumer from './components/consumer/UserHeader.vue';
import {onMounted, ref, shallowRef} from 'vue';

import Grid from './components/author/Grid.vue';
import GridConsumer from './components/consumer/Grid.vue';
const currentComponentGrid = shallowRef()
const currentComponentHeader = shallowRef()

onMounted(() => {
  if (useWebApp().initDataUnsafe.start_param) {
    currentComponentGrid.value = GridConsumer
    currentComponentHeader.value = UserHeaderConsumer
  } else {
    currentComponentGrid.value = Grid
    currentComponentHeader.value = UserHeader
  }
})

useWebAppMainButton().setMainButtonParams({
  color: '#2C2C2C',
  has_shine_effect: false,
})

window.Telegram.WebApp.setHeaderColor('#212121')
window.Telegram.WebApp.setBackgroundColor('#212121')
window.Telegram.WebApp.setBottomBarColor('#212121')
window.Telegram.WebApp.setBottomBarColor('#212121')
window.Telegram.WebApp.expand()

if (window.Telegram.WebApp.isVersionAtLeast('8.0')) {
  window.Telegram.WebApp.requestFullscreen()
}
</script>

<template>
  <van-config-provider theme="dark" />
  <UploadFiles />
  <component :is="currentComponentHeader" :user-id="useWebApp().initDataUnsafe.start_param"></component>
  <component :is="currentComponentGrid" :user-id="useWebApp().initDataUnsafe.start_param"></component>
</template>

<style scoped lang="scss"></style>
