<script setup lang="ts">
import { type PopoverAction } from 'vant'
import { ref } from 'vue'

const showPopover = ref(false)
const actions = ref<PopoverAction[]>([
  {
    text: 'Загрузить изображение',
    icon: 'add-o',
    slug: 'upload-image',
  },
  {
    text: 'Загрузить видео',
    icon: 'video',
    slug: 'upload-video',
  },
])
const emit = defineEmits(['uploadImage', 'uploadVideo'])

const onSelect = (action) => {
  if (action.slug == 'upload-image') {
    emit('uploadImage')
  }

  if (action.slug == 'upload-video') {
    emit('uploadVideo')
  }
  // i18n.global.locale.value = action.text
  // localStorage.setItem('lang', action.text)
}
</script>

<template>
  <van-popover
    v-model:show="showPopover"
    placement="top-end"
    :actions="actions"
    @select="onSelect"
    style="width: 240px;"
  >
    <template #reference>
      <slot name="content"></slot>
    </template>
  </van-popover>
</template>

<style scoped lang="scss">
:deep(.van-popover__action) {
  width: 240px;
}
</style>
