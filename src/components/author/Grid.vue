<script setup lang="ts">
import {
  GridStack,
  type GridItemHTMLElement,
  type GridStackElement,
  type GridStackNode,
  type GridStackWidget,
} from 'gridstack'

import type {
  ShareSheetProps,
  ShareSheetOption,
  ShareSheetOptions,
} from 'vant';

import { ref, onMounted, nextTick, reactive, watch, onUnmounted } from 'vue'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { useWebApp, useWebAppClipboard, useWebAppHapticFeedback, useWebAppMainButton } from 'vue-tg'
import IconPlus from './../icons/IconPlus.vue'
import IconRemove from './../icons/IconRemove.vue'
import { showImagePreview, showLoadingToast, showToast } from 'vant'
import { useHandleDoubleTap } from '@/composables/handles/useHandleDoubleTap'
import type { Node } from '@/composables/types/grid.type'
import { gridData, useGetGridData } from '@/composables/grid/useGetGridData'
import { useUpdateGrid } from '@/composables/grid/useUpdateGrid'
import { useUploadFiles } from '@/composables/handles/useUploadFiles'
import i18n from '@/i18n';
import {showShare, useOffShareEvent, useShare} from '@/composables/mainButton/useShare';
import {useMakeSizeImage} from '@/composables/grid/useMakeSizeImage';

const fileInput = ref<HTMLInputElement>()
const nodes = ref<Node[]>()
const gridFirstLoaded = ref<boolean>(false)
const options = [
  { name: i18n.global.t('share.link'), icon: 'link' },
];

// DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115
let grid: GridStack | null = null

let items = ref<GridStackWidget[]>([])
const visibleRemove = ref(false)

const onSelect = (option) => {
  if (option.name == i18n.global.t('share.link')) {
    const url = window.location.origin + window.location.pathname
    navigator.clipboard.writeText(import.meta.env.VITE_BOT_URL + '?startapp=' + useWebApp().initDataUnsafe.user.id)
  }

  showToast(i18n.global.t('main.copied'));
  showShare.value = false;
};

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

    useWebAppHapticFeedback().impactOccurred('light')
  })

  grid.on('dragstop', function (event: Event, el: GridItemHTMLElement) {
    grid?.enableMove(true)
    useWebAppHapticFeedback().selectionChanged()
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

const removeVisibleIcon = () => {
  visibleRemove.value = false
  var elements = Array.from(document.getElementsByClassName('grid-stack-item'))
  elements.forEach(function (element) {
    element.classList.remove('ui-remove-visible')
  })
}

const onChange = async (event: Event, changeItems: any) => {
  if (gridFirstLoaded.value === false) return

  console.log('onChange auth')

  changeItems.forEach((item: any) => {
    const widget = items.value.find((w: GridStackWidget) => w.id === item.id)

    if (!widget) return

    const updatedWidget = widget as GridStackWidget
    updatedWidget.x = item.x
    updatedWidget.y = item.y
    updatedWidget.w = item.w
    updatedWidget.h = item.h
  })

  const gridStackItems = document.querySelectorAll('.grid-stack .grid-stack-item')
  const newData = Array.from(gridStackItems).map((el) => {
    return {
      id: el.getAttribute('internal-id'),
      sort: el.getAttribute('id'),
      x: el.getAttribute('gs-x'),
      y: el.getAttribute('gs-y'),
      w: el.getAttribute('gs-w') ?? 1,
      h: el.getAttribute('gs-h') ?? 1,
    }
  })

  console.log(newData)

  await useUpdateGrid(newData)
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

const triggerFileInput = () => {
  fileInput?.value?.click()
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
</script>

<template>
  <div class="add-new-widget" type="button" @click="$refs.fileInput.click()">
    <IconPlus />
    <label style="display: none">
      <div
        id="newImage"
        name="newImage"
        accept=".png, .jpg, .webp, .jpeg"
        ref="fileInput"
      />
    </label>
  </div>

  <div class="grid-stack">
    <div
      v-if="items.length > 0"
      v-for="(w, index) in items"
      @click="handleTouch"
      @touchstart="handleTouch"
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
        <div class="img">
          <img
            v-lazy="{ src: useMakeSizeImage(w), delay: 300 }"
            @click="useHandleDoubleTap(index, [w.image.original, index], openImagePreview)"
          />
        </div>
        <button v-if="visibleRemove" class="ui-remove" @click="remove(w)"><IconRemove /></button>
      </div>
    </div>
  </div>
  <div v-if="gridFirstLoaded == true && items.length == 0" class="empty-grid">
    <div class="center">
      <div class="header">{{$t('portfolio.header')}}</div>
      <div class="text">{{$t('portfolio.text')}}</div>
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
