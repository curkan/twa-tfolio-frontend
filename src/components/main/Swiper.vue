<template>
  <div
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    v-touch:swipe.right="prev"
    v-touch:swipe.left="next"
    class="swiper"
    :style="swiperStyle"
  >
    <div
      ref="wrapper"
      :style="wrapperStyle"
      class="swiper-wrapper"
    >
      <slot></slot>
    </div>
    <transition name="arrow-fade">
      <div class="swiper-arrow" v-show="arrowOperationVisible">
        <span @click="prev" class="left arrow"></span>
        <span @click="next" class="right arrow"></span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, type StyleValue } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'left',
    validator: (value: string) => ['left', 'right'].includes(value)
  },
  height: {
    type: String,
    default: '300px'
  },
  duration: {
    type: Number,
    default: 300
  },
  interval: {
    type: Number,
    default: 1700
  },
  slidesPerPage: {
    type: Number,
    default: 1,
    validator: (value: number) => value > 0
  }
})

const emit = defineEmits(['change'])

const arrowOperationVisible = ref(false)
const currentIndex = ref(0)
const itemCount = ref(0)
const wrapper = ref<HTMLElement | null>(null)

const totalItems = computed(() => itemCount.value)
const totalPages = computed(() => Math.ceil(totalItems.value / props.slidesPerPage))
const slideWidth = computed(() => 100 / (props.slidesPerPage))
const slideShift = computed(() => ((100 / totalItems.value)))

const swiperStyle = computed<StyleValue>(() => ({
  height: props.height
}))

const wrapperStyle = computed<StyleValue>(() => ({
  transform: `translate3d(${-slideShift.value * currentIndex.value}%, 0, 0)`,
  width: `${totalItems.value * slideWidth.value}%`,
  transitionDuration: `${props.duration}ms`
}))

const next = () => {
  if (currentIndex.value < totalItems.value - 1) {
    currentIndex.value++
    emit('change', currentIndex.value)
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    emit('change', currentIndex.value)
  }
}

const mouseLeave = () => {
  arrowOperationVisible.value = false
}

const mouseEnter = () => {
  arrowOperationVisible.value = true
}

const handleIndexChange = (newIndex: number) => {
  // Optional: Add logic for infinite carousel if needed
}

onMounted(() => {
  const slots = wrapper.value?.children || []
  const swiperItems = Array.from(slots).filter(el =>
    el.classList.contains('swiper-item')
  )

  itemCount.value = swiperItems.length

  // Set width for each slide based on slidesPerPage
  swiperItems.forEach(item => {
    (item as HTMLElement).style.width = `${slideWidth.value}%`
  })
})

onBeforeUnmount(() => {
  // Cleanup if needed
})

watch(() => currentIndex.value, handleIndexChange)
</script>

<style scoped lang="scss">
.swiper {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.swiper-wrapper {
  display: flex;
  height: 100%;
  transition-property: transform;
}

.swiper-item {
  flex-shrink: 0;
}

.swiper-arrow {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  top: 50%;
  transform: translatey(-50%);
  padding: 0 20px;
  box-sizing: border-box;

  .arrow {
    transition: background-color 0.2s;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);

    &:before {
      content: '';
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 2px solid #333;
      border-width: 2px 2px 0 0;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.8);
    }

    &.left:before {
      transform: rotate(225deg);
      margin-left: 4px;
    }

    &.right:before {
      transform: rotate(45deg);
      margin-right: 4px;
    }
  }
}

.arrow-fade-enter-active,
.arrow-fade-leave-active {
  transition: opacity 0.3s;
}

.arrow-fade-enter-from,
.arrow-fade-leave-to {
  opacity: 0;
}
</style>
