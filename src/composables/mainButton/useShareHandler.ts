import { onMounted, ref } from 'vue'
import { useMiniApp } from 'vue-tg/latest'
import { showToast } from 'vant'
import i18n from '@/i18n'
import { showShare, useOffShareEvent, useShare } from '@/composables/mainButton/useShare'
import {useUserStore} from '../stores/useUserStore'

export function useShareHandler() {
  const shareOptions = ref([
    {
      name: i18n.global.t('share.link'),
      icon: 'link',
      handler: () => copyUserLink()
    }
  ])

  /**
   * Копирует ссылку на профиль пользователя
   */
  const copyUserLink = async () => {
    const userId = useUserStore().authUser?.id

    if (!userId) {
      showToast(i18n.global.t('errors.user_not_found'))
      return
    }

    const url = `${import.meta.env.VITE_BOT_URL}?startapp=${userId}`
    navigator.clipboard.writeText(url)
      .then(() => showToast(i18n.global.t('main.copied')))
      .catch(() => showToast(i18n.global.t('errors.copy_failed')))
  }

  /**
   * Инициализирует обработчик кнопки "Поделиться"
   */
  const setupShare = () => {
    useShare()
  }

  /**
   * Очищает подписки на события
   */
  const cleanupShare = () => {
    useOffShareEvent()
  }

  /**
   * Обрабатывает выбор варианта шаринга
   * @param option - Выбранная опция
   */
  const handleShareSelect = (option: { name: string; icon: string }) => {
    const foundOption = shareOptions.value.find(opt => opt.name === option.name)
    foundOption?.handler()
    showShare.value = false
  }

  return {
    shareOptions,
    setupShare,
    cleanupShare,
    handleShareSelect
  }
}
