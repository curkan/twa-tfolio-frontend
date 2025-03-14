<script setup lang="ts">
</script>

<template>
  <van-config-provider theme="dark" />
  <router-view v-slot="{ Component }">
    <transition name="slide-fade" mode="out-in">
      <component :key="$route.path" :is="Component" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
</style>
