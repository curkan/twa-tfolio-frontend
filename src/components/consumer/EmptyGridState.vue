<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-if="visible" class="empty-grid">
    <div class="center">
      <div class="header">{{ $t('consumerPortfolio.header') }}</div>
      <div class="text">{{ $t('consumerPortfolio.text') }}</div>
    </div>
  </div>
</template>
