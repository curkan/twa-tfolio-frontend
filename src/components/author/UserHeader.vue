<script setup lang="ts">
import { useAuth } from '@/composables/auth/auth'
import { useUserStore } from '@/composables/stores/useUserStore'
import { useUpdateUser } from '@/composables/user/useUpdateUser'
import { showSuccessToast, showToast } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { useWebAppHapticFeedback, useWebAppMainButton } from 'vue-tg'
import LocaleSwitcher from './../main/LocaleSwitcher.vue'
import { useSave } from '@/composables/mainButton/useSave'
import { useChangeShowShare, useShare } from '@/composables/mainButton/useShare'
import IconTelegram from '../icons/IconTelegram.vue'
import IconInstagram from '../icons/IconInstagram.vue'
import IconYoutube from '../icons/IconYoutube.vue'
import type { ISocialLinks } from '@/composables/types/social-links.type'
const showEditProfile = ref(false)
const displayName = ref()
const biography = ref()
const loading = ref(true)
const checkedShowButtonContact = ref(true)
const links = ref<ISocialLinks[]>()
const addRow = () => {
  if (
    links.value !== undefined &&
    links.value.length > 0 &&
    links.value[links.value.length - 1].url == ''
  )
    return

  if (links.value === undefined) {
    links.value = [
      {
        id: 1,
        url: '',
      },
    ]
  } else {
    links.value?.push({
      id: links.value.length + 1,
      url: '',
    })
  }
}

const removeRowLink = (id: number) => {
  links.value = links.value?.filter((item) => item.id !== id)
}

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
          {{ $t('main.displayNameNotFound') }}
        </span>
      </div>
      <div class="biography" v-if="!loading">
        <span v-if="useUserStore().authUser?.biography">
          {{ useUserStore().authUser?.biography }}
        </span>
        <span v-else class="notSet">
          {{ $t('main.biographyNotFound') }}
        </span>
      </div>
      <div class="buttons" @click.stop>
        <a href="https://t.me/tsurkan_hut" class="send-me">
          <IconTelegram />
          <span>{{ $t('sendMe') }}</span>
        </a>
        <a>
          <IconInstagram />
        </a>
        <a>
          <IconYoutube />
        </a>
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
      <van-cell-group :title="$t('editProfile')">
        <van-field
          :label-width="150"
          v-model="displayName"
          name="displayName"
          :label="$t('userDisplayName')"
          @keypress=""
          :rules="[{ required: true, message: 'Display name is required' }]"
          :placeholder="$t('userDisplayName')"
        />

        <van-field
          v-model="biography"
          :label-width="150"
          type="textarea"
          name="about"
          autosize
          :label="$t('userBiography')"
          :placeholder="$t('writeAboutYou')"
        />

        <van-field
          :label-width="200"
          name="notifyInBot"
          :label="$t('checkedShowButtonContact')"
          center
          label-align="left"
          input-align="right"
        >
          <template #input right>
            <van-switch v-model="checkedShowButtonContact" />
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group :title="$t('editSocialLinks')" required="auto">
        <van-field
          v-for="link in links"
          :key="link.id"
          v-model="link.url"
          placeholder="Введите ссылку"
        >
          <template #button>
            <van-button size="small" type="danger" @click="removeRowLink(link.id)">
              Удалить
            </van-button>
          </template>
        </van-field>
        <div class="button">
          <van-button block type="primary" @click="addRow">Добавить ссылку</van-button>
        </div>
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
