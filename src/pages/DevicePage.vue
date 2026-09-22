<script setup lang="ts">
import { Bluetooth, ChevronRight, EllipsisVertical, Plus, Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const { candidates, currentConnectedDevices, deviceCategoryEntries, hasCompletedFirstDeviceSetup, hasMoreDevices } = storeToRefs(deviceStore)

const searchActivated = ref(route.query.search === '1')
const requestedDeviceKind = computed(() => typeof route.query.kind === 'string' ? route.query.kind : '')
const visibleCandidates = computed(() => candidates.value.filter((item) =>
  item.kind !== 'sensor' && (!requestedDeviceKind.value || item.kind === requestedDeviceKind.value),
))
const visibleConnectedDevices = computed(() => currentConnectedDevices.value.filter((item) => item.kind !== 'sensor'))
const visibleDeviceCategoryEntries = computed(() => deviceCategoryEntries.value)
const hasVisibleMoreDevices = computed(() => hasMoreDevices.value && visibleDeviceCategoryEntries.value.length > 0)
const shouldShowInitialAddSection = computed(() => !hasCompletedFirstDeviceSetup.value)
const shouldShowConnectedDevices = computed(() =>
  hasCompletedFirstDeviceSetup.value && visibleConnectedDevices.value.length > 0,
)
const addDeviceSectionTitle = computed(() =>
  shouldShowInitialAddSection.value ? '添加设备' : '添加新设备',
)
const addDeviceSectionDescription = computed(() =>
  shouldShowInitialAddSection.value
    ? '首次登录请先搜索并绑定设备，完成后页面将恢复默认设备布局'
    : '请确保码表或外设已开启蓝牙可发现模式',
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

const handleOpenMoreDevices = () => {
  void router.push('/device/more')
}

const handleSearchDevices = () => {
  searchActivated.value = true
  appStore.showToast(`已发现 ${visibleCandidates.value.length} 台附近蓝牙设备`)
}

const handleBindCandidate = (candidateId: string) => {
  const nextDevice = deviceStore.bindCandidate(candidateId)
  if (!nextDevice) {
    return
  }

  appStore.showToast(`已绑定设备：${nextDevice.name}`)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area">
        <PageNavBar :show-back="false" title="我的设备" />

        <div class="px-4 pb-4">
        <section v-if="shouldShowInitialAddSection" class="pt-1">
          <div class="flex items-center gap-2">
            <Bluetooth :size="18" :stroke-width="2.2" class="text-brand-500" />
            <h3 class="app-section-title">{{ addDeviceSectionTitle }}</h3>
          </div>

          <button
            class="app-card mt-4 w-full px-4 py-7 text-center transition hover:border-brand-300 hover:bg-brand-50"
            type="button"
            @click="handleSearchDevices"
          >
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-500">
              <Search :size="22" :stroke-width="2.2" />
            </div>
            <p class="mt-3 text-[14px] font-700 text-ink">搜索附近蓝牙设备</p>
            <p class="mt-2 text-[12px] text-muted">{{ addDeviceSectionDescription }}</p>
          </button>

          <div v-if="searchActivated && visibleCandidates.length" class="app-list-group mt-4">
            <div
              v-for="item in visibleCandidates"
              :key="item.id"
              class="app-list-row block"
            >
              <div class="w-full flex items-center gap-3">
                <div class="min-w-0 flex flex-1 items-center gap-3">
                  <img :src="item.image" :alt="item.name" class="app-media h-11 w-11 shrink-0 object-cover" />
                  <div class="min-w-0">
                    <p class="truncate text-[14px] font-700 text-ink">{{ item.name }}</p>
                    <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span class="rounded-full bg-white px-2.5 py-1 text-[#626970]">{{ item.signal }}</span>
                      <span v-if="item.battery" class="rounded-full bg-white px-2.5 py-1 text-[#626970]">电量 {{ item.battery }}</span>
                    </div>
                  </div>
                </div>
                <button
                  class="app-control ml-auto shrink-0 bg-brand-500 px-4 text-[12px] font-700 text-white"
                  type="button"
                  @click="handleBindCandidate(item.id)"
                >
                  <span class="inline-flex items-center gap-1.5">
                    <Plus :size="14" :stroke-width="2.4" />
                    绑定
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-4 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-[12px] leading-[1.7] text-brand-800">
            请确保设备电量充足并已开机，保持靠近手机后再进行搜索、绑定和配对。
          </div>

        </section>

        <section v-if="shouldShowConnectedDevices" class="mt-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="app-section-title">我的连接设备</h2>
              <p class="mt-1 text-[12px] text-muted">首页仅展示当前在线和已连接设备</p>
            </div>
            <span class="rounded-full bg-[#F5F6F8] px-3 py-1 text-[11px] text-[#626970]">{{ visibleConnectedDevices.length }} 台在线</span>
          </div>

          <div class="app-list-group mt-4">
            <div
              v-for="item in visibleConnectedDevices"
              :key="item.id"
              class="border-b border-line bg-white px-4 py-4 last:border-b-0"
            >
              <div class="flex items-start justify-between gap-3">
                <button
                  class="min-w-0 flex flex-1 items-center gap-4 text-left"
                  type="button"
                  @click="router.push(`/device/${item.id}`)"
                >
                  <img :src="item.image" :alt="item.name" class="app-media h-16 w-16 object-cover" />
                  <div class="min-w-0">
                    <h3 class="truncate text-[16px] font-700 text-ink">{{ item.name }}</h3>
                    <div class="mt-2 flex items-center gap-1.5 text-[12px] font-700 text-[#2BC97A]">
                      <span class="h-2.5 w-2.5 rounded-full bg-[#2BC97A]" />
                      <span>{{ item.statusText }}</span>
                    </div>
                  </div>
                </button>

                <button
                  class="app-icon-button h-10 w-10 shrink-0 text-[#7A8086]"
                  aria-label="设备操作"
                  type="button"
                  @click="router.push(`/device/${item.id}`)"
                >
                  <EllipsisVertical :size="18" :stroke-width="2.2" />
                </button>
              </div>

              <div class="mt-4 border-t border-line pt-4">
                <div class="grid grid-cols-2 divide-x divide-line">
                  <div class="px-4 py-1 text-center">
                    <p class="text-[12px] text-muted">电量</p>
                    <p class="app-metric-value mt-2 text-[17px] font-700 text-brand-500">{{ item.battery }}</p>
                  </div>
                  <div class="px-4 py-1 text-center">
                    <p class="text-[12px] text-muted">固件版本</p>
                    <p class="mt-2 text-[17px] font-700 text-ink">{{ item.firmware }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          class="app-list-group mt-5 px-4 py-2"
          :class="hasVisibleMoreDevices ? 'cursor-pointer' : ''"
          @click="hasVisibleMoreDevices ? handleOpenMoreDevices() : undefined"
        >
          <div class="min-h-10 flex items-center justify-between gap-3">
            <h3 class="app-section-title">更多设备</h3>
            <div class="h-8 w-8 flex shrink-0 items-center justify-center text-muted">
              <ChevronRight :size="18" :stroke-width="2.2" />
            </div>
          </div>
        </section>

        <section v-if="!shouldShowInitialAddSection" class="mt-5">
          <div class="flex items-center gap-2">
            <Bluetooth :size="18" :stroke-width="2.2" class="text-brand-500" />
            <h3 class="app-section-title">{{ addDeviceSectionTitle }}</h3>
          </div>

          <button
            class="app-card mt-4 w-full px-4 py-7 text-center transition hover:border-brand-300 hover:bg-brand-50"
            type="button"
            @click="handleSearchDevices"
          >
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-500">
              <Search :size="22" :stroke-width="2.2" />
            </div>
            <p class="mt-3 text-[14px] font-700 text-ink">搜索附近蓝牙设备</p>
            <p class="mt-2 text-[12px] text-muted">{{ addDeviceSectionDescription }}</p>
          </button>

          <div v-if="searchActivated && visibleCandidates.length" class="app-list-group mt-4">
            <div
              v-for="item in visibleCandidates"
              :key="item.id"
              class="app-list-row block"
            >
              <div class="w-full flex items-center gap-3">
                <div class="min-w-0 flex flex-1 items-center gap-3">
                  <img :src="item.image" :alt="item.name" class="app-media h-11 w-11 shrink-0 object-cover" />
                  <div class="min-w-0">
                    <p class="truncate text-[14px] font-700 text-ink">{{ item.name }}</p>
                    <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span class="rounded-full bg-white px-2.5 py-1 text-[#626970]">{{ item.signal }}</span>
                      <span v-if="item.battery" class="rounded-full bg-white px-2.5 py-1 text-[#626970]">电量 {{ item.battery }}</span>
                    </div>
                  </div>
                </div>
                <button
                  class="app-control ml-auto shrink-0 bg-brand-500 px-4 text-[12px] font-700 text-white"
                  type="button"
                  @click="handleBindCandidate(item.id)"
                >
                  <span class="inline-flex items-center gap-1.5">
                    <Plus :size="14" :stroke-width="2.4" />
                    绑定
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-4 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-[12px] leading-[1.7] text-brand-800">
            请确保设备电量充足并已开机，保持靠近手机后再进行搜索、绑定和配对。
          </div>

        </section>
        </div>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
