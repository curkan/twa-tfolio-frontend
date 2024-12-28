import IconBehance from "@/components/icons/IconBehance.vue"
import IconBoosty from "@/components/icons/IconBoosty.vue"
import IconDribbble from "@/components/icons/IconDribbble.vue"
import IconDzen from "@/components/icons/IconDzen.vue"
import IconGoga from "@/components/icons/IconGoga.vue"
import IconInstagram from "@/components/icons/IconInstagram.vue"
import IconLink from "@/components/icons/IconLink.vue"
import IconPinterest from "@/components/icons/IconPinterest.vue"
import IconTelegram from "@/components/icons/IconTelegram.vue"
import IconVcRu from "@/components/icons/IconVcRu.vue"
import IconVK from "@/components/icons/IconVK.vue"
import IconYoutube from "@/components/icons/IconYoutube.vue"

export const socialLinksIcons = {
  'youtube.com': IconYoutube,
  't.me': IconTelegram,
  'vk.com': IconVK,
  'behance.net': IconBehance,
  'dzen.ru': IconDzen,
  'boosty.to': IconBoosty,
  'dribbble.com': IconDribbble,
  'goga.zone': IconGoga,
  'pinterest.com': IconPinterest,
  'vc.ru': IconVcRu,
  'instagram.com': IconInstagram,
}

export function getSocialLinkIcon(url: string): string {
  const domain = url.replace('https://', '').replace('http://', '').split('/')[0]
  return socialLinksIcons[domain] || IconLink
}
