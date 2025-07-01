<script setup lang="ts">
import { NodeType, type Node } from '@/composables/types/grid.type'

const props = defineProps({
  item: {
    type: Object as () => Node,
    required: true
  },
})
</script>

<template>
  <div
    class="node-item"
  >
    <div class="node-item-content">
      <template v-if="item.type === NodeType.image">
        <div class="img">
          <img v-lazy="{ src: item.image.original, delay: 0 }" />
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-item.scss';
</style>
