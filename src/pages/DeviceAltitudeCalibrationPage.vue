<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const currentAltitude = ref(1250)
const isEditing = ref(false)

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

const handleStartEdit = () => {
  isEditing.value = true
}

const applyCalibration = () => {
  isEditing.value = false
  appStore.showToast(`高度校准已发送，当前基准高度 ${currentAltitude.value} m`)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <div>
          <PageNavBar class="-mx-4" title="高度校准" @back="router.back()" />

          <section class="app-card mt-4 p-4">
            <h2 class="text-[15px] font-700 text-ink">当前高度</h2>

            <div class="mt-4 flex items-center justify-between gap-3">
              <div>
                <p class="text-[12px] text-muted">当前高度值:</p>
              </div>

              <div class="flex items-center gap-2">
                <template v-if="isEditing">
                  <input
                    v-model="currentAltitude"
                    class="w-24 rounded-lg border border-line bg-white px-2 py-1 text-right text-[22px] font-700 text-ink outline-none focus:ring-2 focus:ring-brand-500"
                    type="number"
                  />
                  <span class="text-[12px] text-muted">m</span>
                </template>
                <template v-else>
                  <p class="text-[24px] font-700 text-ink">{{ currentAltitude }}</p>
                  <span class="text-[12px] text-muted">m</span>
                </template>
                <button
                  class="h-7 w-7 flex items-center justify-center rounded-full text-brand-600 transition hover:bg-brand-50"
                  type="button"
                  @click="handleStartEdit"
                >
                  <Pencil :size="14" :stroke-width="2.2" />
                </button>
              </div>
            </div>

            <p class="mt-4 text-[12px] leading-[1.7] text-muted">
              当前高度从码表中获取，若当前高度不准确可手动编辑校准。
            </p>
          </section>

          <button
            class="app-primary-button mt-18 w-full px-4 text-[13px]"
            type="button"
            @click="applyCalibration"
          >
            发送
          </button>
        </div>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
