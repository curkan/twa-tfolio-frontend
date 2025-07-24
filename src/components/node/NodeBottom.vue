<script setup lang="ts">
import { type IUserNode, type Node } from '@/composables/types/grid.type'
import IconFire from '../icons/IconFire.vue';
import {ref} from 'vue';
import {useLikeNode} from '@/composables/author/node/useLikeNode';
import {useNodeStore} from '@/stores/useNodeStore';
import {useHumanizeNumber} from '@/composables/utils/useHumanizeNumber';

const props = defineProps({
  user: {
    type: Object as () => IUserNode,
    required: true
  },
  node: {
    type: Object as () => Node,
    required: true
  },
})
const localLikesCount = ref(props.node.likes_count);
const isLiked = ref(props.node.meta?.is_liked ?? false);
const isLoading = ref(false);
const isActionPending = ref(false);

const setOrUnsetLike = async () => {
  if (isActionPending.value) return;

  isActionPending.value = true;

  // Мгновенное обновление UI
  const wasLiked = isLiked.value;
  isLiked.value = !wasLiked;
  localLikesCount.value += wasLiked ? -1 : 1;

  isLoading.value = true;
  await useLikeNode(Number(props.node.id)).then((data) => {
    useNodeStore().currentNode = data.data as Node
  }).finally(() => {
    isLoading.value = false;
    isActionPending.value = false;
  })
};

</script>

<template>
  <div class="node-item-bottom my-2">
    <section class="elements grid grid-cols-2">
      <div class="left-elements flex">
        <div class="btn-element p-2 pl-0 pr-0" @click="setOrUnsetLike">
          <span>
            <IconFire :solid="node.meta.is_liked" />
          </span>
        </div>
        <div class="element p-2">
          <span>
            {{$t('main.liked')}}
            <span class="font-bold">{{useHumanizeNumber(node.likes_count)}}</span>
          </span>
        </div>
      </div>
      <div class="right-elements"></div>
    </section>
    <!-- <section> -->
    <!--   <div class="date text-zinc-400">19 сентября</div> -->
    <!-- </section> -->
    <section class="description">
      <article class="">
        <span class="username font-bold mr-2">{{user.display_name}}</span>
        <span>{{node.description}}</span>
      </article>
    </section>
  </div>
</template>
<style scoped lang="scss">
@use '@/assets/scss/node/node-bottom.scss';
</style>
