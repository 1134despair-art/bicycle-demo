<script setup lang="ts">
import { ChevronLeft, Eye, EyeOff } from 'lucide-vue-next'
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
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const canLogin = computed(() => account.value.trim().length > 0 && password.value.trim().length >= 6)

const goBack = () => {
  void router.push('/auth/verify-login')
}

const submitLogin = () => {
  if (!canLogin.value) {
    store.showToast(localeStore.t('password.incompleteToast'))
    return
  }

  store.showToast(
    remember.value ? localeStore.t('password.successRememberToast') : localeStore.t('password.successToast'),
  )
  void router.push('/home')
}

const goRegister = () => {
  void router.push('/auth/register')
}

const goForgotPassword = () => {
  void router.push('/auth/forgot-password')
}

const goThirdParty = (provider: 'wechat' | 'apple' | 'google') => {
  void router.push(`/auth/third-party/${provider}`)
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
        <h1 class="text-[28px] font-700 tracking-[-0.04em] text-white">{{ localeStore.t('password.title') }}</h1>
        <p class="max-w-84 text-[15px] leading-[1.7] text-white/62">{{ localeStore.t('password.subtitle') }}</p>
      </div>

      <div class="space-y-4">
        <div class="auth-video-field rounded-lg px-5 py-4">
          <input
            v-model="account"
            class="w-full bg-transparent text-[18px] font-500 text-ink outline-none placeholder:text-muted"
            :placeholder="localeStore.t('password.accountPlaceholder')"
            type="text"
          />
        </div>

        <div class="auth-video-field flex items-center rounded-lg px-5 py-4">
          <input
            v-model="password"
            class="min-w-0 flex-1 bg-transparent text-[18px] font-500 text-ink outline-none placeholder:text-muted"
            :placeholder="localeStore.t('password.passwordPlaceholder')"
            :type="showPassword ? 'text' : 'password'"
          />
          <button class="ml-3 flex h-8 w-8 items-center justify-center text-muted" type="button" @click="showPassword = !showPassword">
            <Eye v-if="showPassword" :size="18" :stroke-width="2.1" />
            <EyeOff v-else :size="18" :stroke-width="2.1" />
          </button>
        </div>

        <div class="flex items-center justify-between gap-3">
          <label class="flex items-center gap-3 text-left">
            <input
              v-model="remember"
              class="h-5 w-5 appearance-none rounded-full border border-white/78 bg-transparent checked:border-white checked:bg-transparent"
              type="checkbox"
            />
            <span class="text-[14px] text-white/72">{{ localeStore.t('password.remember') }}</span>
          </label>
          <button class="text-[14px] font-500 text-white/78" type="button" @click="goForgotPassword">
            {{ localeStore.t('password.forgot') }}
          </button>
        </div>

        <AuthPrimaryButton :disabled="!canLogin" @click="submitLogin">
          {{ localeStore.t('password.submit') }}
        </AuthPrimaryButton>
      </div>
    </div>

    <template #footer>
      <div class="space-y-4 text-center">
        <button
          class="h-12 w-full rounded-lg border border-white/22 bg-white/6 text-[15px] font-600 text-white"
          type="button"
          @click="goRegister"
        >
          {{ localeStore.t('password.register') }}
        </button>
        <div class="space-y-3">
          <p class="text-[14px] text-white/70">{{ localeStore.t('password.otherMethods') }}</p>
          <div class="grid grid-cols-3 gap-3">
            <button class="h-12 rounded-lg border border-white/16 bg-white/4 text-[14px] font-600 text-white" type="button" @click="goThirdParty('wechat')">
              {{ localeStore.t('third.wechat.short') }}
            </button>
            <button class="h-12 rounded-lg border border-white/16 bg-white/4 text-[14px] font-600 text-white" type="button" @click="goThirdParty('apple')">
              {{ localeStore.t('third.apple.short') }}
            </button>
            <button class="h-12 rounded-lg border border-white/16 bg-white/4 text-[14px] font-600 text-white" type="button" @click="goThirdParty('google')">
              {{ localeStore.t('third.google.short') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <AuthLanguageSheet />
    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AuthPageFrame>
</template>
