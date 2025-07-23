<script lang="ts" setup>
import {useViewportStore} from '@/composables/stores/useViewportStore'
import { showImagePreview } from 'vant'
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import IconRight from '../icons/IconRight.vue'
const about = ref()

const items = ref([
  'https://storage.yandexcloud.net/tgfolio-dev-images/443472294/386/NYOmz7RKeWi8i5zl9m7wejcV7fP66prW9HvOvrUs.webp',
  'https://storage.yandexcloud.net/tgfolio-dev-images/443472294/385/BA4FJg0q8JVGuy4LVLYQeIvbLTvbOHpoF5hdUFkn.webp',
  'https://storage.yandexcloud.net/tgfolio-dev-images/443472294/384/6a7qJ2K4GxaKhItzaUeNtg7X7cV5GLbPOO3TZFBY.webp',
  'https://storage.yandexcloud.net/tgfolio-dev-images/443472294/382/0ZB7nOEfOMFl7ZartRKLHjP0mdIEcWUBkIDIC7fU.webp',
])

const { t } = useI18n({
  inheritLocale: false, // (опционально) наследует глобальную локаль
  messages: {
    en: { writeAboutPublication: "Write about publication" },
    ru: { writeAboutPublication: "Напишите о публикации" }
  }
});

const openImagePreview = (startPosition: number) => {
  showImagePreview({
    images: items.value,
    closeOnClickOverlay: true,
    startPosition: startPosition,
    closeable: true,
    loop: false,
  })
}

const deleteImage = (index: number) => {
  items.value.splice(index, 1);
}

const handleTouchStart = (e: TouchEvent) => {
  useViewportStore().disabledBackSwipe = true

  setTimeout(() => {
    useViewportStore().disabledBackSwipe = false
  }, 500)
}

</script>
<template>
  <div class="upload-container h-full">
    <swiper-container
        @touchstart="handleTouchStart"
        @touchend="handleTouchStart"
        class="h-[300px] m-2"
        :slides-per-view="2.5"
        :space-between="10"
        :cssMode="true"
        :centered-slides="false"
        :breakpoints="{
          768: {
            slidesPerView: 2.5,
          },
        }"
      >
        <TransitionGroup mode="out-in">
          <swiper-slide
            class="rounded-lg bg-zinc-600 h-full bg-cover bg-center"
            :style="`background-image: url(${url})`"
            @click="openImagePreview(index)"
            v-for="(url, index) in items"
          >
            <button class="ui-remove absolute right-2 top-2" @click.stop="deleteImage(index)">
              <IconRemove />
            </button>
          </swiper-slide>
        </TransitionGroup>
      </swiper-container>
      <van-cell-group :title="$t('description')">
        <van-field
          v-model="about"
          type="textarea"
          name="about"
          autosize
          :placeholder="t('writeAboutPublication')"
        />
      </van-cell-group>
  </div>
  <div class="next-upload p-3 bg-zinc-800 rounded-full flex justify-center items-center fixed bottom-4 right-4" type="button">
    <IconRight />
  </div>

</template>

