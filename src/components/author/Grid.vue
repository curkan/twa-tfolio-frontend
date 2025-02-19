<script setup lang="ts">
import {
  GridStack,
  type GridItemHTMLElement,
  type GridStackElement,
  type GridStackNode,
  type GridStackWidget,
} from 'gridstack'

import { ref, onMounted, nextTick, reactive, watch, onUnmounted } from 'vue'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { useMiniApp, useHapticFeedback } from 'vue-tg/latest'
import IconPlus from './../icons/IconPlus.vue'
import IconRemove from './../icons/IconRemove.vue'
import { showImagePreview, showLoadingToast, showToast } from 'vant'
import { useHandleDoubleTap } from '@/composables/handles/useHandleDoubleTap'
import { NodeType, type Node } from '@/composables/types/grid.type'
import { gridData, useGetGridData } from '@/composables/grid/useGetGridData'
import { useUpdateGrid } from '@/composables/grid/useUpdateGrid'
import { useUploadFiles } from '@/composables/handles/useUploadFiles'
import i18n from '@/i18n'
import { showShare, useOffShareEvent, useShare } from '@/composables/mainButton/useShare'
import { useMakeSizeImage } from '@/composables/grid/useMakeSizeImage'
import UploadPopover from '../main/UploadPopover.vue'
import {useUploadVideo} from '@/composables/handles/useUploadVideo'
import IconPlay from '../icons/IconPlay.vue'
import {useOpenVideo} from '@/composables/handles/useOpenVideo'

const fileInput = ref<HTMLInputElement>()
const fileInputVideo = ref<HTMLInputElement>()
const nodes = ref<Node[]>()
const gridFirstLoaded = ref<boolean>(false)
const options = [{ name: i18n.global.t('share.link'), icon: 'link' }]

// DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115
let grid: GridStack | null = null

let items = ref<GridStackWidget[]>([])
const timeoutId = ref()
const lastState = ref<[]>()
const visibleRemove = ref(false)

const onSelect = (option) => {
  if (option.name == i18n.global.t('share.link')) {
    const url = window.location.origin + window.location.pathname
    navigator.clipboard.writeText(
      import.meta.env.VITE_BOT_URL + '?startapp=' + useMiniApp().initDataUnsafe.user?.id,
    )
  }

  showToast(i18n.global.t('main.copied'))
  showShare.value = false
}

onUnmounted(() => {
  useOffShareEvent()
})

