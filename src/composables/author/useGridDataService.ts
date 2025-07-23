import { nextTick, ref, type Ref } from 'vue'
import { gridData, useGetGridData } from '@/composables/grid/useGetGridData'
import type {GridStack, GridStackElement, GridStackWidget} from 'gridstack'
import type {Node} from '../types/grid.type'

export function useGridDataService(gridInstance: Ref<GridStack | null>) {
  const gridItems = ref<GridStackWidget[]>([])

  const loadGridData = async () => {
    let needAwaitRequest = false

    try {
      const cache = await caches.open('grid-cache-v1')
      const cachedResponse = await cache.match('api/v1/common/grid')

      if (cachedResponse !== undefined) {
        const cachedData = await cachedResponse.json()
        gridData.value = cachedData
        gridItems.value = transformNodesToWidgets(gridData.value!.grid)

        // Обновляем UI с кешированными данными
        await nextTick()
      } else {
        needAwaitRequest = true
      }
    } catch {

    }

    if (needAwaitRequest) {
      await useGetGridData().then(() => {
          gridItems.value = transformNodesToWidgets(gridData.value!.grid)
      })
    } else {
      useGetGridData().then(() => {
          gridItems.value = transformNodesToWidgets(gridData.value!.grid)
      })
    }
  }

  const addGridItem = (node: Node) => {
    const widget = transformNodeToWidget(node)
    gridItems.value.push(widget)
    nextTick(() => {
      gridInstance.value?.makeWidget(widget.id as GridStackElement)
    })
  }

  const removeGridItem = (widget: GridStackWidget) => {
    gridItems.value = gridItems.value.filter(item => item.id !== widget.id)
    const selector = `#${widget.id}`
    gridInstance.value?.removeWidget(selector, true)
  }

  const transformNodesToWidgets = (nodes: Node[]): GridStackWidget[] => {
    return nodes.map(transformNodeToWidget)
  }

  const transformNodeToWidget = (node: Node): GridStackWidget => ({
    ...node,
    internalId: node.id,
    id: `w_${node.id}`,
    w: node.w ?? 1,
    h: node.h ?? 1
  })

  return {
    gridItems,
    loadGridData,
    addGridItem,
    removeGridItem
  }
}
