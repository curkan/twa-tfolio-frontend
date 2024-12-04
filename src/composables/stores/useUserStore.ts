import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from '../types/user.type'

export const useUserStore = defineStore('useUserStore', () => {
  const authUser = ref<IUser>()

  return { authUser }
})
