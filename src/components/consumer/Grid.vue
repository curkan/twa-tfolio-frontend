<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed } from 'vue'
import { type GridStackElement, type GridStackWidget } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'

import { type Node } from '@/composables/types/grid.type'
import { useMediaPreview } from '@/composables/grid/useMediaPreview'
import { useGridInitializer } from '@/composables/grid/useGridInitializer'
import { useMainPortfolio } from '@/composables/mainButton/useMainPortfolio'
import GridItem from './GridItem.vue'
import EmptyGridState from './EmptyGridState.vue'
import {useGridDataService} from '@/composables/consumer/useGridDataService'

const props = defineProps({
  userId: Number,
})

const { initializeGrid, destroyGrid, gridInstance } = useGridInitializer()
const { fetchGridData, gridNodes, resetGridData } = useGridDataService()
const { openImagePreview, openVideoPreview } = useMediaPreview()

const gridFirstLoaded = ref<boolean>(false)
const gridItems = ref<GridStackWidget[]>([])

useMainPortfolio()

onUnmounted(() => {
  // resetGridData()
  //
  // nextTick(() => {
  //   destroyGrid()
  // })
})

onMounted(async () => {
  initializeGrid({ column: 4, float: false, staticGrid: true })

  await fetchGridData(props.userId)

  if (gridNodes.value) {
    gridItems.value = transformNodesToWidgets(gridNodes.value)

    nextTick(() => {
      attachWidgetsToGrid(gridItems.value)
      gridFirstLoaded.value = true
    })
  }
})

const transformNodesToWidgets = (nodes: Node[]): GridStackWidget[] => {
  return nodes.map(node => ({
    ...node,
    internalId: node.id,
    id: `w_${node.sort}`
  }))
}

const shouldShowEmptyState = computed(() =>
  gridFirstLoaded.value && gridItems.value.length === 0
)

const attachWidgetsToGrid = (widgets: GridStackWidget[]) => {
  widgets.forEach(widget => {
    nextTick(() => {
      gridInstance.value?.makeWidget(widget.id as GridStackElement)
    })
  })
}
</script>

<template>
  <div class="grid-stack">
    <GridItem
      v-for="(item, index) in gridItems"
      :key="item.id"
      :item="item"
      :index="index"
      @image-click="openImagePreview"
      @video-click="openVideoPreview"
    />
  </div>

  <EmptyGridState v-if="shouldShowEmptyState" />
</template>

<style scoped lang="scss">
@use '@/assets/scss/grid.scss';
</style>
