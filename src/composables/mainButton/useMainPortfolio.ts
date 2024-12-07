import i18n from '@/i18n';
import { ref, computed } from 'vue'
import {useWebApp, useWebAppMainButton} from 'vue-tg';

export const showShare = ref(false);

export const useMainPortfolio = () => {
  useWebAppMainButton().setMainButtonText(i18n.global.t('tg.mainPortfolio'))
  useWebAppMainButton().showMainButton()
  Telegram.WebApp.onEvent('mainButtonClicked', useCleareStartParam)
}

export const useCleareStartParam = () => {
  useWebApp().initDataUnsafe.start_param = undefined
}
