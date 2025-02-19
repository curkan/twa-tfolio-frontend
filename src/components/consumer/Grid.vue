<script setup lang="ts">
import { GridStack, type GridStackElement, type GridStackWidget } from 'gridstack'

import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { showImagePreview } from 'vant'
import { gridData, useGetGridData } from '@/composables/grid/useGetGridData'
import { NodeType, type Node } from '@/composables/types/grid.type'
import { useMainPortfolio } from '@/composables/mainButton/useMainPortfolio'
import { useMakeSizeImage } from '@/composables/grid/useMakeSizeImage'
import {useOpenVideo} from '@/composables/handles/useOpenVideo'
const gridFirstLoaded = ref<boolean>(false)
const nodes = ref<Node[]>()

const props = defineProps({
  userId: Number,
})

// DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115
let grid: GridStack | null = null

let items = ref<GridStackWidget[]>([])

useMainPortfolio()

onUnmounted(() => {
  gridData.value = undefined
})

onMounted(async () => {
  grid = GridStack.init({
    float: false,
    staticGrid: true,
    column: 4,
  })
  await useGetGridData(props.userId).then(() => {
    nodes.value = gridData.value?.grid
    nodes.value?.forEach((node: Node) => {
      node.internalId = node.id
      node.id = 'w_' + node.sort
      items.value.push(node as GridStackWidget)

      nextTick(() => {
        grid?.makeWidget(node.id as GridStackElement)
      })
    })

    nextTick(() => {
      gridFirstLoaded.value = true
    })
  })
})

const openImagePreview = (link: string, startPosition: number) => {
  showImagePreview({
    images: gridData.value?.grid.map((a) => a.image.original),
    closeOnClickOverlay: true,
    startPosition: startPosition ?? 1,
    closeable: true,
  })
}

const openVideoPreview = (node: Node) => {
  gridFirstLoaded.value = false
  useOpenVideo(node, [], () => {})
}
</script>

<template>
  <div class="grid-stack">
    <div
      v-if="items.length > 0"
      v-for="(w, index) in items as Node[]"
      class="grid-stack-item"
      :gs-x="w.x"
      :gs-y="w.y"
      :gs-w="w.w"
      :gs-h="w.h"
      :gs-id="w.internalId"
      :internal-id="w.internalId"
      :id="w.id"
      :key="w.id"
    >
      <div class="grid-stack-item-content">
        <div class="img" v-if="w.type == NodeType.image">
          <img
            v-lazy="{ src: useMakeSizeImage(w), delay: 300 }"
            @click="openImagePreview(w.image.original, index)"
          />
        </div>

        <div
          class="img video"
          v-else-if="w.type == NodeType.video"
          @click="openVideoPreview(w)"
        >
          <img
            v-lazy="{ src: useMakeSizeImage(w), delay: 300 }"
          />
          <IconPlay class="icon-play" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="gridFirstLoaded == true && items.length == 0" class="empty-grid">
    <div class="center">
      <div class="header">{{ $t('consumerPortfolio.header') }}</div>
      <div class="text">{{ $t('consumerPortfolio.text') }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/grid.scss';
</style>
