<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppOptionSheet from '../components/feedback/AppOptionSheet.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { primaryDeviceId } from '../data/device'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'
import type { ComputerLanguage } from '../stores/device'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const { computerSettings } = storeToRefs(deviceStore)

const deviceId = computed(() => typeof route.params.deviceId === 'string' ? route.params.deviceId : primaryDeviceId)
const device = computed(() => deviceStore.getDeviceById(deviceId.value))

const languageOptions = [
  { value: 'system', label: '跟随系统', note: 'Use System' },
  { value: 'zh-CN', label: '简体中文', note: 'Simplified Chinese' },
  { value: 'zh-TW', label: '繁體中文', note: 'Traditional Chinese' },
  { value: 'en-US', label: 'English', note: 'English' },
  { value: 'es-ES', label: 'Español', note: 'Spanish' },
  { value: 'ko-KR', label: '한국어', note: 'Korean' },
]

const selectedLanguage = ref<ComputerLanguage>(computerSettings.value.language)
const languageSheetVisible = ref(false)
const selectedLanguageOption = computed(() =>
  languageOptions.find((item) => item.value === selectedLanguage.value) ?? languageOptions[0],
)

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
  if (key === 'profile') {
    void router.push('/my')
    return
  }

  if (key === 'profile') {
    void router.push('/my')
    return
  }

  appStore.showToast('我的模块将在下一阶段开发')
}

const saveLanguage = () => {
  const target = languageOptions.find((item) => item.value === selectedLanguage.value)
  deviceStore.updateComputerLanguage(selectedLanguage.value, Boolean(device.value?.connected))
  appStore.showToast(device.value?.connected
    ? `已同步到码表：${target?.label ?? '跟随系统'}`
    : `已保存语言：${target?.label ?? '跟随系统'}，连接码表后同步`)
}

const selectLanguage = (value: string) => {
  if (languageOptions.some((item) => item.value === value)) {
    selectedLanguage.value = value as ComputerLanguage
  }
  languageSheetVisible.value = false
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <PageNavBar class="-mx-4" title="语言设置" @back="router.back()" />

        <section class="app-card p-5">
          <div class="rounded-lg bg-[#F7F8FA] px-5 py-5 text-ink">
            <p class="text-[11px] font-600 text-brand-700 uppercase">Device Language</p>
            <h2 class="mt-2 text-[20px] font-700">设备语言</h2>
            <p class="mt-2 text-[12px] leading-[1.7] text-muted">
              {{ device?.connected ? '码表已连接，应用后立即同步' : '码表未连接，设置将在下次连接时同步' }}
            </p>
          </div>
        </section>

        <section class="app-card mt-4 p-5">
          <h2 class="app-section-title">当前语言</h2>
          <div class="app-list-group mt-4">
            <button
              class="app-list-row w-full justify-between text-left outline-none transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="languageSheetVisible = true"
            >
              <div class="min-w-0">
                <p class="text-[14px] font-700 text-ink">{{ selectedLanguageOption.label }}</p>
                <p class="mt-1 text-[12px] text-muted">{{ selectedLanguageOption.note }}</p>
              </div>
              <span class="text-[18px] text-#9aa3af">›</span>
            </button>

            <div class="app-list-row block">
              <p class="text-[13px] font-700 text-ink">同步状态</p>
              <p class="mt-2 text-[12px] leading-[1.7] text-muted">
                {{ device?.connected ? '蓝牙已连接' : '等待码表连接' }}
              </p>
            </div>
          </div>

          <button
            class="mt-4 w-full rounded-lg bg-brand-500 px-4 py-4 text-[13px] font-700 text-white"
            type="button"
            @click="saveLanguage"
          >
            {{ device?.connected ? '同步到码表' : '保存设置' }}
          </button>
        </section>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppOptionSheet
      :options="languageOptions.map((item) => ({ key: item.value, label: item.label, description: item.note }))"
      :selected-key="selectedLanguage"
      :visible="languageSheetVisible"
      description="请选择当前设备的语言显示方式。"
      title="语言设置"
      @close="languageSheetVisible = false"
      @select="selectLanguage"
    />
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
