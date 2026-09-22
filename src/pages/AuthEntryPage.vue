<script setup lang="ts">
import { useRouter } from 'vue-router'

import AuthLanguageSheet from '../components/auth/AuthLanguageSheet.vue'
import AuthPageFrame from '../components/auth/AuthPageFrame.vue'
import AuthPrimaryButton from '../components/auth/AuthPrimaryButton.vue'
import { useAuthLocaleStore } from '../stores/authLocale'

const router = useRouter()
const localeStore = useAuthLocaleStore()
const logoUrl = `${import.meta.env.BASE_URL}media/l-twoo-logo.png`

const goVerifyLogin = () => {
  void router.push('/auth/verify-login')
}
</script>

<template>
  <AuthPageFrame video-background content-class="pb-8">
    <template #topbar>
      <div class="flex items-center justify-end">
        <button
          class="px-1 py-2 text-[15px] font-500 text-white/82"
          type="button"
          @click="localeStore.openSheet()"
        >
          {{ localeStore.t('common.switchLanguage') }}
        </button>
      </div>
    </template>

    <div class="flex min-h-full flex-col">
      <div class="pt-24 text-center">
        <img
          alt="L-TWOO"
          class="mx-auto h-auto w-[248px] max-w-[72vw] select-none bg-transparent"
          draggable="false"
          height="590"
          :src="logoUrl"
          width="3614"
        />
      </div>
    </div>

    <template #footer>
      <div class="space-y-4 pb-2">
        <AuthPrimaryButton @click="goVerifyLogin">
          {{ localeStore.t('entry.primary') }}
        </AuthPrimaryButton>
      </div>
    </template>

    <AuthLanguageSheet />
  </AuthPageFrame>
</template>
