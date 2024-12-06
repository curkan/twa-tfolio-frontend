import axios from 'axios'
import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserData } from '@/configs/userData.config'

export const useHttpStore = defineStore('useHttpStore', () => {
  const http = ref(
    axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + btoa(useUserData() as string),
      },
    }),
  )

  return { http }
})
