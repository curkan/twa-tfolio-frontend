<script setup lang="ts">
import {useMiniApp} from 'vue-tg';
import {useViewportStore} from './composables/stores/useViewportStore';

function isTelegramWebApp() {
    return typeof window.Telegram !== 'undefined' &&
           typeof window.Telegram.WebApp !== 'undefined' &&
           window.Telegram.WebApp.initData !== ''; // Доп. проверка, что WebApp инициализирован
}

try {
  if (isTelegramWebApp()) {
    useViewportStore().isTelegramApp = true
  } else {
    useViewportStore().isTelegramApp = false
  }
} catch (e) {
  console.log(e)
  useViewportStore().isTelegramApp = false
}
// useMiniApp().initDataUnsafe.start_param = '917910145'
// useMiniApp().initDataUnsafe.start_param = '443472294'
</script>

<template>
  <van-config-provider theme="dark" />
  <router-view v-slot="{ Component }">
    <transition name="slide-fade" mode="out-in">
      <component :key="$route.path" :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
</style>
