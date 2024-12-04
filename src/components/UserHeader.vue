<script setup lang="ts">
import { showSuccessToast } from 'vant'
import { ref, watch } from 'vue'
import { useWebApp, useWebAppHapticFeedback, useWebAppMainButton } from 'vue-tg'
const showEditProfile = ref(false)
const displayName = ref(useWebApp().initDataUnsafe.user?.username)
const aboutYou = ref('Just a little bit more')

const saveUserProfile = () => {
  showEditProfile.value = false




  useWebAppHapticFeedback().notificationOccurred('success')
  showSuccessToast('Success')
}

const imageList = ref([{ url: useWebApp().initDataUnsafe.user?.photo_url }])
</script>

<template>
  <div class="user">
    <div class="logo">
      <van-uploader v-model="imageList" reupload max-count="1" :preview-size="100" />

      <!-- <img v-lazy="useWebApp().initDataUnsafe.user?.photo_url" alt="" srcset="" /> -->
    </div>
    <div class="info" @click="showEditProfile = !showEditProfile">
      <div class="username">
        {{ useWebApp().initDataUnsafe.user?.first_name }}
        {{ useWebApp().initDataUnsafe.user?.last_name }}
      </div>
      <div class="biography">{{ aboutYou }}</div>
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
          label="Display Name"
          placeholder="Display name"
          @keypress=""
          :rules="[{ required: true, message: 'Display name is required' }]"
        />

        <van-field
          v-model="aboutYou"
          name="about"
          label="About you"
          placeholder="Write about you"
        />
      </van-cell-group>
    </div>
    <div class="button">
      <van-button type="primary" size="large" @click="saveUserProfile">Save</van-button>
    </div>
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
