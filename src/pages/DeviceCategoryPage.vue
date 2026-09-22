<script setup lang="ts">
import { PackageOpen } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { DeviceKind } from '../data/device'
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
const { deviceCategoryEntries } = storeToRefs(deviceStore)

const categoryKey = computed(() => (typeof route.params.categoryKey === 'string' ? route.params.categoryKey : 'trainer') as DeviceKind)
const categoryMeta = computed(() => deviceCategoryEntries.value.find((item) => item.key === categoryKey.value) ?? null)
const categoryDisplayLimit = computed(() => categoryMeta.value?.displayLimit ?? 5)
const categoryDevices = computed(() => deviceStore.getDevicesByKind(categoryKey.value))
const connectedDevices = computed(() => categoryDevices.value.filter((item) => item.connected).slice(0, categoryDisplayLimit.value))
const historyDevices = computed(() => {
  const remainCount = Math.max(categoryDisplayLimit.value - connectedDevices.value.length, 0)
  return categoryDevices.value
    .filter((item) => !item.connected)
    .slice(0, remainCount)
})
const hasNoDevices = computed(() => connectedDevices.value.length === 0 && historyDevices.value.length === 0)
const emptyStateTitle = computed(() => categoryMeta.value ? `暂无${categoryMeta.value.label}设备` : '暂无设备')
const emptyStateDescription = computed(() => categoryKey.value === 'sensor'
  ? '请在已连接码表的设备详情中添加和管理传感器。'
  : '当前分类暂无可展示设备。')

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

const handleOpenDetail = (deviceId: string) => {
  void router.push(`/device/${deviceId}`)
}

</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <PageNavBar class="-mx-4" :title="categoryMeta?.label ?? '设备分类'" @back="router.back()" />

        <div class="pt-4">
          <section v-if="hasNoDevices" class="mt-20 flex flex-col items-center px-6 text-center">
            <div class="h-14 w-14 flex items-center justify-center rounded-[6px] bg-white text-muted ring-1 ring-black/5">
              <PackageOpen :size="24" :stroke-width="2" />
            </div>
            <h2 class="mt-4 text-[15px] font-700 text-ink">{{ emptyStateTitle }}</h2>
            <p class="mt-2 max-w-64 text-[12px] leading-[1.7] text-muted">{{ emptyStateDescription }}</p>
          </section>

          <section v-if="connectedDevices.length" class="mt-4">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-[15px] font-700 text-ink">已连接设备</h2>
              <span class="text-[12px] text-muted">{{ connectedDevices.length }} 台</span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="item in connectedDevices"
                :key="item.id"
                class="app-card w-full p-4 text-left"
                type="button"
                @click="handleOpenDetail(item.id)"
              >
                <img :src="item.image" :alt="item.name" class="app-media h-28 w-full object-cover" />
                <p class="mt-4 text-[14px] font-700 text-ink">{{ item.name }}</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="rounded-full bg-[#EDF9F3] px-2.5 py-1 text-[11px] font-700 text-[#15935F]">已连接</span>
                  <span
                    v-if="item.lastSeen !== item.statusText"
                    class="rounded-full bg-[#F5F6F8] px-2.5 py-1 text-[11px] text-[#626970]"
                  >
                    {{ item.lastSeen }}
                  </span>
                </div>
              </button>
            </div>
          </section>

          <section v-if="historyDevices.length" class="mt-4">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-[15px] font-700 text-ink">未连接设备</h2>
              <span class="text-[12px] text-muted">{{ historyDevices.length }} 台</span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="item in historyDevices"
                :key="item.id"
                class="app-card w-full p-4 text-left"
                type="button"
                @click="handleOpenDetail(item.id)"
              >
                <img :src="item.image" :alt="item.name" class="app-media h-24 w-full object-cover" />
                <p class="mt-4 text-[14px] font-700 text-ink">{{ item.name }}</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="rounded-full bg-[#FFF3E8] px-2.5 py-1 text-[11px] font-700 text-[#D97706]">未连接</span>
                  <span
                    v-if="item.lastSeen !== item.statusText"
                    class="rounded-full bg-[#F5F6F8] px-2.5 py-1 text-[11px] text-[#626970]"
                  >
                    {{ item.lastSeen }}
                  </span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
