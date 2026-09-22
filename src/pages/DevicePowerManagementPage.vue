<script setup lang="ts">
import { Clock3, Moon, Power } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { primaryDeviceId } from '../data/device'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'
import type { ComputerShutdownTime, ComputerSleepTime } from '../stores/device'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const { computerSettings } = storeToRefs(deviceStore)

const deviceId = computed(() => typeof route.params.deviceId === 'string' ? route.params.deviceId : primaryDeviceId)
const device = computed(() => deviceStore.getDeviceById(deviceId.value))
const autoSleepEnabled = computed(() => computerSettings.value.autoSleepEnabled)
const sleepTime = computed(() => computerSettings.value.sleepTime)
const autoShutdownEnabled = computed(() => computerSettings.value.autoShutdownEnabled)
const shutdownTime = computed(() => computerSettings.value.shutdownTime)
const sleepOptions: ComputerSleepTime[] = ['30s', '1min', '2min', '3min']
const shutdownOptions: ComputerShutdownTime[] = ['5min', '10min', '15min', '30min']

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

const toggleAutoSleep = () => {
  const nextValue = !autoSleepEnabled.value
  deviceStore.updateComputerPowerSettings({ autoSleepEnabled: nextValue }, Boolean(device.value?.connected))
  appStore.showToast(`自动休眠已${nextValue ? '开启' : '关闭'}${device.value?.connected ? '并同步到码表' : ''}`)
}

const toggleAutoShutdown = () => {
  const nextValue = !autoShutdownEnabled.value
  deviceStore.updateComputerPowerSettings({ autoShutdownEnabled: nextValue }, Boolean(device.value?.connected))
  appStore.showToast(`自动关机已${nextValue ? '开启' : '关闭'}${device.value?.connected ? '并同步到码表' : ''}`)
}

const setSleepTime = (value: ComputerSleepTime) => {
  deviceStore.updateComputerPowerSettings({ sleepTime: value }, Boolean(device.value?.connected))
  appStore.showToast(`自动休眠触发时间已设置为 ${value}`)
}

const setShutdownTime = (value: ComputerShutdownTime) => {
  deviceStore.updateComputerPowerSettings({ shutdownTime: value }, Boolean(device.value?.connected))
  appStore.showToast(`静止无操作后关机时间已设置为 ${value}`)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <div>
          <PageNavBar class="-mx-4" title="电源管理" @back="router.back()" />

          <section class="app-card mt-4 p-4">
            <h2 class="text-[15px] font-700 text-ink">电源管理</h2>

            <div class="mt-4 space-y-4">
              <div class="rounded-lg bg-soft p-4 ring-1 ring-line">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 flex items-center justify-center rounded-full bg-[#EEF4FF] text-[#3D82F6]">
                      <Moon :size="18" :stroke-width="2.2" />
                    </div>
                    <div>
                      <p class="text-[13px] font-700 text-ink">自动休眠</p>
                    </div>
                  </div>
                  <button
                    class="relative h-7 w-14 rounded-full transition"
                    :class="autoSleepEnabled ? 'bg-[#3D82F6]' : 'bg-[#D8DDE6]'"
                    type="button"
                    role="switch"
                    :aria-checked="autoSleepEnabled"
                    aria-label="自动休眠"
                    @click="toggleAutoSleep"
                  >
                    <span
                      class="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.16)] transition"
                      :class="autoSleepEnabled ? 'left-8' : 'left-1'"
                    />
                  </button>
                </div>

                <div class="mt-4 border-t border-line pt-4">
                  <p class="flex items-center gap-1.5 text-[12px] font-600 text-muted">
                    <Clock3 :size="14" :stroke-width="2.2" />
                    自动休眠触发条件
                  </p>
                  <div class="mt-3 grid grid-cols-4 gap-2">
                    <button
                      v-for="item in sleepOptions"
                      :key="item"
                      class="min-h-10 rounded-[6px] text-[12px] font-700 transition focus-visible:ring-2 focus-visible:ring-[#3D82F6]"
                      :class="sleepTime === item ? 'bg-[#3D82F6] text-white' : 'bg-white text-ink ring-1 ring-black/5'"
                      type="button"
                      @click="setSleepTime(item)"
                    >
                      {{ item }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="rounded-lg bg-soft p-4 ring-1 ring-line">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 flex items-center justify-center rounded-full bg-[#FFF0F0] text-[#E34D59]">
                      <Power :size="18" :stroke-width="2.2" />
                    </div>
                    <div>
                      <p class="text-[13px] font-700 text-ink">自动关机</p>
                    </div>
                  </div>
                  <button
                    class="relative h-7 w-14 rounded-full transition"
                    :class="autoShutdownEnabled ? 'bg-[#3D82F6]' : 'bg-[#D8DDE6]'"
                    type="button"
                    role="switch"
                    :aria-checked="autoShutdownEnabled"
                    aria-label="自动关机"
                    @click="toggleAutoShutdown"
                  >
                    <span
                      class="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.16)] transition"
                      :class="autoShutdownEnabled ? 'left-8' : 'left-1'"
                    />
                  </button>
                </div>

                <div class="mt-4 border-t border-line pt-4">
                  <p class="flex items-center gap-1.5 text-[12px] font-600 text-muted">
                    <Clock3 :size="14" :stroke-width="2.2" />
                    静止无操作后关机时间
                  </p>
                  <div class="mt-3 grid grid-cols-4 gap-2">
                    <button
                      v-for="item in shutdownOptions"
                      :key="item"
                      class="min-h-10 rounded-[6px] text-[12px] font-700 transition focus-visible:ring-2 focus-visible:ring-[#3D82F6]"
                      :class="shutdownTime === item ? 'bg-[#3D82F6] text-white' : 'bg-white text-ink ring-1 ring-black/5'"
                      type="button"
                      @click="setShutdownTime(item)"
                    >
                      {{ item }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p class="mt-4 text-[12px] text-muted">
              {{ device?.connected ? '设置变更将通过蓝牙同步到码表' : '当前未连接，设置已保存在 App' }}
            </p>
          </section>
        </div>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
