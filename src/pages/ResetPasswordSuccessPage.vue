<script setup lang="ts">
import { Check, ChevronLeft } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

import AuthLanguageSheet from '../components/auth/AuthLanguageSheet.vue'
import AuthPageFrame from '../components/auth/AuthPageFrame.vue'
import AuthPrimaryButton from '../components/auth/AuthPrimaryButton.vue'
import { useAuthLocaleStore } from '../stores/authLocale'

const route = useRoute()
const router = useRouter()
const localeStore = useAuthLocaleStore()
const account = computed(() => (route.query.account as string) || '')

const goBack = () => {
  void router.push({
    path: '/auth/reset-password-verify',
    query: {
      account: account.value,
    },
  })
}

const goLogin = () => {
  void router.push({
    path: '/auth/password',
    query: {
      account: account.value,
    },
  })
}
</script>

<template>
  <AuthPageFrame content-class="pb-10">
    <template #topbar>
      <div class="flex items-center justify-between">
        <button class="text-white" type="button" @click="goBack">
          <span class="flex h-11 w-11 items-center justify-center rounded-full text-white/88">
            <ChevronLeft :size="22" :stroke-width="2.2" />
          </span>
        </button>
        <button
          class="px-1 py-2 text-[15px] font-500 text-white/82"
          type="button"
          @click="localeStore.openSheet()"
        >
          {{ localeStore.t('common.switchLanguage') }}
        </button>
      </div>
    </template>

    <div class="flex min-h-full flex-col items-center justify-center gap-8 pb-18 pt-12 text-center">
      <div class="flex h-20 w-20 items-center justify-center rounded-full border border-white/18 bg-white/8 text-white">
        <Check :size="34" :stroke-width="2.6" />
      </div>

      <div class="space-y-3">
        <h1 class="text-[28px] font-700 tracking-[-0.04em] text-white">{{ localeStore.t('success.title') }}</h1>
        <p class="max-w-76 text-[15px] leading-[1.7] text-white/62">{{ localeStore.t('success.subtitle') }}</p>
      </div>

      <div class="w-full max-w-full">
        <AuthPrimaryButton @click="goLogin">
          {{ localeStore.t('success.action') }}
        </AuthPrimaryButton>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center">
        <button class="text-[14px] font-500 text-white/68" type="button" @click="goBack">
          {{ localeStore.t('common.back') }}
        </button>
      </div>
    </template>

    <AuthLanguageSheet />
  </AuthPageFrame>
</template>
