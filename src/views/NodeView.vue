<script setup lang="ts">
import NodeItem from '@/components/author/NodeItem.vue';
import ConsumerNodeItem from '@/components/consumer/NodeItem.vue';
import {useGetNodeData} from '@/composables/grid/useGetNodeData';
import {useViewportStore} from '@/composables/stores/useViewportStore';
import type {Node} from '@/composables/types/grid.type';
import router from '@/router';
import {useNodeStore} from '@/stores/useNodeStore';

import {onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {useBackButton, useMainButton, useMiniApp} from 'vue-tg/latest';

const backButton = useBackButton()

backButton.show()
backButton.onClick(() => {
  backButton.hide()
  router.push('/')
})

onMounted(() => {
  useMainButton().hide()

  if (useNodeStore().currentNode === undefined) {
    useGetNodeData(Number(useRoute().params.id)).then((data) => {
      useNodeStore().currentNode = data as Node
    })
  }
})

const doSwipeRight = () => {
  if (!useViewportStore().disabledBackSwipe) {
    router.push('/')
  }
};

</script>
<template>
  <div class="node-container h-full" v-touch:swipe.right="doSwipeRight">
    <Transition>
      <div v-if="useNodeStore().currentNode">
        <NodeItem v-if="(useNodeStore().currentNode as Node).meta.owner" :item="useNodeStore().currentNode as Node" />
        <ConsumerNodeItem v-else :item="useNodeStore().currentNode as Node" />
      </div>
    </Transition>
  </div>
</template>
