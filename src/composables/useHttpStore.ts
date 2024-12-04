import axios from 'axios'
import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import testUserDate from '@/configs/userData.config'
import { useWebApp } from 'vue-tg'

export const useHttpStore = defineStore('useHttpStore', () => {
  const initDataState = ref()

  if (process.env.NODE_ENV === 'development') {
    initDataState.value = testUserDate
  } else {
    initDataState.value = useWebApp().initData
  }

  const http = ref(
    axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + initDataState.value,
      },
    }),
  )

  return { http }
})
