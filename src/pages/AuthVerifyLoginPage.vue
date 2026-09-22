<script setup lang="ts">
import { ChevronDown, ChevronLeft } from 'lucide-vue-next'
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

const phone = ref('')
const agreed = ref(false)
const methodsExpanded = ref(false)

const canRequestCode = computed(() => /^1\d{10}$/.test(phone.value) && agreed.value)

const goBack = () => {
  void router.push('/')
}

const submitCode = () => {
  if (!canRequestCode.value) {
    store.showToast(localeStore.t('verify.invalidToast'))
    return
  }

  void router.push({
    path: '/auth/code',
    query: {
      phone: `+86${phone.value}`,
    },
  })
}

const goPasswordLogin = () => {
  void router.push('/auth/password')
}

const goHome = () => {
  store.showToast(localeStore.t('verify.skipToast'))
  void router.push('/home')
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
        <h1 class="text-[28px] font-700 tracking-[-0.04em] text-white">{{ localeStore.t('verify.title') }}</h1>
        <p class="max-w-84 text-[15px] leading-[1.7] text-white/62">{{ localeStore.t('verify.subtitle') }}</p>
      </div>

      <div class="space-y-5">
        <div class="auth-video-field flex h-15 items-center rounded-lg px-5">
          <button class="inline-flex items-center gap-1.5 text-[15px] font-600 text-ink" type="button">
            +86
            <ChevronDown :size="16" :stroke-width="2.2" />
          </button>
          <span class="mx-4 h-6 w-px bg-ink/15" />
          <input
            v-model="phone"
            class="min-w-0 flex-1 bg-transparent text-[18px] font-500 text-ink outline-none placeholder:text-muted"
            inputmode="numeric"
            maxlength="11"
            :placeholder="localeStore.t('verify.phonePlaceholder')"
            type="text"
          />
        </div>

        <label class="flex items-start gap-3 text-left">
          <input
            v-model="agreed"
            class="mt-0.5 h-5 w-5 appearance-none rounded-full border border-white/78 bg-transparent checked:border-white checked:bg-transparent"
            type="checkbox"
          />
          <span class="text-[14px] leading-[1.7] text-white/72">
            {{ localeStore.t('verify.agreement') }}
          </span>
        </label>

        <AuthPrimaryButton :disabled="!canRequestCode" @click="submitCode">
          {{ localeStore.t('verify.getCode') }}
        </AuthPrimaryButton>
      </div>
    </div>

    <template #footer>
      <div class="space-y-4 text-center">
        <button
          class="mx-auto flex items-center gap-1 text-[15px] font-500 text-white/80"
          type="button"
          @click="methodsExpanded = !methodsExpanded"
        >
          <span>{{ localeStore.t('verify.otherMethods') }}</span>
          <ChevronDown :size="18" :stroke-width="2.1" class="transition-transform" :class="methodsExpanded ? 'rotate-180' : ''" />
        </button>

        <div v-if="methodsExpanded" class="space-y-3">
          <button
            class="h-12 w-full rounded-lg border border-white/22 bg-white/6 text-[15px] font-600 text-white"
            type="button"
            @click="goPasswordLogin"
          >
            {{ localeStore.t('verify.passwordMethod') }}
          </button>
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

        <button class="inline-flex h-11 items-center justify-center rounded-lg border border-white/22 px-5 text-[15px] font-500 text-white/84" type="button" @click="goHome">
          {{ localeStore.t('verify.skip') }}
        </button>
      </div>
    </template>

    <AuthLanguageSheet />
    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AuthPageFrame>
</template>
