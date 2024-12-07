<script setup lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { useUserStore } from '@/composables/stores/useUserStore'
import { onMounted, ref, watch } from 'vue'
import LocaleSwitcher from './../main/LocaleSwitcher.vue'
import type {IUser} from '@/composables/types/user.type';
import {useUserInfo} from '@/composables/user/useUserInfo';
const displayName = ref()
const photoUrl = ref()
const biography = ref()
const loading = ref(true)
const userInfo = ref<IUser>()

const props = defineProps({
  userId: Number
})

onMounted(() => {
  useUserInfo(props.userId).then((response) => {
    loading.value = false
    photoUrl.value = response.photo_url
    displayName.value = response.display_name
    biography.value = response.biography
  })
})

</script>

<template>
  <div class="locale-block">
    <LocaleSwitcher />
  </div>
  <div class="user">
    <div class="logo">
      <img
        v-if="photoUrl"
        v-lazy="{ src: photoUrl, error: '/images/not-logo.png' }"
      />
      <van-skeleton-image v-else />
    </div>
    <div class="info">
      <div v-if="loading">
        <van-skeleton title :row="1" />
      </div>
      <div class="username" v-if="!loading">
        {{ displayName }}
      </div>
      <div class="biography">{{ biography }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/user-header/user-header.scss';

.p {
  padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
}

.popup-edit-user {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding-bottom: var(--tg-safe-area-inset-bottom);
  .button {
    padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
  }
}
</style>
