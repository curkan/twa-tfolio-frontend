import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@vant/touch-emulator'

import App from './App.vue'
import router from './router'
import VueLazyLoad from 'vue3-lazyload'

import 'vant/lib/index.css'
import i18n from './i18n'

import Vue3TouchEvents, {
  type Vue3TouchEventsOptions,
} from "vue3-touch-events";

const app = createApp(App)

app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
  disableClick: false
  // any other global options...
})

app.use(createPinia())
app.use(router)

app.use(VueLazyLoad, {})
app.use(i18n)

app.mixin({
  mounted() {
    // Скрываем загрузочный экран после монтирования корневого компонента
    const loaderScreen = document.getElementById('container-loader-screen');
    loaderScreen?.classList.add('fade-out');
    setTimeout(() => {
      if (loaderScreen) {
        loaderScreen.style.display = 'none';
      }
    }, 500);
  }
});

app.mount('#app')
