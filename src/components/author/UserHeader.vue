<script setup lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { useUserStore } from '@/composables/stores/useUserStore'
import { useUpdateUser } from '@/composables/user/useUpdateUser'
import { showSuccessToast, showToast } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { useWebAppHapticFeedback, useWebAppMainButton } from 'vue-tg'
import LocaleSwitcher from './../main/LocaleSwitcher.vue'
import {useSave} from '@/composables/mainButton/useSave'
import {useChangeShowShare, useShare} from '@/composables/mainButton/useShare'
const showEditProfile = ref(false)
const displayName = ref()
const biography = ref()
const loading = ref(true)

onMounted(async () => {
  if (useUserStore().authUser) {
    loading.value = false
    displayName.value = useUserStore().authUser?.display_name
    biography.value = useUserStore().authUser?.biography
  } else {
    await useAuth().then(() => {
      loading.value = false
      displayName.value = useUserStore().authUser?.display_name
      biography.value = useUserStore().authUser?.biography
    })
  }
})

watch(
  () => showEditProfile.value,
  () => {
    if (showEditProfile.value === true) {
      Telegram.WebApp.offEvent('mainButtonClicked', useChangeShowShare)
      useSave(saveUserProfile)
    } else {
      Telegram.WebApp.offEvent('mainButtonClicked', saveUserProfile)
      useShare()
    }
  },
)

const showEditProfileHandle = () => {
  showEditProfile.value = !showEditProfile.value
}

const saveUserProfile = () => {
  Telegram.WebApp.offEvent('mainButtonClicked', saveUserProfile)
  showEditProfile.value = false
  useUpdateUser(displayName.value, biography.value).then((response) => {
    useWebAppHapticFeedback().notificationOccurred('success')
    showSuccessToast('Success')
  })
}
</script>

<template>
  <div class="locale-block">
    <LocaleSwitcher />
  </div>
  <div class="user">
    <div class="logo">
      <img
        v-if="useUserStore().authUser?.photo_url"
        v-lazy="{ src: useUserStore().authUser?.photo_url, error: '/images/not-logo.png' }"
      />
      <van-skeleton-image v-else />
    </div>
    <div class="info" @click="showEditProfileHandle">
      <div v-if="loading">
        <van-skeleton title :row="1" />
      </div>
      <div class="username" v-if="!loading">
        <span v-if="useUserStore().authUser?.display_name">
          {{ useUserStore().authUser?.display_name }}
        </span>
        <span v-else class="notSet">
          {{$t('main.displayNameNotFound')}}
        </span>
      </div>
      <div class="biography" v-if="!loading">
        <span v-if="useUserStore().authUser?.biography">
          {{ useUserStore().authUser?.biography }}
        </span>
        <span v-else class="notSet">
          {{$t('main.biographyNotFound')}}
        </span>
      </div>
    </div>
  </div>
  <van-popup
    v-model:show="showEditProfile"
    round
    closeable
    position="bottom"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
    :style="{ height: '80%' }"
    class="popup-edit-user"
  >
    <div class="data">
      <van-cell-group title="Edit profile">
        <van-field
          v-model="displayName"
          name="displayName"
          :label="$t('userDisplayName')"
          placeholder="Display name"
          @keypress=""
          :rules="[{ required: true, message: 'Display name is required' }]"
        />

        <van-field
          v-model="biography"
          name="about"
          :label="$t('userBiography')"
          placeholder="Write about you"
        />
      </van-cell-group>
    </div>
    <!-- <div class="button"> -->
    <!--   <van-button type="primary" size="large" @click="saveUserProfile">{{ -->
    <!--     $t('main.save') -->
    <!--   }}</van-button> -->
    <!-- </div> -->
  </van-popup>
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
