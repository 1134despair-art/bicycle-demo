<script setup lang="ts">
import { BluetoothSearching, HeartPulse, LoaderCircle, Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
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

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const { availableSensorCandidates } = storeToRefs(deviceStore)

const deviceId = computed(() => (typeof route.params.deviceId === 'string' ? route.params.deviceId : primaryDeviceId))
const isScanning = ref(true)
const bindingId = ref<string | null>(null)

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

  appStore.showToast('我的模块将在下一阶段开发')
}

const handleBind = (candidateId: string, name: string) => {
  bindingId.value = candidateId
  const result = deviceStore.bindSensorCandidate(candidateId)

  window.setTimeout(() => {
    bindingId.value = null
    if (result) {
      appStore.showToast(`已连接 ${name}`)
      void router.push(`/device/${deviceId.value}/sensors`)
      return
    }
    appStore.showToast('当前设备已连接或不可用')
  }, 500)
}

window.setTimeout(() => {
  isScanning.value = false
}, 900)
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <PageNavBar class="-mx-4" title="蓝牙搜索" @back="router.back()" />

        <section class="app-card p-5">
          <div class="rounded-lg bg-brand-500 px-5 py-5 text-white">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[11px] tracking-[0.08em] text-white/72 uppercase">Bluetooth Search</p>
                <h2 class="mt-2 text-[20px] font-700 tracking-[-0.04em]">搜索可连接传感器</h2>
                <p class="mt-2 text-[12px] leading-[1.7] text-white/78">通过蓝牙搜索附近可连接的传感器设备，搜索完成后可直接发起绑定。</p>
              </div>
              <div class="h-11 w-11 flex items-center justify-center rounded-full bg-white/14">
                <BluetoothSearching :size="22" :stroke-width="2.2" />
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span class="rounded-full bg-white/14 px-3 py-1.5 text-white/88">蓝牙已开启</span>
              <span class="rounded-full bg-white/14 px-3 py-1.5 text-white/88">附近设备扫描中</span>
            </div>
          </div>

          <div class="mt-4 rounded-lg bg-soft px-4 py-3.5 ring-1 ring-line">
            <div class="flex items-center gap-2 text-[12px] text-ink">
              <LoaderCircle v-if="isScanning" :size="16" class="animate-spin text-brand-700" />
              <BluetoothSearching v-else :size="16" class="text-brand-700" />
              <span class="font-700">{{ isScanning ? '正在搜索附近蓝牙传感器...' : `已发现 ${availableSensorCandidates.length} 个可连接传感器` }}</span>
            </div>
          </div>
        </section>

        <section class="app-card mt-4 p-5">
          <div class="flex items-center justify-between gap-3">
            <h2 class="app-section-title">可连接设备</h2>
            <span class="rounded-full bg-[#F5F6F8] px-3 py-1 text-[11px] text-[#626970]">{{ availableSensorCandidates.length }} 台</span>
          </div>

          <div class="mt-4 space-y-3">
            <div
              v-for="item in availableSensorCandidates"
              :key="item.id"
              class="rounded-lg bg-soft px-4 py-4 ring-1 ring-line"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 flex items-center justify-center rounded-[6px] bg-white text-brand-700 ring-1 ring-line">
                    <HeartPulse :size="16" :stroke-width="2.2" />
                  </div>
                  <div>
                    <p class="text-[13px] font-700 text-ink">{{ item.name }}</p>
                    <p class="mt-1 text-[12px] text-muted">{{ item.signal }}<span v-if="item.battery"> · 电量 {{ item.battery }}</span></p>
                  </div>
                </div>
                <button
                  class="rounded-full bg-brand-500 px-3 py-2 text-[11px] font-700 text-white disabled:bg-[#B9C3D5]"
                  :disabled="bindingId === item.id"
                  type="button"
                  @click="handleBind(item.id, item.name)"
                >
                  <span v-if="bindingId === item.id">连接中</span>
                  <span v-else class="inline-flex items-center gap-1">
                    <Plus :size="14" :stroke-width="2.4" />
                    绑定
                  </span>
                </button>
              </div>
            </div>

            <div
              v-if="!availableSensorCandidates.length && !isScanning"
              class="rounded-lg bg-soft px-4 py-8 text-center ring-1 ring-line"
            >
              <p class="text-[13px] font-700 text-ink">未搜索到新的传感器设备</p>
              <p class="mt-2 text-[12px] leading-[1.6] text-muted">请检查目标设备是否已开机并处于可连接状态，然后返回重新搜索。</p>
            </div>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
