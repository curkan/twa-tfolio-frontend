<script setup lang="ts">
import router from '@/router';
import Vlitejs from 'vlitejs';
import {onMounted} from 'vue';
import {useBackButton, useMiniApp} from 'vue-tg/latest';

const backButton = useBackButton()
const miniApp = useMiniApp()

backButton.show()
backButton.onClick(() => {
  backButton.hide()
  router.push('/')
})

onMounted(() => {
  new Vlitejs(document.querySelector('#player'));
})

const doSwipeRight = () => {
  router.push('/')
};

</script>
<template>
  <div v-touch:swipe.right="doSwipeRight" style="height: 100%;">
    <video id="player" src="/videos/test_goga.mp4"></video>
  </div>
</template>

