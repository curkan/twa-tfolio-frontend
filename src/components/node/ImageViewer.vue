<script setup lang="ts">
import {useDoubleTapHandler} from '@/composables/handles/useDoubleTapHandler'
import {useViewportStore} from '@/composables/stores/useViewportStore'
import { ref, computed, onMounted, onUnmounted, watch, defineAsyncComponent, nextTick } from 'vue'
import IconInstagram from '../icons/IconInstagram.vue'
import IconPause from '../icons/IconPause.vue'
import IconVolume from '../icons/IconVolume.vue'

const FiredAnimation = defineAsyncComponent(
    () => import("@/components/animations/FiredAnimation.vue")
)

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

const emit = defineEmits(['double-click'])
const image = ref<HTMLImageElement>()
const video = ref<HTMLVideoElement>()
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

const videoPaused = ref(false)
const videoMuted = ref(true)

const fired = ref<Array<{x: number, y: number}>>([])

const { handleDoubleTap } = useDoubleTapHandler()

onMounted(() => {
  if (props.videoSrc && video.value) {
    // Устанавливаем muted по умолчанию для автоматического воспроизведения
    video.value.muted = true
    video.value.play().catch(e => console.error("Autoplay failed:", e))

    // Следим за изменениями состояния видео
    video.value.addEventListener('play', () => {
      videoPaused.value = false
    })
    video.value.addEventListener('pause', () => {
      videoPaused.value = true
    })
  }
})

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

const handleDoubleTapFired = (e: MouseEvent | TouchEvent) => {
  // Получаем координаты клика
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  let x, y

  if (e instanceof MouseEvent) {
    x = e.clientX - rect.left
    y = e.clientY - rect.top
  } else {
    // Для touch событий
    const touch = e.touches[0] || e.changedTouches[0]
    x = touch.clientX - rect.left
    y = touch.clientY - rect.top
  }

  // Добавляем новое сердечко
  fired.value.push({ x, y })

  emit('double-click')
}

const handleClickVideo = (e: MouseEvent | TouchEvent) => {
  if (!video.value) return

  if (video.value.paused) {
    video.value.play()
  } else {
    video.value.pause()
  }
}

const toggleMute = (e: MouseEvent) => {
  e.stopPropagation()
  if (!video.value) return

  video.value.muted = !video.value.muted
  videoMuted.value = video.value.muted
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
    @click="(e) => handleDoubleTap(1, [], () => handleDoubleTapFired(e), () => handleClickVideo(e))"
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
    <div
      v-if="videoSrc"
      class="zoom-image"
    >
      <video
        ref="video"
        id="player"
        :style="imageStyle"
        :src="videoSrc"
        autoplay
        loop
        playsinline
        draggable="false"
        muted
      ></video>
      <div class="controls absolute top-0 right-0 p-2 flex gap-2 justify-between w-full">
        <span>
          <IconPause v-if="videoPaused" @click.stop="handleClickVideo" />
        </span>
        <IconVolume :muted="videoMuted" @click.stop="toggleMute" />
      </div>
    </div>

    <FiredAnimation
      v-for="(heart, index) in fired" :key="index"
      :x="heart.x"
      :y="heart.y"
    />
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
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  position: relative;
}

.controls {
  pointer-events: auto;
}

.controls svg {
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 4px;
  color: white;
}
</style>
