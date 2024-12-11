import i18n from '@/i18n'
import { useWebAppMainButton } from 'vue-tg'

const { onMainButtonClicked } = useWebAppMainButton()
type SaveCallback = () => void

export const useSave = (callback: SaveCallback) => {
  useWebAppMainButton().setMainButtonText(i18n.global.t('tg.save'))
  Telegram.WebApp.onEvent('mainButtonClicked', callback)
}
