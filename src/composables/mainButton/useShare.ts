import i18n from '@/i18n'
import { ref, computed } from 'vue'
import { useMainButton } from 'vue-tg/latest'

export const showShare = ref(false)

export const useShare = () => {
  useMainButton().text.value = i18n.global.t('tg.share')
  useMainButton().show()
  Telegram.WebApp.onEvent('mainButtonClicked', useChangeShowShare)
}

export const useChangeShowShare = () => {
  showShare.value = !showShare.value
}

export const useOffShareEvent = () => {
  Telegram.WebApp.offEvent('mainButtonClicked', useChangeShowShare)
}
