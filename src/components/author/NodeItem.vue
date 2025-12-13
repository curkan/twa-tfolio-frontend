<script setup lang="ts">
import { NodeType, type Node } from '@/composables/types/grid.type'
import NodeTop from '../node/NodeTop.vue';
import ImageViewer from '../node/ImageViewer.vue';
import NodeBottom from '../node/NodeBottom.vue';
import IconEdit from '../icons/IconEdit.vue';
import {defineAsyncComponent, inject, onMounted, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {showConfirmDialog, showFailToast, showLoadingToast, showSuccessToast} from 'vant';
import {useViewportStore} from '@/composables/stores/useViewportStore';
import {useChangeShowShare, useShare} from '@/composables/mainButton/useShare';
import {useSave} from '@/composables/mainButton/useSave';
import {useHapticFeedback, useMainButton, useMiniApp} from 'vue-tg/latest';
import {useUpdateNode} from '@/composables/author/node/useUpdateNode';
const hapticFeedback = useHapticFeedback()
import { isVersionAtLeast } from 'vue-tg'
import {useNodeStore} from '@/stores/useNodeStore';
import {useLikeNode} from '@/composables/author/node/useLikeNode';

const about = ref()
const disabledBackSwipe = ref(false)
const isTextareaFocused = ref(false)
const viewportStore = useViewportStore()

const props = defineProps({
  item: {
    type: Object as () => Node,
    required: true
  },
})

const { t } = useI18n({
  inheritLocale: true, // (опционально) наследует глобальную локаль
  messages: {
    en: { writeAboutPublication: "Write about publication" },
    ru: { writeAboutPublication: "Напишите о публикации" }
  }
});

const showEditNode = ref(false)

const doSwipeDown = () => {
  if (disabledBackSwipe.value || isTextareaFocused.value) return

  confirmClose().then((result) => {
    if (result) {
      showEditNode.value = false
    }
  })
};

const confirmClose = async () => {
  if (props.item.description === null && about.value == "") {
    // Сбрасываем состояние при закрытии
    isTextareaFocused.value = false
    viewportStore.disabledBackSwipe = false
    return true
  }
  if (JSON.stringify(about.value) == JSON.stringify(props.item.description)) {
    // Сбрасываем состояние при закрытии
    isTextareaFocused.value = false
    viewportStore.disabledBackSwipe = false
    return true
  }

  return showConfirmDialog({
    confirmButtonText: t('vant.confirmButtonText'),
    cancelButtonText: t('vant.confirmButtonText'),
    title: t('vant.areYouSure'),
    message: t('vant.messageConfigClosePage'),
  })
    .then(() => {
      // on confirm
      about.value = props.item.description
      // Сбрасываем состояние при подтверждении закрытия
      isTextareaFocused.value = false
      viewportStore.disabledBackSwipe = false
      return true;
    })
    .catch(() => {
      // on cancel - не сбрасываем состояние, popup остается открытым
      return false;
    });
}

const handleTouchStart = (e: TouchEvent) => {
  disabledBackSwipe.value = true

  setTimeout(() => {
    disabledBackSwipe.value = false
  }, 500)
}

const handleTextareaFocus = () => {
  isTextareaFocused.value = true
  viewportStore.disabledBackSwipe = true
}

const handleTextareaBlur = () => {
  isTextareaFocused.value = false
  viewportStore.disabledBackSwipe = false
}

const handleTextareaTouchStart = () => {
  isTextareaFocused.value = true
  viewportStore.disabledBackSwipe = true
}

const handleTextareaInput = () => {
  // Дополнительная проверка при вводе
  if (!isTextareaFocused.value) {
    isTextareaFocused.value = true
    viewportStore.disabledBackSwipe = true
  }
}

const handleTextareaAreaTouch = (event: TouchEvent) => {
  // Проверяем, что касание происходит в области textarea
  const target = event.target as HTMLElement
  if (target && (target.tagName === 'TEXTAREA' || target.closest('textarea') || target.closest('.van-field__control'))) {
    isTextareaFocused.value = true
    viewportStore.disabledBackSwipe = true
  }
}

const handleOutsideClick = (event: TouchEvent) => {
  const target = event.target as HTMLElement
  // Если касание НЕ в области textarea, разрешаем свайп
  if (target && !target.closest('.van-field') && !target.closest('textarea')) {
    isTextareaFocused.value = false
    viewportStore.disabledBackSwipe = false
  }
}

const saveNode = () => {
  Telegram.WebApp.offEvent('mainButtonClicked', saveNode)
  showLoadingToast('Loading')
  useUpdateNode(
    Number(props.item.id),
    about.value,
  ).then((response) => {
    if(isVersionAtLeast('6.1')) {
      hapticFeedback.notificationOccurred('success')
    }

    useNodeStore().updateCurrentNode()

    // Сбрасываем состояние перед закрытием
    isTextareaFocused.value = false
    viewportStore.disabledBackSwipe = false

    showEditNode.value = false
    showSuccessToast('Success')
  }).catch((error) => {
    alert(error)
    console.error('Error fetching data:', error)
    if(isVersionAtLeast('6.1')) {
      hapticFeedback.impactOccurred('heavy')
    }
    showFailToast('Fail')
  })

}

watch(
  () => showEditNode.value,
  (newValue) => {
    if (newValue === true) {
      // Сбрасываем состояние при открытии
      isTextareaFocused.value = false
      viewportStore.disabledBackSwipe = false

      useMainButton().show()
      Telegram.WebApp.offEvent('mainButtonClicked', useChangeShowShare)
      useSave(saveNode)
    } else {
      Telegram.WebApp.offEvent('mainButtonClicked', saveNode)
      useMainButton().hide()
      // Разрешаем свайп при закрытии popup
      isTextareaFocused.value = false
      viewportStore.disabledBackSwipe = false
    }
  },
)

const handleDoubleTap = () => {
  if (useNodeStore().currentNode?.meta.is_liked === false) {
    useLikeNode(Number(props.item.id)).then((data) => {
      useNodeStore().currentNode = data.data as Node
    }).finally(() => {

    })
  }
}

onMounted(() => {
  about.value = props.item.description
})
</script>

<template>
  <div class="edit-mode p-3 bg-zinc-800 rounded-lg flex justify-center items-center fixed bottom-4 right-4 z-30">
    <IconEdit @click.stop="showEditNode = !showEditNode" />
  </div>

  <div
    class="node-item w-full"
  >
    <NodeTop class="w-full" :user="item.user"/>
    <div class="node-item-content">
      <template v-if="item.type === NodeType.image">
        <div class="img">
          <ImageViewer :image-src="item.image.original" @double-click="handleDoubleTap"/>
        </div>
      </template>
      <template v-if="item.type === NodeType.video">
        <div class="img">
          <ImageViewer :video-src="item.video_url" @double-click="handleDoubleTap"/>
        </div>
      </template>
    </div>
    <NodeBottom class="w-full" :node="item" :user="item.user"/>
  </div>

  <van-popup
    v-model:show="showEditNode"
    round
    closeable
    position="bottom"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
    :style="{ height: '80%' }"
    class="popup-edit-node"
    :before-close="confirmClose"
  >
    <div class="data h-full flex flex-col gap-2"
      v-touch:swipe.bottom="doSwipeDown"
      @touchstart="handleOutsideClick"
    >
      <van-cell-group
        :title="$t('main.description')"
        @touchstart="handleTextareaAreaTouch"
      >
        <van-field
          v-model="about"
          type="textarea"
          :autofocus="true"
          name="about"
          :autosize="{minHeight: 300, maxHeight: 300}"
          :maxlength="2200"
          :show-word-limit="true"
          :placeholder="t('writeAboutPublication')"
          @focus="handleTextareaFocus"
          @blur="handleTextareaBlur"
          @touchstart="handleTextareaTouchStart"
          @input="handleTextareaInput"
        />
      </van-cell-group>
      <div class="button p-5" v-if="!useViewportStore().isTelegramApp">
        <van-button type="primary" size="large" @click="saveNode">{{
          $t('main.save')
        }}</van-button>
      </div>
    </div>
  </van-popup>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-item.scss';
</style>
