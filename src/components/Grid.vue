<script setup lang="ts">
import {
  GridStack,
  type GridItemHTMLElement,
  type GridStackNode,
  type GridStackWidget,
} from 'gridstack'
import { createApp, ref, onMounted, nextTick, reactive } from 'vue'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { useWebApp, useWebAppHapticFeedback } from 'vue-tg'
import IconPlus from './icons/IconPlus.vue'
import IconRemove from './icons/IconRemove.vue'
import { showFailToast, showImagePreview, showLoadingToast } from 'vant'
import { useHandleDoubleTap } from '@/composables/handles/useHandleDoubleTap'
import { useHandleUploadImage } from '@/composables/handles/useHandleUploadImage'
import defaultNodes from '@/configs/defaultNodes.config'

const fileInput = ref<HTMLInputElement>()

let count = ref(0)
// DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115
let grid: GridStack | null = null

let items = ref<GridStackWidget[]>([])
const visibleRemove = ref(false)

const testImages = ref([
  'https://storage.yandexcloud.net/tgfolio-prod-images/Cozy%20Outdoor%20Reading%20Spot.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Disposable%20Coffee%20Cup%20on%20Blue%20Background.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Elegant%20Woman%20in%20Monochrome.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Futuristic%20Virtual%20Reality%20Experience-2.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Futuristic%20Virtual%20Reality%20Experience.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Minimalist%20Luxury%20Design.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Serene%20Mountainous%20Landscape%20at%20Dawn_Dusk.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Serene%20Portrait%20of%20a%20Young%20Woman.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Stacked%20Fruits%20and%20Objects.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Urban%20Trendsetters%20Step.jpeg',
  'https://storage.yandexcloud.net/tgfolio-prod-images/Vibrant%20Rose%20with%20Water%20Droplets.jpeg',
])

window.Telegram.WebApp.setHeaderColor('#212121')
window.Telegram.WebApp.setBackgroundColor('#212121')
window.Telegram.WebApp.setBottomBarColor('#212121')
window.Telegram.WebApp.setBottomBarColor('#212121')
window.Telegram.WebApp.expand()

if (window.Telegram.WebApp.isVersionAtLeast('8.0')) {
  window.Telegram.WebApp.requestFullscreen()
}

onMounted(() => {
  grid = GridStack.init({
    float: false,
    column: 4,
  })

  let nodes = []
  nodes = Array.from(defaultNodes)

  grid.on('change', onChange)

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

  nodes.forEach((node) => {
    node.id = 'w_' + count.value++
    items.value.push(node)

    nextTick(() => {
      grid?.makeWidget(node.id)
    })
  })
})

const openImagePreview = (link: string, startPosition: number) => {
  showImagePreview({
    images: testImages.value,
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

const onChange = (event: Event, changeItems: any) => {
  changeItems.forEach((item: any) => {
    const widget = items.value.find((w: GridStackWidget) => w.id === item.id)

    if (!widget) return

    const updatedWidget = widget as GridStackWidget
    updatedWidget.x = item.x
    updatedWidget.y = item.y
    updatedWidget.w = item.w
    updatedWidget.h = item.h
  })
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

const addNewWidget = () => {
  const node = items[count.value] || { x: 0, y: 0, w: 2, h: 2 }

  node.id = 'w_' + count.value++
  items.value.push(node)
  nextTick(() => {
    grid?.makeWidget(node.id)
  })
}

const remove = (widget: GridStackWidget) => {
  const selector = `#${widget.id}`
  grid?.removeWidget(selector, true)
}
</script>

<template>
  <button class="add-new-widget" type="button" @click="triggerFileInput">
    <IconPlus />
    <label style="display: none">
      <input
        id="newImage"
        type="file"
        name="newImage"
        accept=".png, .jpg, .webp"
        ref="fileInput"
        @change="useHandleUploadImage($event, [], addNewWidget)"
      />
    </label>
  </button>

  <div class="grid-stack">
    <div
      v-for="(w, index) in items"
      @click="handleTouch"
      @touchstart="handleTouch"
      class="grid-stack-item"
      :gs-x="w.x"
      :gs-y="w.y"
      :gs-w="w.w"
      :gs-h="w.h"
      :gs-id="w.id"
      :id="w.id"
      :key="w.id"
    >
      <div class="grid-stack-item-content">
        <div class="img">
          <img
            v-lazy="testImages[index]"
            @click="useHandleDoubleTap(index, [testImages[index], index], openImagePreview)"
          />
        </div>
        <button v-if="visibleRemove" class="ui-remove" @click="remove(w)"><IconRemove /></button>
      </div>
    </div>
  </div>
</template>

<style></style>
<style scoped lang="scss">
@use '@/assets/scss/grid.scss';
</style>
