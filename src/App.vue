<script setup lang="ts">
import { ref } from 'vue'
import Grid from './components/Grid.vue'
import UserHeader from './components/UserHeader.vue'
import { useWebAppMainButton } from 'vue-tg'
import UploadFiles from './components/UploadFiles.vue'

useWebAppMainButton().setMainButtonParams({
  color: '#2C2C2C',
  has_shine_effect: false,
})
</script>

<template>
  <van-config-provider theme="dark" />
  <UploadFiles />
  <UserHeader />
  <Grid />
</template>

<style scoped lang="scss"></style>
