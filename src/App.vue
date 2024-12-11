<script setup lang="ts">
import { useWebApp, useWebAppMainButton } from 'vue-tg'
import UploadFiles from './components/author/UploadFiles.vue'
import UserHeader from './components/author/UserHeader.vue'
import UserHeaderConsumer from './components/consumer/UserHeader.vue'
import { onMounted, ref, shallowRef, watch } from 'vue'

import Grid from './components/author/Grid.vue'
import GridConsumer from './components/consumer/Grid.vue'
import { useAppStore } from './stores/mainButtonStore'
import { useAuth } from './composables/auth/auth'
const currentComponentGrid = shallowRef()
const currentComponentHeader = shallowRef()

watch(
  () => useAppStore().currentMode,
  () => {
    if (useAppStore().currentMode == 'author') {
      currentComponentGrid.value = Grid
      currentComponentHeader.value = UserHeader
    }

    if (useAppStore().currentMode == 'cosnumer') {
      currentComponentGrid.value = GridConsumer
      currentComponentHeader.value = UserHeaderConsumer
    }
  },
)

onMounted(async () => {
  await useAuth()

  if (useWebApp().initDataUnsafe.start_param) {
    useAppStore().currentMode = 'consumer'
    currentComponentGrid.value = GridConsumer
    currentComponentHeader.value = UserHeaderConsumer
  } else {
    useAppStore().currentMode = 'author'
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
  <component
    :is="currentComponentHeader"
    :user-id="useWebApp().initDataUnsafe.start_param"
  ></component>
  <component
    :is="currentComponentGrid"
    :user-id="useWebApp().initDataUnsafe.start_param"
  ></component>
</template>

<style scoped lang="scss"></style>
