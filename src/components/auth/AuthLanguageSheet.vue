<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { authLocaleOptions, type AuthLocale } from '../../data/authLocale'
import { useAuthLocaleStore } from '../../stores/authLocale'

const localeStore = useAuthLocaleStore()
const { pendingLocale, sheetVisible } = storeToRefs(localeStore)

const selectLocale = (locale: AuthLocale) => {
  localeStore.setPendingLocale(locale)
}

const closeSheet = () => {
  localeStore.closeSheet()
}

const confirmLocale = () => {
  localeStore.confirmLocale()
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="sheetVisible"
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/36 px-6 backdrop-blur-[2px]"
      @click.self="closeSheet"
    >
      <div
        class="app-dialog-surface w-full max-w-86 rounded-2xl border border-line bg-white px-5 pb-5 pt-5 text-ink shadow-phone"
      >
        <div class="space-y-2">
          <button
            v-for="item in authLocaleOptions"
            :key="item.value"
            class="w-full rounded-lg px-4 py-3 text-center transition-colors"
            :class="
              pendingLocale === item.value
                ? 'bg-brand-50 text-brand-700'
                : 'bg-transparent text-muted hover:bg-soft hover:text-ink'
            "
            type="button"
            @click="selectLocale(item.value)"
          >
            <span class="block text-[17px] font-600">{{ item.label }}</span>
          </button>
        </div>

        <div class="mt-6 border-t border-line pt-4">
          <div class="grid grid-cols-[56px_1fr_56px] items-center gap-3">
            <button
              class="app-icon-button border-line bg-white"
              aria-label="关闭"
              type="button"
              @click="closeSheet"
            >
              <X :size="20" :stroke-width="2.2" />
            </button>
            <p class="text-center text-[15px] font-600 text-ink">{{ localeStore.t('common.languageTitle') }}</p>
            <button
              class="ml-auto flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500 text-white"
              aria-label="确认语言"
              type="button"
              @click="confirmLocale"
            >
              <Check :size="20" :stroke-width="2.2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
