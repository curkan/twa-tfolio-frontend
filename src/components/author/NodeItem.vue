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
  if (disabledBackSwipe.value) return

  confirmClose().then((result) => {
    if (result) {
      showEditNode.value = false
    }
  })
};

const confirmClose = async () => {
  if (props.item.description === null && about.value == "") return true
  if (JSON.stringify(about.value) == JSON.stringify(props.item.description)) return true

  return showConfirmDialog({
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel',
    title: 'Title',
    message: t('vant.messageConfigClosePage'),
  })
    .then(() => {
      // on confirm
      about.value = props.item.description

      return true;
    })
    .catch(() => {
      // on cancel
      return false;
    });
}

const handleTouchStart = (e: TouchEvent) => {
  disabledBackSwipe.value = true

  setTimeout(() => {
    disabledBackSwipe.value = false
  }, 500)
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
  () => {
    if (showEditNode.value === true) {
      useMainButton().show()
      Telegram.WebApp.offEvent('mainButtonClicked', useChangeShowShare)
      useSave(saveNode)
    } else {
      Telegram.WebApp.offEvent('mainButtonClicked', saveNode)
      useMainButton().hide()
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
    :style="{ height: '60%' }"
    class="popup-edit-node"
    :before-close="confirmClose"
  >
    <div class="data h-full flex flex-col gap-2"
      v-touch:swipe.bottom="doSwipeDown"
    >
      <van-cell-group
        :title="$t('description')"
      >
        <van-field
          v-model="about"
          type="textarea"
          :autofocus="true"
          name="about"
          :autosize="{minHeight: 200, maxHeight: 2000}"
          :maxlength="2200"
          :show-word-limit="true"
          :placeholder="t('writeAboutPublication')"
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
