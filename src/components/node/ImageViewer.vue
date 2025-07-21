<script setup lang="ts">
import {useViewportStore} from '@/composables/stores/useViewportStore'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  imageSrc: {
    type: String,
    required: false
  },
  videoSrc: {
    type: String,
    required: false
  }
})

const image = ref<HTMLImageElement>()
const scale = ref(1)
const initialDistance = ref(0)
const initialScale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const startX = ref(0)
const startY = ref(0)
const isDragging = ref(false)
const maxScale = 3
const minScale = 1
const container = ref<HTMLElement>()
const initialCenter = ref({ x: 0, y: 0 })
const currentCenter = ref({ x: 0, y: 0 })

watch(
  () => isDragging.value,
  () => {
    if (isDragging.value) {
      useViewportStore().disabledBackSwipe = true
    } else {
      setTimeout(() => {
        useViewportStore().disabledBackSwipe = false
      }, 200)
    }
  }
)

const imageStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
  transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
}))

// Ограничение смещения
const clampOffset = () => {
  if (!image.value || !container.value) return

  const bodyHeight = document.body.getBoundingClientRect().height
  const containerRect = container.value.getBoundingClientRect()
  const imgWidth = containerRect.width * scale.value
  const imgHeight = containerRect.height * scale.value

  const maxOffsetX = Math.max((imgWidth - containerRect.width) / 2, 0)
  const maxOffsetY = Math.max((imgHeight - containerRect.height) / 2, 0)

  offsetX.value = Math.min(Math.max(offsetX.value, -maxOffsetX), maxOffsetX)
  offsetY.value = Math.min(Math.max(offsetY.value, -maxOffsetY), maxOffsetY)
}

const getCenter = (touches: TouchList) => {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2
  }
}

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 2) {
    e.preventDefault();  // отменяем стандартное поведение (скролл)
    e.stopPropagation(); // останавливаем всплытие
    // Начало пинч-зума
    initialDistance.value = getDistance(
      e.touches[0].clientX, e.touches[0].clientY,
      e.touches[1].clientX, e.touches[1].clientY
    )
    initialScale.value = scale.value
    initialCenter.value = getCenter(e.touches)

    startX.value = e.touches[0].clientX - offsetX.value
    startY.value = e.touches[0].clientY - offsetY.value
    isDragging.value = true
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return

  if (e.touches.length === 2) {
    // Пинч-зум с центрированием
    const currentDistance = getDistance(
      e.touches[0].clientX, e.touches[0].clientY,
      e.touches[1].clientX, e.touches[1].clientY
    )

    if (initialDistance.value > 0) {
      const newScale = Math.min(Math.max(
        initialScale.value * (currentDistance / initialDistance.value),
        minScale
      ), maxScale)

      scale.value = newScale

      // Центрирование относительно начальной точки
      currentCenter.value = getCenter(e.touches)
      const deltaX = currentCenter.value.x - initialCenter.value.x
      const deltaY = currentCenter.value.y - initialCenter.value.y

      offsetX.value = (initialCenter.value.x - startX.value) + deltaX * (newScale / initialScale.value)
      offsetY.value = (initialCenter.value.y - startY.value) + deltaY * (newScale / initialScale.value)

      clampOffset()
    }
  } else if (e.touches.length === 1) {
    // Перемещение
    offsetX.value = e.touches[0].clientX - startX.value
    offsetY.value = e.touches[0].clientY - startY.value
    clampOffset()
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
  initialDistance.value = 0

  // Всегда сбрасываем масштаб до minScale (1) при отпускании пальцев
  if (scale.value !== minScale) {
    scale.value = minScale
    resetPosition()
  }

  clampOffset()
}

const resetPosition = () => {
  offsetX.value = 0
  offsetY.value = 0
}

const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

</script>

<template>
  <div
    ref="container"
    class="zoom-container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <img
      v-if="imageSrc"
      ref="image"
      :src="imageSrc"
      :style="imageStyle"
      class="zoom-image"
      alt="Zoomable image"
      draggable="false"
    >
    <video
      v-if="videoSrc"
      class="zoom-image"
      ref="image"
      id="player"
      :style="imageStyle"
      :src="videoSrc"
      autoplay
      playsinline
      draggable="false"
    ></video>
  </div>
</template>

<style scoped>
.zoom-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.zoom-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform-origin: center center;
  will-change: transform;
  pointer-events: none;
}
</style>
