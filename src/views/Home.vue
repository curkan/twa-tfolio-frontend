<script setup lang="ts">
import { useMiniApp, useMainButton } from 'vue-tg'
const UserHeader = defineAsyncComponent(
    () => import("@/components/author/UserHeader.vue")
)

const UserHeaderConsumer = defineAsyncComponent(
    () => import("@/components/consumer/UserHeader.vue")
)

const Grid = defineAsyncComponent(
    () => import("@/components/author/Grid.vue")
)

const GridConsumer = defineAsyncComponent(
    () => import("@/components/consumer/Grid.vue")
)

import { computed, defineAsyncComponent, onMounted, ref, shallowRef, watch } from 'vue'
import {useBackButton} from 'vue-tg/latest';

import { useAppStore } from '@/stores/mainButtonStore'
import { useAuth } from '@/composables/auth/auth'
import UploadFiles from '@/components/author/UploadFiles.vue'
const currentComponentGrid = shallowRef()
const currentComponentHeader = shallowRef()
const backButton = useBackButton()

const headerProps = computed(() => {
  if (currentComponentHeader.value === UserHeaderConsumer) {
    return { userId: useMiniApp().initDataUnsafe.start_param }
  }
  return {}
})

const gridProps = computed(() => {
  if (currentComponentGrid.value === GridConsumer) {
    return { userId: useMiniApp().initDataUnsafe.start_param }
  }

  return {}
})

watch(
  () => useAppStore().currentMode,
  () => {
    if (useAppStore().currentMode === 'author') {
      currentComponentGrid.value = Grid
      currentComponentHeader.value = UserHeader
    }

    if (useAppStore().currentMode === 'cosnumer') {
      currentComponentGrid.value = GridConsumer
      currentComponentHeader.value = UserHeaderConsumer
    }
  },
)

onMounted(async () => {
  backButton.hide()

  useAuth()

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
  <div style="height: 100%; padding: 1em;">
    <UploadFiles />
    <component
      :is="currentComponentHeader"
      v-bind="headerProps"
    ></component>
    <component
      :is="currentComponentGrid"
      v-bind="gridProps"
    ></component>
  </div>
</template>

