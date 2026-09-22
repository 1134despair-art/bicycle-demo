<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import AuthLanguageSheet from '../components/auth/AuthLanguageSheet.vue'
import AuthPageFrame from '../components/auth/AuthPageFrame.vue'
import AuthPrimaryButton from '../components/auth/AuthPrimaryButton.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { useAppStore } from '../stores/app'
import { useAuthLocaleStore } from '../stores/authLocale'

const router = useRouter()
const store = useAppStore()
const localeStore = useAuthLocaleStore()

const account = ref('')
const nickname = ref('')
const password = ref('')
const code = ref('')
const countdown = ref(60)

const canRegister = computed(
  () =>
    account.value.trim().length > 0 &&
    nickname.value.trim().length > 0 &&
    password.value.trim().length >= 6 &&
    code.value.trim().length >= 4,
)

const goBack = () => {
  void router.push('/auth/password')
}

const getCode = () => {
  if (!account.value.trim()) {
    store.showToast(localeStore.t('register.accountRequiredToast'))
    return
  }

  countdown.value = 59
  store.showToast(localeStore.t('register.codeSentToast'))
}

const submitRegister = () => {
  if (!canRegister.value) {
    store.showToast(localeStore.t('register.incompleteToast'))
    return
  }

  store.showToast(localeStore.t('register.successToast'))
  void router.push('/home')
}

const goLogin = () => {
  void router.push('/auth/password')
}
</script>

<template>
  <AuthPageFrame video-background content-class="pb-10">
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
        <h1 class="text-[28px] font-700 tracking-[-0.04em] text-white">{{ localeStore.t('register.title') }}</h1>
        <p class="max-w-84 text-[15px] leading-[1.7] text-white/62">{{ localeStore.t('register.subtitle') }}</p>
      </div>

      <div class="space-y-4">
        <div class="auth-video-field rounded-lg px-5 py-4">
          <input
            v-model="account"
            class="w-full bg-transparent text-[18px] font-500 text-ink outline-none placeholder:text-muted"
            :placeholder="localeStore.t('register.accountPlaceholder')"
            type="text"
          />
        </div>

        <div class="auth-video-field rounded-lg px-5 py-4">
          <input
            v-model="nickname"
            class="w-full bg-transparent text-[18px] font-500 text-ink outline-none placeholder:text-muted"
            :placeholder="localeStore.t('register.nicknamePlaceholder')"
            type="text"
          />
        </div>

        <div class="auth-video-field rounded-lg px-5 py-4">
          <input
            v-model="password"
            class="w-full bg-transparent text-[18px] font-500 text-ink outline-none placeholder:text-muted"
            :placeholder="localeStore.t('register.passwordPlaceholder')"
            type="password"
          />
        </div>

        <div class="auth-video-field flex items-center rounded-lg px-5 py-3">
          <input
            v-model="code"
            class="min-w-0 flex-1 bg-transparent text-[18px] font-500 text-ink outline-none placeholder:text-muted"
            :placeholder="localeStore.t('register.codePlaceholder')"
            type="text"
          />
          <button
            class="ml-3 min-h-9 rounded-lg bg-brand-500 px-4 py-2 text-[13px] font-700 text-white transition active:bg-brand-600"
            type="button"
            @click="getCode"
          >
            {{
              countdown === 60
                ? localeStore.t('common.getCode')
                : `${countdown}${localeStore.t('common.countdownSuffix')}`
            }}
          </button>
        </div>

        <AuthPrimaryButton :disabled="!canRegister" @click="submitRegister">
          {{ localeStore.t('register.submit') }}
        </AuthPrimaryButton>
      </div>
    </div>

    <template #footer>
      <div class="space-y-3 text-center">
        <button
          class="h-12 w-full rounded-lg border border-white/22 bg-white/6 text-[15px] font-600 text-white"
          type="button"
          @click="goLogin"
        >
          {{ localeStore.t('register.backToLogin') }}
        </button>
      </div>
    </template>

    <AuthLanguageSheet />
    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AuthPageFrame>
</template>
