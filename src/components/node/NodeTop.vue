<script setup lang="ts">
import { NodeType, type Node } from '@/composables/types/grid.type'

// const props = defineProps({
//   user: {
//     type: Object as () => Node,
//     required: true
//   },
// })
</script>

<template>
  <div class="node-item-top flex items-center justify-between w-dvw p-5 px-2">
    <div class="user-info flex gap-2 items-center">
      <div class="avatar flex overflow-hidden">
        <img class="inline-block size-10 rounded-full object-cover" v-lazy="{ src: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg', delay: 0 }" alt="" />
      </div>
      <div class="name font-bold">Nikita</div>
    </div>
    <div class="subscribe">Subscribe</div>
    <div class="menu">dot</div>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-item.scss';
</style>

