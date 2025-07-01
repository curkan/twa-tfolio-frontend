<script setup lang="ts">
import { NodeType, type Node } from '@/composables/types/grid.type'
import { useMakeSizeImage } from '@/composables/grid/useMakeSizeImage'

const props = defineProps({
  item: {
    type: Object as () => Node,
    required: true
  },
  index: {
    type: Number
  },
  showRemove: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['remove', 'image-click', 'video-click'])

const handleImageClick = () => {
  emit('image-click', props.item)
}

const handleVideoClick = () => {
  emit('video-click', props.item)
}
</script>

<template>
  <div
    class="grid-stack-item"
    :gs-x="item.x"
    :gs-y="item.y"
    :gs-w="item.w"
    :gs-h="item.h"
    :gs-id="item.internalId"
    :internal-id="item.internalId"
    :id="String(item.id)"
  >
    <div class="grid-stack-item-content">
      <template v-if="item.type === NodeType.image">
        <div class="img" @click="handleImageClick">
          <img v-lazy="{ src: useMakeSizeImage(item), delay: 300 }" />
        </div>
      </template>

      <template v-else-if="item.type === NodeType.video">
        <div class="img video" @click="handleVideoClick">
          <img v-lazy="{ src: useMakeSizeImage(item), delay: 300 }" />
          <IconPlay class="icon-play" />
        </div>
      </template>

      <button v-if="showRemove" class="ui-remove" @click.stop="emit('remove', item)">
        <IconRemove />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/grid.scss';
</style>
