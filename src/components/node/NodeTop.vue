<script setup lang="ts">
import { NodeType, type Node } from '@/composables/types/grid.type'

const props = defineProps({
  user: {
    type: Object as () => Node,
    required: true
  },
})
</script>

<template>
  <div
    class="node-item-top"
  >

  </div>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-item.scss';
</style>

