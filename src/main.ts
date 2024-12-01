import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@vant/touch-emulator'

import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'

import 'vant/lib/index.css'

const app = createApp(App)

app.use(VueLazyload)
app.use(createPinia())
app.use(router)

app.mount('#app')
