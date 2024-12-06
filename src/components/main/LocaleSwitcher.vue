<script setup lang="ts">
import i18n from '@/i18n'
import {showToast} from 'vant';
import { onMounted, ref } from 'vue'

const showPopover = ref(false)
const actions = i18n.global.availableLocales.map((locale) => ({ text: locale }))

const onSelect = (action) => {
  showToast(action.text)
  i18n.global.locale.value = action.text
  localStorage.setItem('lang', action.text)
}
console.log(i18n.global.availableLocales)
</script>

<template>
  <van-popover
    v-model:show="showPopover"
    placement="bottom-end"
    :actions="actions"
    @select="onSelect"
  >
    <template #reference>
      <button class="locale">{{ $i18n.locale }}</button>
    </template>
  </van-popover>
</template>

<style scoped lang="scss">
.locale {
  display: block;
  padding: 2px 20px;
  border-radius: 5px;
  background: var(--vt-c-black-mute);
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1.7em;
}
</style>
