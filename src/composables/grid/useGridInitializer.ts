import { GridStack, type GridStackOptions } from 'gridstack'
import { ref } from 'vue'

export function useGridInitializer() {
  const gridInstance = ref<GridStack | null>(null)

  const initializeGrid = (options: GridStackOptions) => {
    gridInstance.value = GridStack.init(options)
  }

  const destroyGrid = () => {
    gridInstance.value?.destroy()
    gridInstance.value = null
  }

  return {
    gridInstance,
    initializeGrid,
    destroyGrid
  }
}
