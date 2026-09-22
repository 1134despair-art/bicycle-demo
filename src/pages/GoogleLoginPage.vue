<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import AuthLanguageSheet from '../components/auth/AuthLanguageSheet.vue'
import AuthPageFrame from '../components/auth/AuthPageFrame.vue'
import ThirdPartyBrandPanel from '../components/auth/ThirdPartyBrandPanel.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { useAppStore } from '../stores/app'
import { useAuthLocaleStore } from '../stores/authLocale'

const router = useRouter()
const store = useAppStore()
const localeStore = useAuthLocaleStore()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  void router.push('/auth/password')
}

const completeLogin = () => {
  store.showToast(localeStore.t('third.google.successToast'))
  void router.push('/home')
}
</script>

<template>
  <AuthPageFrame content-class="pb-12">
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

    <ThirdPartyBrandPanel
      accent-class="bg-#4285f4"
      :title="localeStore.t('third.google.title')"
      :subtitle="localeStore.t('third.google.subtitle')"
      :notice="localeStore.t('third.google.notice')"
    >
      <template #badge>
        <span class="text-[22px] font-700 tracking-[-0.04em]">G</span>
      </template>

      <template #action>
        <button
          class="app-primary-button flex h-13 w-full items-center justify-center text-center text-[16px] transition"
          type="button"
          @click="completeLogin"
        >
          {{ localeStore.t('third.google.action') }}
        </button>
      </template>
    </ThirdPartyBrandPanel>

    <AuthLanguageSheet />
    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AuthPageFrame>
</template>
