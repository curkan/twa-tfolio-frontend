<script setup lang="ts">
import { NodeType, type Node } from '@/composables/types/grid.type'
import NodeTop from '../node/NodeTop.vue';
import ImageViewer from '../node/ImageViewer.vue';
import NodeBottom from '../node/NodeBottom.vue';

const props = defineProps({
  item: {
    type: Object as () => Node,
    required: true
  },
})
</script>

<template>
  <div
    class="node-item w-full"
  >
    <NodeTop class="w-full"/>
    <div class="node-item-content">
      <template v-if="item.type === NodeType.image">
        <div class="img">
          <ImageViewer :image-src="item.image.original"/>
        </div>
      </template>
      <template v-if="item.type === NodeType.video">
        <div class="img">
          <ImageViewer :video-src="item.video_url"/>
        </div>
      </template>
    </div>
    <NodeBottom class="w-full"/>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-item.scss';
</style>
