import { ref } from 'vue'

const lastClickTime = ref<number | null>(null)
const clickCount = ref(0)
const lastClickIndex = ref(0)

export const useHandleDoubleTap = (index: number, args: any, callback: (...args: any) => void) => {
  const now = Date.now()
  if (lastClickTime.value && now - lastClickTime.value < 500 && lastClickIndex.value === index) {
    clickCount.value++
    if (clickCount.value === 2) {
      callback(...args)
      clickCount.value = 0
    }
  } else {
    clickCount.value = 1
    lastClickIndex.value = index
  }
  lastClickTime.value = now
}
