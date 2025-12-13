<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

const visible = ref(false)

const props = defineProps({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  }
})

const positionStyle = computed(() => ({
  position: 'absolute',
  left: `${props.x - 37}px`,
  top: `${props.y - 37}px`,
  pointerEvents: 'none',
  zIndex: 999
}))

function spawnParticle(baseX: number, baseY: number, color: string) {
  const container = document.querySelector('.zoom-container')
  if (!container) return

  const particle = document.createElement('div')
  particle.style.position = 'absolute'
  particle.style.left = `${baseX}px`
  particle.style.top = `${baseY}px`
  particle.style.width = '10px'
  particle.style.height = '10px'
  particle.style.borderRadius = '50%'
  particle.style.backgroundColor = color
  particle.style.pointerEvents = 'none'
  particle.style.zIndex = '998'
  particle.style.transform = 'translate(-50%, -50%)'
  container.appendChild(particle)

  const angle = Math.random() * Math.PI * 2
  const distance = 100 + Math.random() * 15
  const duration = 0.4 + Math.random() * 0.3

  gsap.to(particle, {
    x: `+=${Math.cos(angle) * distance}`,
    y: `+=${Math.sin(angle) * distance}`,
    opacity: 0,
    scale: 0.2,
    duration: duration,
    ease: 'power2.out',
    onComplete: () => {
      container.removeChild(particle)
    }
  })
}

function enter(el: Element, done: () => void) {
  const mainColor = 'rgb(239,68,68)'
  const lighterColor = 'rgb(255,120,120)'
  const darkerColor = 'rgb(200,50,50)'

  const centerX = props.x
  const centerY = props.y

  for (let i = 0; i < 15; i++) {
    const color = Math.random() > 0.5 ? lighterColor : darkerColor
    spawnParticle(centerX, centerY, color)
  }

  gsap.fromTo(el,
    {
      scale: 0,
      opacity: 0,
      rotateZ: -20,
      fill: 'rgba(255,255,255,0.8)',
    },
    {
      scale: 1,
      rotateZ: 0,
      opacity: 1,
      duration: 0.3,
      fill: mainColor,
      ease: 'back.out(1.7)',
      onComplete: done
    }
  )
}

function leave(el: Element, done: () => void) {
  gsap.to(el, {
    scale: 0,
    opacity: 0,
    duration: 0.2,
    onComplete: done
  })
}

function afterEnter() {
  setTimeout(() => {
    visible.value = false
  }, 300)
}

onMounted(() => {
  visible.value = true
})
</script>

<template>
  <Transition
    @after-enter="afterEnter"
    @enter="enter"
    @leave="leave"
    :css="false"
  >
    <svg
      v-if="visible"
      class="heart-animation"
      :style="positionStyle"
      width="74"
      height="74"
      viewBox="0 0 74 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
    <path d="M24.1055 8.02901C24.3991 7.55667 24.8531 7.20596 25.3843 7.04116C25.9155 6.87637 26.4883 6.90854 26.9977 7.13176C35.2487 10.7393 39.2755 17.9173 41.2365 23.9082C41.8008 25.641 42.2047 27.2998 42.4914 28.7798L42.7998 28.4098C45.4021 25.3388 49.3673 21.608 54.7539 19.1691C55.0477 19.0357 55.3662 18.9652 55.689 18.9623C56.0117 18.9594 56.3314 19.024 56.6277 19.1521C56.9239 19.2802 57.19 19.4688 57.4089 19.7059C57.6279 19.9431 57.7948 20.2234 57.8989 20.5288C58.1907 21.3881 58.4929 22.2648 58.8054 23.1589C60.1528 27.0193 61.5989 31.1663 62.4437 35.2703C63.492 40.3732 63.6924 45.7228 61.5495 50.8503C59.5407 55.6549 56.1555 59.7578 51.82 62.6426C47.4846 65.5274 42.3926 67.0653 37.185 67.0625C22.6101 67.0625 10.7917 55.2626 10.7917 40.7C10.7917 28.7552 14.7877 22.5546 20.72 13.357C21.7869 11.6951 22.9215 9.9376 24.1055 8.02901ZM23.8959 40.0833C23.8959 39.47 23.6522 38.8818 23.2185 38.4482C22.7849 38.0145 22.1967 37.7708 21.5834 37.7708C20.97 37.7708 20.3818 38.0145 19.9482 38.4482C19.5145 38.8818 19.2709 39.47 19.2709 40.0833C19.2709 44.7854 21.1387 49.2949 24.4636 52.6198C27.7885 55.9446 32.298 57.8125 37 57.8125C37.6133 57.8125 38.2015 57.5689 38.6352 57.1352C39.0689 56.7015 39.3125 56.1133 39.3125 55.5C39.3125 54.8867 39.0689 54.2985 38.6352 53.8648C38.2015 53.4311 37.6133 53.1875 37 53.1875C33.5246 53.1875 30.1915 51.8069 27.734 49.3494C25.2765 46.8919 23.8959 43.5588 23.8959 40.0833Z" />
    </svg>
  </Transition>
</template>

<style scoped>
.heart-animation {
  fill: rgb(239, 68, 68);
}
</style>
