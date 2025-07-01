<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  }
})

const image = ref<HTMLImageElement>()
const scale = ref(1)
const initialDistance = ref()
const offsetX = ref(0)
const offsetY = ref(0)
const startX = ref(0)
const startY = ref(0)
const isTouching = ref(false)

const imageStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
  transition: 'transform 0.2s ease-out'
}))

const value = ref()

const onTouchPress = (e) => {
    isTouching.value = true

    if (e.touches.length === 2) {
      // Рассчитываем начальное расстояние между пальцами
      initialDistance.value = getDistance(
        e.touches[0].clientX, e.touches[0].clientY,
        e.touches[1].clientX, e.touches[1].clientY
      )
    } else if (e.touches.length === 1 && scale.value > 1) {
      // Запоминаем начальную позицию для перемещения
      startX.value = e.touches[0].clientX - offsetX.value
      startY.value = e.touches[0].clientY - offsetY.value
    }
}

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

const onZoomInHandler = (item) => {
  scale.value = scale.value * item
  // value.value = item
}

</script>
<template>
  <div
    class="zoom-container"
    v-touch:press="onTouchPress"
    v-touch:zoom.out="onZoomInHandler"
  >
    {{value}}
    <img
      ref="image"
      :src="imageSrc"
      :style="imageStyle"
      class="zoom-image"
      alt="Zoomable image"
    >
  </div>
</template>


<style scoped>
.zoom-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  touch-action: none;
}

.zoom-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform-origin: center center;
  will-change: transform;
}
</style>
