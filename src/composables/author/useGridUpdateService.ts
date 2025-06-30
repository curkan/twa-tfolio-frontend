import { ref, type Ref } from 'vue'
import { useUpdateGrid } from '@/composables/grid/useUpdateGrid'
import type { GridStack } from 'gridstack'

export function useGridUpdateService(gridInstance: Ref<GridStack | null>) {
  const lastState = ref<any[]>()
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  /**
   * Сохраняет текущее состояние сетки
   * @returns Массив элементов сетки с нормализованными данными
   */
  const saveGridData = (): any[] => {
    if (!gridInstance.value) return []

    const serializedData = gridInstance.value.save() as any[]
    return serializedData.map(item => ({
      ...item,
      sort: `w_${item.id}`,
      w: item.w ?? 1,  // Значение по умолчанию для ширины
      h: item.h ?? 1   // Значение по умолчанию для высоты
    }))
  }

  /**
   * Обновляет данные сетки с debounce-эффектом
   * @param data - Данные для обновления
   * @param delay - Задержка в мс (по умолчанию 600)
   */
  const debouncedUpdateGrid = (data: any[], delay = 600) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      if (data && data.length) {
        useUpdateGrid(data).catch(error => {
          console.error('Failed to update grid:', error)
        })
      }
    }, delay)
  }

  return {
    lastState,
    saveGridData,
    debouncedUpdateGrid
  }
}
