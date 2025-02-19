<script setup lang="ts">
import { uploadFiles } from '@/composables/handles/useUploadFiles'
import {uploadVideo, uploadVideoProgress, uploadVideoStatus} from '@/composables/handles/useUploadVideo';
</script>

<template>
  <Transition name="slide-down">
    <div class="upload-images" v-if="uploadFiles.length > 0 || uploadVideo">
      <van-loading />
      <TransitionGroup>
        <div class="img" v-for="file in uploadFiles" :key="file.upload?.uuid">
          <img :src="file.dataURL" />
        </div>
      </TransitionGroup>
      <div class="upload-images" v-if="uploadVideo">
        <van-loading />
        <div class="progress" :data-progress="parseInt(Number(uploadVideoProgress))"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use '@/assets/scss/upload-images.scss';
</style>
