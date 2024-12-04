import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@vant/touch-emulator'

import App from './App.vue'
import router from './router'
import VueLazyLoad from 'vue3-lazyload'

import 'vant/lib/index.css'
import i18n from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueLazyLoad, {})
app.use(i18n)

app.mount('#app')
