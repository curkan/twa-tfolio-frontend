<script setup lang="ts">
import { uploadFiles } from '@/composables/handles/useUploadFiles'
</script>

<template>
  <Transition name="slide-down">
    <div class="upload-images" v-if="uploadFiles.length > 0">
      <van-loading />
      <TransitionGroup>
        <div class="img" v-for="file in uploadFiles" :key="file.upload?.uuid">
          <img :src="file.dataURL" />
        </div>
      </TransitionGroup>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use '@/assets/scss/upload-images.scss';
</style>
