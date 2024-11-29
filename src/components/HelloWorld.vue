<script setup lang="ts">
import {GridStack} from 'gridstack';
import {onMounted} from 'vue';

defineProps<{
  msg: string
}>()


onMounted(() => {

})
</script>

<template>
  <div class="grid-stack"></div>
</template>

<style scoped lang="scss">
.grid-stack {
  height: 50xp;
  background: #FAFAD2;
}
.grid-stack-item-content {
  background-color: #18BC9C;
}
</style>
