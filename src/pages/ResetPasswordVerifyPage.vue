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

const account = computed(
  () => (route.query.account as string) || localeStore.t('resetVerify.defaultAccount'),
)
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const canConfirm = computed(() => password.value.trim().length >= 6 && confirmPassword.value.trim().length >= 6)

const goBack = () => {
  void router.push({
    path: '/auth/forgot-password',
    query: {
      account: account.value,
    },
  })
}

const confirmReset = () => {
  if (!canConfirm.value) {
    store.showToast(localeStore.t('resetVerify.incompleteToast'))
    return
  }

  if (password.value !== confirmPassword.value) {
    store.showToast(localeStore.t('resetVerify.mismatchToast'))
    return
  }

  void router.push({
    path: '/auth/reset-password-success',
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

    <div class="space-y-9 pt-18">
      <div class="space-y-3 text-left">
        <h1 class="text-[28px] font-700 tracking-[-0.04em] text-white">{{ localeStore.t('resetVerify.title') }}</h1>
        <p class="max-w-84 text-[15px] leading-[1.7] text-white/62">
          {{ localeStore.t('resetVerify.subtitle') }} {{ account }}
        </p>
      </div>

      <div class="space-y-4">
        <div class="flex items-center rounded-lg border border-white/20 bg-white/10 px-5 py-4">
          <input
            v-model="password"
            class="min-w-0 flex-1 bg-transparent text-[18px] font-500 text-white outline-none placeholder:text-white/48"
            :placeholder="localeStore.t('resetVerify.passwordPlaceholder')"
            :type="showPassword ? 'text' : 'password'"
          />
          <button
            class="ml-3 text-[13px] font-500 text-white/72"
            type="button"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>

        <div class="flex items-center rounded-lg border border-white/20 bg-white/10 px-5 py-4">
          <input
            v-model="confirmPassword"
            class="min-w-0 flex-1 bg-transparent text-[18px] font-500 text-white outline-none placeholder:text-white/48"
            :placeholder="localeStore.t('resetVerify.confirmPasswordPlaceholder')"
            :type="showConfirmPassword ? 'text' : 'password'"
          />
          <button
            class="ml-3 text-[13px] font-500 text-white/72"
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            {{ showConfirmPassword ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>

      <div class="space-y-3 text-center">
        <p class="text-[13px] leading-[1.7] text-white/56">
          {{ localeStore.t('resetVerify.tip') }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="pb-2">
        <AuthPrimaryButton :disabled="!canConfirm" @click="confirmReset">
          {{ localeStore.t('resetVerify.submit') }}
        </AuthPrimaryButton>
      </div>
    </template>

    <AuthLanguageSheet />
    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AuthPageFrame>
</template>
