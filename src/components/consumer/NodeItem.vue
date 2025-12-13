<script setup lang="ts">
import { NodeType, type Node } from '@/composables/types/grid.type'
import NodeTop from '../node/NodeTop.vue';
import ImageViewer from '../node/ImageViewer.vue';
import NodeBottom from '../node/NodeBottom.vue';
import {useNodeStore} from '@/stores/useNodeStore';
import {useLikeNode} from '@/composables/author/node/useLikeNode';

const handleDoubleTap = () => {
  if (useNodeStore().currentNode?.meta.is_liked === false) {
    useLikeNode(Number(props.item.id)).then((data) => {
      useNodeStore().currentNode = data.data as Node
    }).finally(() => {

    })
  }
}

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
    <NodeTop class="w-full" :user="item.user"/>
    <div class="node-item-content">
      <template v-if="item.type === NodeType.image">
        <div class="img">
          <ImageViewer :image-src="item.image.original" @double-click="handleDoubleTap"/>
        </div>
      </template>
      <template v-if="item.type === NodeType.video">
        <div class="img">
          <ImageViewer :video-src="item.video_url" @double-click="handleDoubleTap"/>
        </div>
      </template>
    </div>
    <NodeBottom class="w-full" :node="item" :user="item.user"/>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-item.scss';
</style>
