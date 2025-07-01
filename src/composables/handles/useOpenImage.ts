import router from "@/router"
import {useNodeStore} from "@/stores/useNodeStore"
import type {Node} from "../types/grid.type"

export const useOpenImage = (node: Node, args: any, callback: (...args: any) => void) => {
  useNodeStore().currentNode = node
  router.push(`/p/${node.internalId}`)
}
