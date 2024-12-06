import i18n from '@/i18n';
import { ref, computed } from 'vue'
import {useWebAppMainButton} from 'vue-tg';

const { onMainButtonClicked } = useWebAppMainButton();
export const showShare = ref(false);

export const useShare = () => {
  useWebAppMainButton().setMainButtonText(i18n.global.t('tg.share'))
  useWebAppMainButton().showMainButton()
  Telegram.WebApp.onEvent('mainButtonClicked', useChangeShowShare)
}

export const useChangeShowShare = () => {
  showShare.value = !showShare.value
}
