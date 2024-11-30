<script setup lang="ts">
import {useWebApp} from 'vue-tg';

</script>

<template>
  <div class="user">
    <div class="logo">
      <img v-lazy="useWebApp().initDataUnsafe.user?.photo_url" alt="" srcset="">
    </div>
    <div class="info">
      <div class="username">{{useWebApp().initDataUnsafe.user?.first_name}} {{useWebApp().initDataUnsafe.user?.last_name}}</div>
      <div class="biography">Videograpf, photograpg, developer</div>
    </div>
  </div>

</template>

<style scoped lang="scss">
@use '@/assets/scss/user-header/user-header.scss';
</style>
