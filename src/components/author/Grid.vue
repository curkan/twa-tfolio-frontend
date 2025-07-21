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
const editModeEnabled = ref<boolean>(false)
const clickedStates = ref<Record<number, boolean>>({});
const haptic = useHapticFeedback()


// Components
import IconPlus from './../icons/IconPlus.vue'
import UploadPopover from '../main/UploadPopover.vue'
import GridItem from './GridItem.vue'
import type {Node} from '@/composables/types/grid.type'
import {showShare} from '@/composables/mainButton/useShare'
import IconGrid from '../icons/IconGrid.vue'
import EmptyGridState from '../consumer/EmptyGridState.vue'

// Refs
const gridFirstLoaded = ref(false)

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
  initializeGrid({margin: '5px', column: 4, float: false })
  gridInstance.value?.setStatic(!editModeEnabled.value)

  await loadGridData()

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


function handleResizeStart(event: Event, el: GridItemHTMLElement) {
}

// Event handlers
function handleGridChange(event: Event, changedItems: GridStackNode[]) {
  if (!gridFirstLoaded.value) return

  debouncedUpdateGrid(saveGridData())
}

function handleDragStart(event: Event, el: GridItemHTMLElement) {
  gridInstance.value?.enableMove(false)
  useHapticFeedback().impactOccurred('light')
}

function handleDragStop(event: Event, el: GridItemHTMLElement) {
  gridInstance.value?.enableMove(true)
  useHapticFeedback().selectionChanged()
}

function handleItemTouch(e: Event, index: number) {
  clickedStates.value[index] = true;
  haptic.impactOccurred('light')

  setTimeout(() => {
    clickedStates.value[index] = false;
  }, 200);
}

function editable() {
  editModeEnabled.value = !editModeEnabled.value

  gridInstance.value?.setStatic(!editModeEnabled.value)
}

</script>

<template>
  <div class="edit-mode p-3 bg-zinc-800 rounded-lg flex justify-center items-center" :class="editModeEnabled ? 'bg-zinc-700' : ''" @click="editable">
    <IconGrid :solid="editModeEnabled"/>
  </div>
  <!-- Upload Controls -->
  <Transition mode="out-in">
    <div class="add-new-widget-wapper" v-if="!editModeEnabled">
      <UploadPopover
        @upload-image="triggerImageUpload"
        @upload-video="triggerVideoUpload"
      >
        <template #content>
          <div class="add-new-widget p-3 bg-zinc-800 rounded-lg flex justify-center items-center" type="button">
            <IconPlus />
            <label style="display: none">
              <input type="file" id="newImage" name="newImage" accept=".png, .jpg, .webp, .jpeg" ref="fileInput" />
              <input type="file" id="newVideo" name="newVideo" accept="video/*" ref="fileInputVideo" />
            </label>
          </div>
        </template>
      </UploadPopover>
    </div>
  </Transition>

  <!-- Grid Items -->
      <!-- @image-click="(img, idx) => handleDoubleTap(idx, [img, idx], openNodePage)" -->
      <!-- @image-click="(node) => handleDoubleTap(0, [node], openNodePage)" -->
  <div class="grid-wrapper flex gap-2">
    <div class="grid-stack w-[103%]">
      <GridItem
        v-for="(item, index) in gridItems"
        :index="index"
        :key="item.id"
        :item="item as Node"
        :show-remove="editModeEnabled"
        :class="clickedStates[index] ? 'scale-105' : ''"
        @touch="(e: Event) => handleItemTouch(e, index)"
        @click="(e: Event) => handleItemTouch(e, index)"
        @remove="removeGridItem"
        @image-click="(node) => !editModeEnabled ? openNodePage(node) : ''"
        @video-click="(node) => !editModeEnabled ? openVideoPreview(node) : ''"
      />
    </div>
    <div class="grid-stack-scroll w-6 h-full" v-if="editModeEnabled">
    </div>
  </div>

  <!-- Empty State -->
  <EmptyGridState v-if="shouldShowEmptyState" :visible="shouldShowEmptyState"/>

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
