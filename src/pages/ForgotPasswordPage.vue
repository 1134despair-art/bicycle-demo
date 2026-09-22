<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AuthLanguageSheet from '../components/auth/AuthLanguageSheet.vue'
import AuthPageFrame from '../components/auth/AuthPageFrame.vue'
import AuthPrimaryButton from '../components/auth/AuthPrimaryButton.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { useAppStore } from '../stores/app'
import { useAuthLocaleStore } from '../stores/authLocale'

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const localeStore = useAuthLocaleStore()

const account = ref((route.query.account as string) || '')
const code = ref('')
const countdown = ref(60)

const canContinue = computed(() => account.value.trim().length > 0 && code.value.trim().length >= 4)

const goBack = () => {
  void router.push('/auth/password')
}

const requestCode = () => {
  if (!account.value.trim()) {
    store.showToast(localeStore.t('forgot.accountRequiredToast'))
    return
  }

  countdown.value = 59
  store.showToast(localeStore.t('forgot.codeSentToast'))
}

const nextStep = () => {
  if (!canContinue.value) {
    store.showToast(localeStore.t('forgot.incompleteToast'))
    return
  }

  void router.push({
    path: '/auth/reset-password-verify',
    query: {
      account: account.value.trim(),
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

    <div class="space-y-8 pt-18">
      <div class="space-y-3 text-left">
        <h1 class="text-[28px] font-700 tracking-[-0.04em] text-white">{{ localeStore.t('forgot.title') }}</h1>
        <p class="max-w-84 text-[15px] leading-[1.7] text-white/62">{{ localeStore.t('forgot.subtitle') }}</p>
      </div>

      <div class="space-y-4">
        <div class="rounded-lg border border-white/20 bg-white/10 px-5 py-4">
          <input
            v-model="account"
            class="w-full bg-transparent text-[18px] font-500 text-white outline-none placeholder:text-white/48"
            :placeholder="localeStore.t('forgot.accountPlaceholder')"
            type="text"
          />
        </div>

        <div class="flex items-center rounded-lg border border-white/20 bg-white/10 px-5 py-4">
          <input
            v-model="code"
            class="min-w-0 flex-1 bg-transparent text-[18px] font-500 text-white outline-none placeholder:text-white/48"
            inputmode="numeric"
            maxlength="6"
            :placeholder="localeStore.t('forgot.codePlaceholder')"
            type="text"
          />
          <button
            class="ml-3 rounded-lg border border-white/18 px-4 py-2 text-[13px] font-600 text-white/84"
            type="button"
            @click="requestCode"
          >
            {{
              countdown === 60
                ? localeStore.t('common.getCode')
                : `${countdown}${localeStore.t('common.countdownSuffix')}`
            }}
          </button>
        </div>

        <p class="text-[13px] leading-[1.7] text-white/56">
          {{ localeStore.t('forgot.tip') }}
        </p>

        <AuthPrimaryButton :disabled="!canContinue" @click="nextStep">
          {{ localeStore.t('forgot.submit') }}
        </AuthPrimaryButton>
      </div>
    </div>

    <AuthLanguageSheet />
    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AuthPageFrame>
</template>
