import router from "@/router"
import {useNodeStore} from "@/stores/useNodeStore"
import type {Node} from "../types/grid.type"
import {useUserStore} from "../stores/useUserStore"

export const useOpenImage = (node: Node, args: any, callback: (...args: any) => void) => {
  node.id = node.internalId

  useNodeStore().currentNode = node
  router.push(`/p/${node.internalId}`)
}
