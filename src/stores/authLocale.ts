import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  authLocaleOptions,
  defaultAuthLocale,
  getAuthMessage,
  type AuthLocale,
} from '../data/authLocale'

export const useAuthLocaleStore = defineStore('auth-locale', () => {
  const locale = ref<AuthLocale>(defaultAuthLocale)
  const pendingLocale = ref<AuthLocale>(defaultAuthLocale)
  const sheetVisible = ref(false)

  const currentLanguageLabel = computed(() => {
    return authLocaleOptions.find((item) => item.value === locale.value)?.label ?? authLocaleOptions[0].label
  })

  const t = (key: string) => getAuthMessage(locale.value, key)

  const openSheet = () => {
    pendingLocale.value = locale.value
    sheetVisible.value = true
  }

  const closeSheet = () => {
    pendingLocale.value = locale.value
    sheetVisible.value = false
  }

  const setPendingLocale = (nextLocale: AuthLocale) => {
    pendingLocale.value = nextLocale
  }

  const confirmLocale = () => {
    locale.value = pendingLocale.value
    sheetVisible.value = false
  }

  return {
    currentLanguageLabel,
    locale,
    pendingLocale,
    sheetVisible,
    t,
    openSheet,
    closeSheet,
    setPendingLocale,
    confirmLocale,
  }
})