onMounted(async () => {
  useShare()
  grid = GridStack.init({
    float: false,
    column: 4,
  })
  await useGetGridData().then(() => {
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

  if (fileInput.value !== null) useUploadFiles(fileInput.value, [], addNewWidget)
  if (fileInputVideo.value !== undefined) useUploadVideo(fileInputVideo.value, [], addNewWidget)

  watch(
    () => gridData.value,
    () => {
      grid?.removeAll()

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
    },
  )

  grid.on('change', onChange)
  grid.on('removed', onChange)

  grid.on('resizestart', function (event: Event, el: GridItemHTMLElement) {
    removeVisibleIcon()
  })

  grid.on('dragstart', function (event: Event, el: GridItemHTMLElement) {
    removeVisibleIcon()
    if (el.gridstackNode) {
      let node: GridStackNode = el.gridstackNode
    }
    grid?.enableMove(false)

    useHapticFeedback().impactOccurred('light')
  })

  grid.on('dragstop', function (event: Event, el: GridItemHTMLElement) {
    grid?.enableMove(true)
    useHapticFeedback().selectionChanged()
  })
})

function modifySaveData(arr: any) {
  return arr.map(item => {
    // Добавляем поле sort с значением 'w_[id]'
    item.sort = `w_${item.id}`;
    item.w = item.w ?? 1
    item.h = item.h ?? 1

    // Удаляем поле content
    delete item.content;

    return item;
  });
}


function saveGridData(): GridStackWidget[] {
  let serializedData = grid?.save();

  serializedData = modifySaveData(serializedData) as GridStackWidget[]

  return serializedData
}

const openImagePreview = (link: string, startPosition: number) => {
  showImagePreview({
    images: gridData.value?.grid.map((a) => a.image.original),
    closeOnClickOverlay: true,
    startPosition: startPosition ?? 1,
    closeable: true,
  })
}

const removeVisibleIcon = () => {
  visibleRemove.value = false
  var elements = Array.from(document.getElementsByClassName('grid-stack-item'))
  elements.forEach(function (element) {
    element.classList.remove('ui-remove-visible')
  })
}

const onChange = async (event: Event, changeItems: any) => {
  if (gridFirstLoaded.value === false) return

  changeItems.forEach((item: any) => {
    const widget = items.value.find((w: GridStackWidget) => w.id === item.id)

    if (!widget) return

    const updatedWidget = widget as GridStackWidget
    updatedWidget.x = item.x
    updatedWidget.y = item.y
    updatedWidget.w = item.w
    updatedWidget.h = item.h
  })

  lastState.value = saveGridData() as []

  clearTimeout(timeoutId.value)
  timeoutId.value = setTimeout(async () => {
    if (lastState) {
      await useUpdateGrid(lastState.value as []).then(() => {})
    }
  }, 600)
}

const handleTouch = (e: Event) => {
  if ((e.target as HTMLElement).classList.contains('ui-resizable-handle')) {
    return
  }

  let target = e.target as HTMLElement
  removeVisibleIcon()

  target.closest('.grid-stack-item')?.classList.add('ui-remove-visible')
  visibleRemove.value = !visibleRemove.value
}

const addNewWidget = (newNode: Node) => {
  const node = newNode

  node.internalId = node.id
  node.id = 'w_' + newNode.id
  items.value.push(node as GridStackWidget)

  nextTick(() => {
    grid?.makeWidget(node.id as GridStackElement)
  })
}

const remove = (widget: GridStackWidget) => {
  const selector = `#${widget.id}`
  grid?.removeWidget(selector, true)
}

const uploadImageEvent = () => {
  fileInput.value.click()
}

const uploadVideoEvent = () => {
  fileInputVideo.value.click()
}

const openVideoPreview = (node: Node) => {
  gridFirstLoaded.value = false
  useOpenVideo(node, [], () => {})
}
</script>

<template>
  <div class="add-new-widget-wapper">
    <UploadPopover @upload-image="uploadImageEvent" @upload-video="uploadVideoEvent">
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

  <div class="grid-stack">
    <div
      v-if="items.length > 0"
      v-for="(w, index) in items as Node[]"
      @click="handleTouch"
      @touchstart="handleTouch"
      class="grid-stack-item"
      :gs-x="w.x"
      :gs-y="w.y"
      :gs-w="w.w"
      :gs-h="w.h"
      :gs-id="w.internalId"
      :internal-id="w.internalId"
      :id="String(w.id)"
      :key="w.id"
    >
      <div class="grid-stack-item-content">
        <div class="img" v-if="w.type == NodeType.image">
          <img
            v-lazy="{ src: useMakeSizeImage(w), delay: 300 }"
            @click="useHandleDoubleTap(index, [w.image.original, index], openImagePreview)"
          />
        </div>
        <div
          class="img video"
          v-else-if="w.type == NodeType.video"
          @click="useHandleDoubleTap(index, [w], openVideoPreview)"
        >
          <img
            v-lazy="{ src: useMakeSizeImage(w), delay: 300 }"
          />
          <IconPlay class="icon-play" />
        </div>
        <button v-if="visibleRemove" class="ui-remove" @click="remove(w as GridStackWidget)"><IconRemove /></button>
      </div>
    </div>
  </div>
  <div v-if="gridFirstLoaded == true && items.length == 0" class="empty-grid">
    <div class="center">
      <div class="header">{{ $t('portfolio.header') }}</div>
      <div class="text">{{ $t('portfolio.text') }}</div>
    </div>
  </div>
  <van-share-sheet
    v-model:show="showShare"
    :title="$t('tg.share')"
    :cancel-text="$t('main.cancel')"
    :options="options"
    @select="onSelect"
  />
</template>

<style scoped lang="scss">
@use '@/assets/scss/grid.scss';
</style>
