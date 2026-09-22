<script setup lang="ts">
import { Check, ChevronRight, Globe2, Languages, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import { loadMySettings, myLanguageOptions, saveMySettings } from '../data/my'
import type { MyLanguage, MySettings } from '../data/my'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const createDraft = (): MySettings => ({
  ...loadMySettings(),
})

const draft = ref<MySettings>(createDraft())
const languageDialogVisible = ref(false)

const selectedLanguageLabel = computed(() =>
  myLanguageOptions.find((item) => item.value === draft.value.language)?.label ?? '跟随系统',
)

const routeExists = (path: string) => router.resolve(path).matched.length > 0

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  if (routeExists('/my')) {
    void router.push('/my')
    return
  }

  void router.push('/home')
}

const handleTab = (key: string) => {
  if (key === 'home') {
    void router.push('/home')
    return
  }

  if (key === 'data') {
    void router.push('/data')
    return
  }

  if (key === 'route') {
    void router.push('/routes')
    return
  }

  if (key === 'device') {
    void router.push('/device')
    return
  }

  if (routeExists('/my')) {
    void router.push('/my')
    return
  }

  appStore.showToast('个人中心路由待接入，页面文件已创建')
}

const selectLanguage = (value: MyLanguage) => {
  draft.value.language = value
}

const openLanguageDialog = () => {
  languageDialogVisible.value = true
}

const closeLanguageDialog = () => {
  languageDialogVisible.value = false
}

const toggleNotification = () => {
  draft.value.notificationEnabled = !draft.value.notificationEnabled
}

const saveDraft = () => {
  saveMySettings(draft.value)
  appStore.showToast('系统设置已保存')
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] flex flex-col homepage-surface">
      <IosStatusBar />

      <div class="flex-1 px-4 pb-5">
        <PageNavBar class="-mx-4" title="系统设置" @back="goBack" />

        <section class="pt-5">
          <div class="app-card px-5 py-5">
            <div class="flex items-start gap-4">
              <div class="h-13 w-13 shrink-0 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Globe2 :size="20" :stroke-width="2.1" />
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="text-[21px] font-700 tracking-[-0.05em] text-ink">
                  {{ selectedLanguageLabel }}
                </h2>
                <p class="mt-2 text-[12px] leading-[1.8] text-[#6F7C77]">
                  统一管理界面语言与消息提醒，保存后回写当前账号的本地设置。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="pt-4">
          <div class="app-list-group">
            <button
              class="w-full flex items-center justify-between gap-4 px-5 py-5 text-left outline-none transition hover:bg-[#fafcfa] focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="openLanguageDialog"
            >
              <div class="min-w-0 flex items-center gap-4">
                <div class="h-12 w-12 shrink-0 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Languages :size="18" :stroke-width="2.1" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-[15px] font-700 tracking-[-0.03em] text-ink">语言设置</h3>
                  <p class="mt-1 text-[12px] leading-[1.6] text-[#7A8782]">
                    当前语言：{{ selectedLanguageLabel }}
                  </p>
                </div>
              </div>

              <div class="h-9 w-9 flex shrink-0 items-center justify-center rounded-full bg-[#F7F8FA] text-[#9AA3AF] ring-1 ring-[#E7E9EC]">
                <ChevronRight :size="18" :stroke-width="2.2" />
              </div>
            </button>

            <div class="mx-5 h-px bg-black/6" />

            <div class="flex items-center justify-between gap-4 px-5 py-5">
              <div class="min-w-0">
                <p class="text-[15px] font-700 tracking-[-0.03em] text-ink">消息提醒</p>
                <p class="mt-1 text-[12px] leading-[1.6] text-[#7A8782]">
                  固件升级、训练计划和服务提醒统一通过消息中心展示。
                </p>
              </div>

              <button
                class="relative h-7 w-14 shrink-0 rounded-full transition outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                :class="draft.notificationEnabled ? 'bg-brand-500' : 'bg-[#d8dde6]'"
                type="button"
                @click="toggleNotification"
              >
                <span
                  class="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.16)] transition"
                  :class="draft.notificationEnabled ? 'left-8 -translate-x-full' : 'left-1'"
                />
              </button>
            </div>
          </div>
        </section>

        <section class="pb-2 pt-5">
          <button
            class="app-primary-button w-full px-4 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            type="button"
            @click="saveDraft"
          >
            保存
          </button>
        </section>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />

    <teleport to="body">
      <div v-if="languageDialogVisible" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/38" @click="closeLanguageDialog" />

        <div class="app-sheet absolute bottom-[98px] left-1/2 w-[calc(100%-24px)] max-w-[390px] -translate-x-1/2 ring-1 ring-black/5">
          <div class="flex items-center justify-between gap-3 border-b border-black/6 px-5 py-4">
            <div>
              <h3 class="text-[16px] font-700 tracking-[-0.03em] text-ink">语言设置</h3>
              <p class="mt-1 text-[12px] leading-5 text-muted">选择你偏好的界面语言，选项较多时可上下滚动。</p>
            </div>

            <button
              class="h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-muted transition hover:bg-#f3f4f6"
              type="button"
              @click="closeLanguageDialog"
            >
              <X :size="16" :stroke-width="2.2" />
            </button>
          </div>

          <div class="max-h-[52vh] overflow-y-auto app-scroll-area px-4 py-4">
            <div class="space-y-3">
              <button
                v-for="item in myLanguageOptions"
                :key="item.value"
                class="w-full rounded-lg px-4 py-4 text-left outline-none transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
                :class="draft.language === item.value ? 'bg-brand-50 ring-1 ring-brand-200' : 'bg-[#f7f9fb] ring-1 ring-black/5'"
                type="button"
                @click="selectLanguage(item.value)"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-[14px] font-700 tracking-[-0.02em] text-ink">
                      {{ item.label }}
                    </p>
                    <p class="mt-1 text-[12px] leading-5 text-muted">
                      {{ item.description }}
                    </p>
                  </div>

                  <div
                    class="mt-0.5 h-6 w-6 shrink-0 flex items-center justify-center rounded-full ring-1"
                    :class="draft.language === item.value ? 'bg-brand-500 text-white ring-brand-500' : 'bg-white text-transparent ring-black/8'"
                  >
                    <Check :size="14" :stroke-width="2.6" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </AppShell>
</template>
