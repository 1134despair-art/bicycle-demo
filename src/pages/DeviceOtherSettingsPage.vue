<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { primaryDeviceId } from '../data/device'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'
import type { ComputerBacklightMode } from '../stores/device'

type ComputerToggleKey = 'buttonSoundEnabled' | 'autoPauseEnabled' | 'autoLapEnabled'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const { computerSettings } = storeToRefs(deviceStore)

const deviceId = computed(() => typeof route.params.deviceId === 'string' ? route.params.deviceId : primaryDeviceId)
const device = computed(() => deviceStore.getDeviceById(deviceId.value))
const backlightOptions: Array<{ value: ComputerBacklightMode; label: string }> = [
  { value: 'auto', label: '自动' },
  { value: 'always-on', label: '常亮' },
  { value: 'off', label: '关' },
]
const toggleRows: Array<{ key: ComputerToggleKey; label: string }> = [
  { key: 'buttonSoundEnabled', label: '按键音' },
  { key: 'autoPauseEnabled', label: '自动暂停' },
  { key: 'autoLapEnabled', label: '自动记圈' },
]

const handleTab = (key: string) => {
  const routes: Record<string, string> = {
    home: '/home',
    data: '/data',
    route: '/routes',
    device: '/device',
    profile: '/my',
  }
  if (routes[key]) {
    void router.push(routes[key])
  }
}

const setBacklightMode = (value: ComputerBacklightMode) => {
  const label = backlightOptions.find((item) => item.value === value)?.label ?? '自动'
  deviceStore.updateComputerOtherSettings({ backlightMode: value }, Boolean(device.value?.connected))
  appStore.showToast(`背光已设置为${label}`)
}

const toggleSetting = (key: ComputerToggleKey, label: string) => {
  const enabled = !computerSettings.value[key]
  const settings: Partial<Record<ComputerToggleKey, boolean>> = { [key]: enabled }
  deviceStore.updateComputerOtherSettings(settings, Boolean(device.value?.connected))
  appStore.showToast(`${label}已${enabled ? '开启' : '关闭'}`)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />
      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <PageNavBar class="-mx-4" title="其他设置" @back="router.back()" />

        <section class="app-card overflow-hidden">
          <div class="px-5 py-5">
            <p class="text-[14px] font-700 text-ink">背光</p>
            <div class="mt-3 grid grid-cols-3 gap-3">
                <button
                  v-for="option in backlightOptions"
                  :key="option.value"
                  class="min-h-10 rounded-[6px] text-[13px] font-600 transition focus-visible:ring-2 focus-visible:ring-brand-500"
                  :class="computerSettings.backlightMode === option.value ? 'bg-brand-500 text-white' : 'bg-[#F1F2F5] text-ink'"
                  type="button"
                  @click="setBacklightMode(option.value)"
                >
                  {{ option.label }}
                </button>
            </div>
          </div>

          <div class="border-t border-line">
            <button
              v-for="row in toggleRows"
              :key="row.key"
              class="flex min-h-15 w-full items-center justify-between border-b border-line px-5 text-left last:border-b-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
              type="button"
              role="switch"
              :aria-checked="computerSettings[row.key]"
              :aria-label="row.label"
              @click="toggleSetting(row.key, row.label)"
            >
              <span class="text-[14px] font-600 text-ink">{{ row.label }}</span>
              <span class="relative h-7 w-12 shrink-0 rounded-full transition" :class="computerSettings[row.key] ? 'bg-brand-500' : 'bg-[#D5DAE2]'">
                <span class="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_1px_4px_rgba(15,23,42,0.18)] transition" :class="computerSettings[row.key] ? 'left-6' : 'left-1'" />
              </span>
            </button>
          </div>
        </section>
      </div>
      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
