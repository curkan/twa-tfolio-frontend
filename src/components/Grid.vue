<script setup lang="ts">

import {GridStack, type GridItemHTMLElement, type GridStackNode} from 'gridstack';
import { createApp, ref, onMounted, nextTick } from 'vue';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';
import {useWebApp, useWebAppHapticFeedback} from 'vue-tg';
import IconPlus from './icons/IconPlus.vue';


let count = ref(0);
let info = ref("");
let gridFloat = ref(false);
let color = ref("black");
let gridInfo = ref("");
let grid = null as GridStack; // DO NOT use ref(null) as proxies GS will break all logic when comparing structures... see https://github.com/gridstack/gridstack.js/issues/2115
let items = ref([]);

window.Telegram.WebApp.setHeaderColor('#212121')
window.Telegram.WebApp.setBackgroundColor('#212121')
window.Telegram.WebApp.setBottomBarColor('#212121')
window.Telegram.WebApp.setBottomBarColor('#212121')
window.Telegram.WebApp.expand()
if (window.Telegram.WebApp.isVersionAtLeast('8.0')) {
  window.Telegram.WebApp.requestFullscreen()
}
onMounted(() => {
  // GridStack.setupDragIn('.sidebar .grid-stack-item', {pause: 500});
  grid = GridStack.init({ // DO NOT user grid.value = GridStack.init(), see above
    float: false,
    column: 4,
  });

  let nodes = []

  nodes = [
    {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
    },
    {
      x: 2,
      y: 2,
      w: 1,
      h: 1,
    },
    {
      x: 3,
      y: 2,
      w: 1,
      h: 1,
    },
    {
      x: 2,
      y: 3,
      w: 1,
      h: 1,
    },
    {
      x: 3,
      y: 3,
      w: 1,
      h: 1,
    },
    {
      x: 0,
      y: 3,
      w: 4,
      h: 2,
    },
    {
      x: 0,
      y: 5,
      w: 2,
      h: 2,
    },
    {
      x: 2,
      y: 5,
      w: 2,
      h: 2,
    },
  ]

  // items.value.push(...nodes);
  grid.on("dragstop", function (event, element) {
    const node = element.gridstackNode;
    info.value = `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`;
  });

  grid.on('change', onChange);

  grid.on('dragstart', function(event: Event, el: GridItemHTMLElement) {
    if (el.gridstackNode) {
      let node: GridStackNode = el.gridstackNode;
    }
    grid.enableMove(false)

    useWebAppHapticFeedback().impactOccurred('light')
  });

  grid.on('dragstop', function(event: Event, el: GridItemHTMLElement) {
    grid.enableMove(true)
    useWebAppHapticFeedback().impactOccurred('light')
  });

  nodes.forEach((node) => {
    node.id = 'w_'+ (count.value++);
    items.value.push(node);
    nextTick(()=>{
      grid.makeWidget(node.id);
      updateInfo();
    });

  })
  // gridFloat.value = grid.float();
});

function changeFloat() {
  gridFloat.value = !gridFloat.value;
  grid.float(gridFloat.value);
}

function onChange(event, changeItems) {
  updateInfo();
  // update item position
  changeItems.forEach(item => {
    var widget = items.value.find(w => w.id == item.id);
    // console.log(widget)
    if (!widget) {
      alert("Widget not found: " + item.id);
      return;
    }
    widget.x = item.x;
    widget.y = item.y;
    widget.w = item.w;
    widget.h = item.h;
  });
}

function addNewWidget2() {
  const node = items[count.value] || { x: 0, y: 0, w: 2, h: 2 };

  node.id = 'w_'+ (count.value++);
  items.value.push(node);
  nextTick(()=>{
    grid.makeWidget(node.id);
    updateInfo();
  });
}

function removeLastWidget() {
  if (count.value == 0) return;
  var id = `w_${count.value-1}`;
  var index = items.value.findIndex(w => w.id == id);
  if (index < 0) return;
  var removed = items.value[index];
  remove(removed);
}

function remove(widget) {
  var index = items.value.findIndex(w => w.id == widget.id);
  items.value.splice(index, 1);
  const selector = `#${widget.id}`;
  grid.removeWidget(selector, false);
  updateInfo();
}

function updateInfo() {
  color.value = grid.engine.nodes.length == items.value.length ? "black" : "red";
  gridInfo.value = `Grid engine: ${grid.engine.nodes.length}, widgets: ${items.value.length}`;
}
</script>

<template>
    <button class="add-new-widget" type="button" @click="addNewWidget2()">
      <IconPlus/>
    </button>


    <div class="grid-stack">
      <div v-for="(w, indexs) in items"
        class="grid-stack-item"
        :gs-x="w.x"
        :gs-y="w.y"
        :gs-w="w.w"
        :gs-h="w.h"
        :gs-id="w.id"
        :id="w.id"
        :key="w.id"
      >
        <div class="grid-stack-item-content">
          <!-- <button @click="remove(w)">remove</button> -->
          <!-- {{w}} -->
        </div>
      </div>
    </div>

</template>

<style scoped lang="scss">
/* @use 'gridstack/dist/gridstack.min.css'; */
@use '@/assets/scss/base.scss';
</style>
