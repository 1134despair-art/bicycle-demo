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

const digits = ref(['', '', '', '', '', ''])
const countdown = ref(59)
const phone = computed(() => (route.query.phone as string) || '+8615801657941')

const fillDigit = (index: number, event: Event) => {
  const value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
  digits.value[index] = value
}

const canConfirm = computed(() => digits.value.every(Boolean))

const goBack = () => {
  void router.push('/auth/verify-login')
}

const confirmLogin = () => {
  if (!canConfirm.value) {
    store.showToast(localeStore.t('confirm.incompleteToast'))
    return
  }

  store.showToast(localeStore.t('confirm.successToast'))
  void router.push('/home')
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
        <h1 class="text-[28px] font-700 tracking-[-0.04em] text-white">{{ localeStore.t('confirm.title') }}</h1>
        <p class="max-w-84 text-[15px] leading-[1.7] text-white/62">
          {{ localeStore.t('confirm.subtitle') }} {{ phone }}
        </p>
      </div>

      <div class="grid grid-cols-6 gap-2.5">
        <input
          v-for="(digit, index) in digits"
          :key="`digit-${index}`"
          :value="digit"
          class="aspect-square w-full rounded-lg border border-white/22 bg-white/10 text-center text-[24px] font-700 text-white outline-none focus:border-white/72"
          inputmode="numeric"
          maxlength="1"
          type="text"
          @input="fillDigit(index, $event)"
        />
      </div>

      <div class="text-center text-[15px] font-500 text-white/72">
        {{ countdown }}{{ localeStore.t('common.countdownSuffix') }}
      </div>
    </div>

    <template #footer>
      <div class="pb-2">
        <AuthPrimaryButton :disabled="!canConfirm" @click="confirmLogin">
          {{ localeStore.t('confirm.action') }}
        </AuthPrimaryButton>
      </div>
    </template>

    <AuthLanguageSheet />
    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AuthPageFrame>
</template>
