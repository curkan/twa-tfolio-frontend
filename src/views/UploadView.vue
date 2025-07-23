<script setup lang="ts">
import UploadContainer from '@/components/author/UploadContainer.vue';
import {useViewportStore} from '@/composables/stores/useViewportStore';
import router from '@/router';
import {showConfirmDialog} from 'vant';
import { useMainButton } from 'vue-tg/latest'

import {onMounted} from 'vue';
import {useBackButton, useMiniApp} from 'vue-tg/latest';

const backButton = useBackButton()
import { useI18n } from 'vue-i18n';

const { t } = useI18n({
  inheritLocale: false, // (опционально) наследует глобальную локаль
  messages: {
    en: { messageConfigClosePage: "If you close the page, all unsaved data will be lost" },
    ru: { messageConfigClosePage: "Если вы закроете страницу, все несохранённые данные будут потеряны" }
  }
});

backButton.show()
backButton.onClick(() => {
  backButton.hide()
  router.push('/')
})

onMounted(() => {
  useMainButton().hide()
})

const configClose = () => {
  showConfirmDialog({
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel',
    title: 'Title',
    message: t('messageConfigClosePage'),
  })
    .then(() => {
      router.push('/')
      // on confirm
    })
    .catch(() => {
      // on cancel
    });
}


const doSwipeRight = () => {
  if (!useViewportStore().disabledBackSwipe) {
    configClose()
  }
};

</script>
<template>
  <div style="height: 100%;" v-touch:swipe.right="doSwipeRight">
    <UploadContainer />
  </div>
</template>
