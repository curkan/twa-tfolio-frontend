import { ref } from 'vue'
import { useHapticFeedback } from 'vue-tg/latest'

export function useDoubleTapHandler() {
  const lastTap = ref(0)
  const tapTimeout = ref<number | null>(null)
  const tapDelay = 300 // ms
  const haptic = useHapticFeedback()

  /**
   * Обрабатывает двойное нажатие
   * @param index - Индекс элемента
   * @param args - Аргументы для обработчика
   * @param handler - Функция-обработчик двойного нажатия
   * @param handlerOneTap - Функция-обработчик одиночного нажатия
   */
  const handleDoubleTap = (
    index: number,
    args: any[],
    handler: (...args: any[]) => void,
    handlerOneTap: (...args: any[]) => void
  ) => {
    const currentTime = Date.now()
    const timeDiff = currentTime - lastTap.value

    // Очищаем предыдущий таймаут, если он есть
    if (tapTimeout.value) {
      clearTimeout(tapTimeout.value)
      tapTimeout.value = null
    }

    if (timeDiff < tapDelay) {
      // Двойное нажатие
      haptic.impactOccurred('light')
      handler(...args)
      lastTap.value = 0
    } else {
      // Устанавливаем таймаут для одиночного нажатия
      lastTap.value = currentTime
      tapTimeout.value = window.setTimeout(() => {
        handlerOneTap(...args)
      }, tapDelay)
    }
  }

  return {
    handleDoubleTap
  }
}
