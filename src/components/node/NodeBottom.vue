<script setup lang="ts">
import IconFire from '../icons/IconFire.vue';

</script>

<template>
  <div class="node-item-bottom my-2">
    <section class="elements grid grid-cols-2">
      <div class="left-elements flex">
        <div class="btn-element p-2 pl-0 pr-0">
          <span>
            <IconFire />
          </span>
        </div>
        <div class="element p-2">
          <span>
            Fired
            <span class="font-bold">44,234</span>
          </span>
        </div>
      </div>
      <div class="right-elements"></div>
    </section>
    <section>
      <div class="date text-zinc-400">19 сентября</div>
    </section>
    <section class="description">
      <article class="">
        <span class="username font-bold mr-2">tsurkan</span>
        <span>Данные работы были сделаны для фестиваля кроссовок в Москве.</span>
      </article>
    </section>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-bottom.scss';
</style>
