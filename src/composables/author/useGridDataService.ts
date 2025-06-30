import { nextTick, ref, type Ref } from 'vue'
import { gridData, useGetGridData } from '@/composables/grid/useGetGridData'
import type {GridStack, GridStackElement, GridStackWidget} from 'gridstack'
import type {Node} from '../types/grid.type'

export function useGridDataService(gridInstance: Ref<GridStack | null>) {
  const gridItems = ref<GridStackWidget[]>([])

  const loadGridData = async (userId: number) => {
    await useGetGridData(userId)
    if (gridData.value?.grid) {
      gridItems.value = transformNodesToWidgets(gridData.value.grid)
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
