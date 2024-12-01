import type { GridStack } from 'gridstack'
import { nextTick, type Ref } from 'vue'

export const useAddNewWidget = async (grid: GridStack, items: Ref<[]>, count: Ref) => {
  const node = items[count.value] || { x: 0, y: 0, w: 2, h: 2 }

  node.id = 'w_' + count.value++
  items.value.push(node)
  nextTick(() => {
    grid.makeWidget(node.id)
  })
}
