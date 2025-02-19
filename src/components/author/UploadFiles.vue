<script setup lang="ts">
import { uploadFiles } from '@/composables/handles/useUploadFiles'
import {
  uploadVideos,
  uploadVideoProgresses,
  uploadVideoStatuses,
} from '@/composables/handles/useUploadVideo'
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
  <div class="upload-videos" v-if="uploadVideos.length > 0">
    <TransitionGroup>
      <div class="video" v-for="file in uploadVideos" :key="file.upload?.uuid">
        <van-loading />
        <div
          class="progress"
          :data-progress="parseInt(String(uploadVideoProgresses[file.upload?.uuid as string]))"
        ></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/upload-images.scss';
@use '@/assets/scss/upload-videos.scss';
</style>
