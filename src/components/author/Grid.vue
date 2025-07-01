<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed, type Ref } from 'vue'
import { GridStack, type GridItemHTMLElement, type GridStackElement, type GridStackNode, type GridStackWidget } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { ShareSheet } from 'vant'
import { useHapticFeedback } from 'vue-tg/latest'

import { useGridInitializer } from '@/composables/grid/useGridInitializer'
import { useGridDataService } from '@/composables/author/useGridDataService'
import { useGridUpdateService } from '@/composables/author/useGridUpdateService'
import { useMediaHandler } from '@/composables/author/useMediaHandler'
import { useUploadHandler } from '@/composables/author/useUploadHandler'
import { useShareHandler } from '@/composables/mainButton/useShareHandler'
import { useDoubleTapHandler } from '@/composables/handles/useDoubleTapHandler'

const fileInput = ref<HTMLInputElement>()
const fileInputVideo = ref<HTMLInputElement>()

// Components
import IconPlus from './../icons/IconPlus.vue'
import UploadPopover from '../main/UploadPopover.vue'
import GridItem from './GridItem.vue'
import type {Node} from '@/composables/types/grid.type'
import {showShare} from '@/composables/mainButton/useShare'

// Refs
const gridFirstLoaded = ref(false)
const visibleRemove = ref(false)

// Services initialization (Dependency Injection)
const { gridInstance, initializeGrid, destroyGrid } = useGridInitializer()
const { saveGridData, debouncedUpdateGrid } = useGridUpdateService(gridInstance as Ref<GridStack | null>)
const { gridItems, loadGridData, addGridItem, removeGridItem } = useGridDataService(gridInstance as Ref<GridStack | null>)
const { openNodePage, openVideoPreview } = useMediaHandler()
const { setupShare, cleanupShare, handleShareSelect } = useShareHandler()
const { setupUploadHandlers, triggerImageUpload, triggerVideoUpload } = useUploadHandler(addGridItem, fileInput as Ref<HTMLInputElement>, fileInputVideo as Ref<HTMLInputElement>)
const { handleDoubleTap } = useDoubleTapHandler()
const { shareOptions } = useShareHandler()

// Computed
const shouldShowEmptyState = computed(() => gridFirstLoaded.value && gridItems.value.length === 0)

// Lifecycle hooks
onMounted(async () => {
  await initializeGridComponents()
  setupEventListeners()
  setupShare()
})

onUnmounted(() => {
  cleanupShare()

  nextTick(() => {
    destroyGrid()
  })
})

// Initialization
async function initializeGridComponents() {
  initializeGrid({ column: 4, float: false })

  await loadGridData()
  gridFirstLoaded.value = true

  if (gridItems.value) {
    nextTick(() => {
      attachWidgetsToGrid(gridItems.value)
      gridFirstLoaded.value = true
    })
  }
}

const attachWidgetsToGrid = (widgets: GridStackWidget[]) => {
  widgets.forEach(widget => {
    nextTick(() => {
      gridInstance.value?.makeWidget(widget.id as GridStackElement)
    })
  })
}

function setupEventListeners() {
  if (!gridInstance.value) return

  // Grid events
  gridInstance.value.on('change', handleGridChange)
  gridInstance.value.on('removed', handleGridChange)
  gridInstance.value.on('resizestart', handleResizeStart)
  gridInstance.value.on('dragstart', handleDragStart)
  gridInstance.value.on('dragstop', handleDragStop)

  // Upload handlers
  setupUploadHandlers()
}

// Event handlers
function handleGridChange(event: Event, changedItems: GridStackNode[]) {
  if (!gridFirstLoaded.value) return

  debouncedUpdateGrid(saveGridData())
}

function handleResizeStart(event: Event, el: GridItemHTMLElement) {
  hideRemoveIcons()
}

function handleDragStart(event: Event, el: GridItemHTMLElement) {
  hideRemoveIcons()
  gridInstance.value?.enableMove(false)
  useHapticFeedback().impactOccurred('light')
}

function handleDragStop(event: Event, el: GridItemHTMLElement) {
  gridInstance.value?.enableMove(true)
  useHapticFeedback().selectionChanged()
}

function handleItemTouch(e: Event) {
  if ((e.target as HTMLElement).classList.contains('ui-resizable-handle')) {
    return
  }

  const target = e.target as HTMLElement
  hideRemoveIcons()

  const gridItem = target.closest('.grid-stack-item')
  gridItem?.classList.add('ui-remove-visible')
  visibleRemove.value = !visibleRemove.value
}

function hideRemoveIcons() {
  visibleRemove.value = false
  document.querySelectorAll('.grid-stack-item').forEach(el => {
    el.classList.remove('ui-remove-visible')
  })
}
</script>

<template>
  <!-- Upload Controls -->
  <div class="add-new-widget-wapper">
    <UploadPopover
      @upload-image="triggerImageUpload"
      @upload-video="triggerVideoUpload"
    >
      <template #content>
        <div class="add-new-widget" type="button">
          <IconPlus />
          <label style="display: none">
            <input type="file" id="newImage" name="newImage" accept=".png, .jpg, .webp, .jpeg" ref="fileInput" />
            <input type="file" id="newVideo" name="newVideo" accept="video/*" ref="fileInputVideo" />
          </label>
        </div>
      </template>
    </UploadPopover>
  </div>

  <!-- Grid Items -->
      <!-- @image-click="(img, idx) => handleDoubleTap(idx, [img, idx], openNodePage)" -->
  <div class="grid-stack">
    <GridItem
      v-for="(item, index) in gridItems"
      :index="index"
      :key="item.id"
      :item="item as Node"
      :show-remove="visibleRemove"
      @touch="handleItemTouch"
      @click="handleItemTouch"
      @remove="removeGridItem"
      @image-click="(node) => handleDoubleTap(0, [node], openNodePage)"
      @video-click="(node) => handleDoubleTap(0, [node], openVideoPreview)"
    />
  </div>

  <!-- Empty State -->
  <EmptyGridState v-if="shouldShowEmptyState" />

  <!-- Share Sheet -->
  <ShareSheet
    v-model:show="showShare"
    :options="shareOptions"
    :cancel-text="$t('main.cancel')"
    @select="handleShareSelect"
  />
</template>

<style scoped lang="scss">
@use '@/assets/scss/grid.scss';
</style>
