<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed } from 'vue'
import { type GridStackElement, type GridStackWidget } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { useHapticFeedback } from 'vue-tg/latest'

import { type Node } from '@/composables/types/grid.type'
import { useMediaPreview } from '@/composables/grid/useMediaPreview'
import { useGridInitializer } from '@/composables/grid/useGridInitializer'
import { useMainPortfolio } from '@/composables/mainButton/useMainPortfolio'
import GridItem from './GridItem.vue'
import EmptyGridState from './EmptyGridState.vue'
import {useGridDataService} from '@/composables/consumer/useGridDataService'
import {useNodeStore} from '@/stores/useNodeStore'

const props = defineProps({
  userId: Number,
})

const { initializeGrid, destroyGrid, gridInstance } = useGridInitializer()
const { fetchGridData, gridNodes, resetGridData } = useGridDataService()
const { openImagePreview, openVideoPreview } = useMediaPreview()

const gridFirstLoaded = ref<boolean>(false)
const gridItems = ref<GridStackWidget[]>([])
const clickedStates = ref<Record<number, boolean>>({});
const haptic = useHapticFeedback()

useMainPortfolio()

onUnmounted(() => {
  // resetGridData()
  //
  // nextTick(() => {
  //   destroyGrid()
  // })
})

onMounted(async () => {
  initializeGrid({margin: '5px', column: 4, float: false, staticGrid: true })

  await fetchGridData(props.userId)

  if (gridNodes.value) {
    gridItems.value = transformNodesToWidgets(gridNodes.value)

    nextTick(() => {
      attachWidgetsToGrid(gridItems.value)
      gridFirstLoaded.value = true
    })
  }

  if (useNodeStore().currentNode) {
      const targetElement = document.querySelector(`[internal-id="${useNodeStore().currentNode?.internalId}"]`);
      nextTick(() => {
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' }); // Optional: add smooth scrolling
        }
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

function handleItemTouch(e: Event, index: number) {
  clickedStates.value[index] = true;
  haptic.impactOccurred('light')

  setTimeout(() => {
    clickedStates.value[index] = false;
  }, 200);
}
</script>

<template>
  <div class="grid-stack">
    <GridItem
      v-for="(item, index) in gridItems"
      :key="item.id"
      :item="item"
      :index="index"
      @touch="(e: Event) => handleItemTouch(e, index)"
      @click="(e: Event) => handleItemTouch(e, index)"
      @image-click="openImagePreview(item as Node)"
      @video-click="openVideoPreview"
    />
  </div>

  <EmptyGridState v-if="shouldShowEmptyState" />
</template>

<style scoped lang="scss">
@use '@/assets/scss/grid.scss';
</style>
