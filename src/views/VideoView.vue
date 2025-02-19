<script setup lang="ts">
import LoaderBlock from '@/components/loaders/LoaderBlock.vue';
import {useGetNodeData} from '@/composables/grid/useGetNodeData';
import type {Node} from '@/composables/types/grid.type';
import router from '@/router';
import {useNodeStore} from '@/stores/useNodeStore';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import {onBeforeMount, onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {useBackButton, useMiniApp} from 'vue-tg/latest';

const backButton = useBackButton()

backButton.show()
backButton.onClick(() => {
  backButton.hide()
  router.push('/')
})

onMounted(() => {
  if (useNodeStore().currentNode === undefined) {
    useGetNodeData(Number(useRoute().params.id)).then((data) => {
      useNodeStore().currentNode = data as Node
      makeVliteJs()
    })
  } else {
    makeVliteJs()
  }

})

const makeVliteJs = () => {
  const player = new Plyr(
    '#player', {
      fullscreen: {
        iosNative: true
      },
    }
  );
};

const doSwipeRight = () => {
  router.push('/')
};

</script>
<template>
  <div class="video-container" v-touch:swipe.right="doSwipeRight">
    <!-- <Transition mode="out-in"> -->
    <!--   <LoaderBlock v-if="!useNodeStore().currentNode"/> -->
    <!-- </Transition> -->
    <Transition>
    <div v-show="useNodeStore().currentNode">
      <video
        id="player"
        :src="useNodeStore().currentNode?.video_url"
        :data-poster="useNodeStore().currentNode?.image.original"
        fullscreen
        playsinline
      ></video>
    </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/view-video.scss';
:deep(.plyr) {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgb(0, 0, 0) 0px 20px 30px -10px;;
}
</style>

