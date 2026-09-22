<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppOptionSheet from '../components/feedback/AppOptionSheet.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const heartrateWarning = ref(180)
const warningStyle = ref<'beep' | 'screen'>('beep')
const warningStyleSheetVisible = ref(false)
const warningStyleOptions = [
  {
    key: 'beep' as const,
    label: '蜂鸣',
    description: '通过设备蜂鸣器进行提醒',
  },
  {
    key: 'screen' as const,
    label: '亮屏',
    description: '通过屏幕高亮进行视觉提醒',
  },
]

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

const selectWarningStyle = (style: 'beep' | 'screen') => {
  warningStyle.value = style
  appStore.showToast(`警示提醒样式已切换为${style === 'beep' ? '蜂鸣' : '亮屏'}`)
}

const normalizeHeartRate = () => {
  if (!Number.isFinite(heartrateWarning.value)) {
    heartrateWarning.value = 180
    return
  }

  heartrateWarning.value = Math.min(220, Math.max(60, Math.round(heartrateWarning.value)))
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <div>
          <PageNavBar class="-mx-4" title="警示设置" @back="router.back()" />

          <section class="app-card mt-4 p-4">
            <div class="flex items-center gap-2 text-[14px] font-700 text-ink">
              <span class="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              <h2>警示提醒设置</h2>
            </div>

            <section class="mt-4 rounded-lg bg-soft p-4 ring-1 ring-line">
              <h3 class="text-[14px] font-700 text-ink">警示触发条件</h3>
              <div class="mt-4 flex items-center justify-between gap-3 rounded-lg bg-white px-4 py-3 ring-1 ring-line">
                <span class="text-[13px] text-ink">心率高于</span>
                <div class="flex items-center gap-2">
                  <input
                    v-model="heartrateWarning"
                    class="w-16 rounded-lg border border-line bg-white px-2 py-1.5 text-center text-[15px] font-700 text-ink outline-none focus:ring-2 focus:ring-brand-500"
                    type="number"
                    @blur="normalizeHeartRate"
                  />
                  <span class="text-[12px] text-muted">次/分钟</span>
                </div>
              </div>
            </section>

            <section class="mt-4 rounded-lg bg-soft p-4 ring-1 ring-line">
              <h3 class="text-[14px] font-700 text-ink">警示提醒样式</h3>
              <button
                class="mt-4 flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left ring-1 ring-line transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
                @click="warningStyleSheetVisible = true"
              >
                <div class="min-w-0">
                  <p class="text-[13px] font-600 text-ink">{{ warningStyle === 'beep' ? '蜂鸣' : '亮屏' }}</p>
                  <p class="mt-1 text-[12px] leading-[1.5] text-muted">
                    {{ warningStyle === 'beep' ? '通过设备蜂鸣器进行提醒' : '通过屏幕高亮进行视觉提醒' }}
                  </p>
                </div>
                <span class="text-[18px] text-#9aa3af">›</span>
              </button>
            </section>
          </section>
        </div>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppOptionSheet
      :options="warningStyleOptions"
      :selected-key="warningStyle"
      :visible="warningStyleSheetVisible"
      description="请选择设备触发警示时的提醒方式。"
      title="警示提醒样式"
      @close="warningStyleSheetVisible = false"
      @select="selectWarningStyle($event as 'beep' | 'screen')"
    />
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
