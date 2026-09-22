<script setup lang="ts">
import { Activity, Gauge, Radio } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'

const router = useRouter()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const { deviceCategoryEntries } = storeToRefs(deviceStore)

const categoryCards = computed(() => deviceCategoryEntries.value)

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

const handleOpenDetail = (categoryKey: string) => {
  void router.push(`/device/more/${categoryKey}`)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <PageNavBar class="-mx-4" title="更多设备" @back="router.back()" />

        <section class="app-card p-5">
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="item in categoryCards"
              :key="item.key"
              class="rounded-lg bg-white px-4 py-5 text-left ring-1 ring-line transition hover:ring-brand-200"
              type="button"
              @click="handleOpenDetail(item.key)"
            >
              <div
                v-if="item.key === 'sensor'"
                class="relative h-20 w-20 overflow-hidden rounded-[6px] bg-brand-50 ring-1 ring-brand-100"
                role="img"
                :aria-label="item.label"
              >
                <div class="absolute inset-3 flex items-center justify-center rounded-[6px] bg-white text-brand-700 ring-1 ring-brand-100">
                  <Activity :size="25" :stroke-width="2.2" />
                </div>
                <span class="absolute bottom-1.5 left-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-brand-500 text-white shadow-sm">
                  <Gauge :size="12" :stroke-width="2.3" />
                </span>
                <span class="absolute right-1.5 top-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-white text-brand-700 shadow-sm ring-1 ring-brand-100">
                  <Radio :size="10" :stroke-width="2.3" />
                </span>
              </div>
              <img
                v-else
                :src="item.image"
                :alt="item.label"
                class="h-20 w-20 rounded-[6px] bg-white object-cover ring-1 ring-line"
              />
              <p class="mt-4 text-[15px] font-700 tracking-[-0.02em] text-ink">{{ item.label }}</p>
              <p class="mt-2 text-[12px] leading-[1.6] text-muted">{{ item.description }}</p>
              <span class="mt-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-700 text-brand-700 ring-1 ring-brand-100">点击查看</span>
            </button>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
