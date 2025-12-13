import router from "@/router"
import {useNodeStore} from "@/stores/useNodeStore"
import type {Node} from "../types/grid.type"

export const useOpenVideo = (node: Node, args: any, callback: (...args: any) => void) => {
  node.id = node.internalId

  useNodeStore().currentNode = node
  router.push(`/p/${node.internalId}`)
}
