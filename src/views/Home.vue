<script setup lang="ts">
import { useMiniApp, useMainButton } from 'vue-tg'
import UserHeader from '@/components/author/UserHeader.vue'
import UserHeaderConsumer from '@/components/consumer/UserHeader.vue'
import { onMounted, ref, shallowRef, watch } from 'vue'
import {useBackButton} from 'vue-tg/latest';


import Grid from '@/components/author/Grid.vue'
import GridConsumer from '@/components/consumer/Grid.vue'
import { useAppStore } from '@/stores/mainButtonStore'
import { useAuth } from '@/composables/auth/auth'
import UploadFiles from '@/components/author/UploadFiles.vue'
const currentComponentGrid = shallowRef()
const currentComponentHeader = shallowRef()
const backButton = useBackButton()

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
  backButton.hide()

  await useAuth()

  if (useMiniApp().initDataUnsafe.start_param) {
    useAppStore().currentMode = 'consumer'
    currentComponentGrid.value = GridConsumer
    currentComponentHeader.value = UserHeaderConsumer
  } else {
    useAppStore().currentMode = 'author'
    currentComponentGrid.value = Grid
    currentComponentHeader.value = UserHeader
  }
})

useMainButton().setParams({
  color: '#2C2C2C',
  has_shine_effect: false,
})

window.Telegram.WebApp.setHeaderColor('#212121')
window.Telegram.WebApp.setBackgroundColor('#212121')
window.Telegram.WebApp.setBottomBarColor('#212121')
window.Telegram.WebApp.setBottomBarColor('#212121')
window.Telegram.WebApp.expand()

const miniApp = useMiniApp()

if (miniApp.isVersionAtLeast('8.0')) {
//or if (window.Telegram.WebApp.isVersionAtLeast('8.0')) {
  window.Telegram.WebApp.requestFullscreen()
}
</script>

<template>
  <div style="height: 100%;">
    <UploadFiles />
    <component
      :is="currentComponentHeader"
      :user-id="useMiniApp().initDataUnsafe.start_param"
    ></component>
    <component
      :is="currentComponentGrid"
      :user-id="useMiniApp().initDataUnsafe.start_param"
    ></component>
  </div>
</template>

