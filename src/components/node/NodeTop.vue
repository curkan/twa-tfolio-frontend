<script setup lang="ts">
import { type IUserNode } from '@/composables/types/grid.type'

const props = defineProps({
  user: {
    type: Object as () => IUserNode,
    required: true
  },
})
</script>

<template>
  <div class="node-item-top flex items-center justify-center w-dvw p-5 px-2 -mt-15">
    <div class="user-info flex gap-2 items-center">
      <div class="avatar flex overflow-hidden">
        <img class="inline-block size-10 rounded-full object-cover" v-lazy="{ src: user.photo_url, delay: 0 }" alt="" />
      </div>
      <div class="name font-bold">{{user.display_name}}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-item.scss';
</style>

