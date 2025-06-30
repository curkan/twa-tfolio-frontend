import {ref} from 'vue'
import { useHapticFeedback } from 'vue-tg/latest'

export function useDoubleTapHandler() {
  const lastTap = ref(0)
  const tapDelay = 300 // ms
  const haptic = useHapticFeedback()

  /**
   * Обрабатывает двойное нажатие
   * @param index - Индекс элемента
   * @param args - Аргументы для обработчика
   * @param handler - Функция-обработчик
   */
  const handleDoubleTap = (
    index: number,
    args: any[],
    handler: (...args: any[]) => void
  ) => {
    const currentTime = Date.now()
    const timeDiff = currentTime - lastTap.value

    if (timeDiff < tapDelay) {
      // Двойное нажатие
      haptic.impactOccurred('light')
      handler(...args)
      lastTap.value = 0
    } else {
      // Одиночное нажатие
      lastTap.value = currentTime
    }
  }

  return {
    handleDoubleTap
  }
}
