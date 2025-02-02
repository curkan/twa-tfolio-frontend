<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LocaleSwitcher from './../main/LocaleSwitcher.vue'
import type { IUser } from '@/composables/types/user.type'
import { useUserInfo } from '@/composables/user/useUserInfo'
import {
  socialLinksData,
  useGetSocialLinksData,
} from '@/composables/socialLinks/useGetSocialLinksData'
import type { ISocialLinks } from '@/composables/types/social-links.type'
import { getFullUrl, getSocialLinkIcon } from '@/composables/socialLinks/socialLinks'
const displayName = ref()
const photoUrl = ref()
const biography = ref()
const loading = ref(true)
const userInfo = ref<IUser>()
const socialLinks = ref<ISocialLinks[]>()

const props = defineProps({
  userId: Number,
})

onMounted(() => {
  useUserInfo(Number(props.userId)).then((response) => {
    loading.value = false
    if (response === undefined) return

    userInfo.value = response
    photoUrl.value = response.photo_url
    displayName.value = response.display_name
    biography.value = response.biography
  })

  useGetSocialLinksData(props.userId).then(() => {
    socialLinks.value = socialLinksData.value
  })
})
</script>

<template>
  <div class="locale-block">
    <LocaleSwitcher />
  </div>
  <div class="user">
    <div class="logo">
      <img v-if="photoUrl" v-lazy="{ src: photoUrl, error: '/images/not-logo.png' }" />
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

  <div class="buttons">
    <a
      :href="`https://t.me/${userInfo?.username}`"
      class="send-me"
      v-if="userInfo?.settings.enabled_send_me_button"
    >
      <IconTelegram />
      <span>{{ $t('sendMe') }}</span>
    </a>
    <van-loading v-if="socialLinksData === undefined" />
    <TransitionGroup>
      <a :href="getFullUrl(social.url)" target="_blank" v-for="social in socialLinks" :key="social.id">
        <component :is="getSocialLinkIcon(social.url)" />
      </a>
    </TransitionGroup>
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
