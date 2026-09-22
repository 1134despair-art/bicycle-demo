<script setup lang="ts">
import { ScanLine } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { antiCounterfeitSampleCodes } from '../api/antiCounterfeit'
import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const scanningPhase = ref<'preparing' | 'scanning'>('preparing')
const forwarding = ref(false)
let prepareTimer: number | undefined
let forwardTimer: number | undefined

const routeExists = (path: string) => router.resolve(path).matched.length > 0

const targetScanCode = computed(() => {
  const routeCode = typeof route.query.code === 'string' ? route.query.code.trim().toUpperCase() : ''
  if (routeCode) {
    return routeCode
  }

  return antiCounterfeitSampleCodes[0]
})

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
  }
}

const openResultPage = async (code: string) => {
  if (forwarding.value) {
    return
  }

  forwarding.value = true
  await router.replace({
    path: '/my/anti-counterfeit/result',
    query: { code },
  })
}

const startScanningFlow = () => {
  window.clearTimeout(prepareTimer)
  window.clearTimeout(forwardTimer)
  scanningPhase.value = 'preparing'
  forwarding.value = false

  prepareTimer = window.setTimeout(() => {
    scanningPhase.value = 'scanning'
    appStore.showToast('已调用二维码识别')
  }, 320)

  forwardTimer = window.setTimeout(() => {
    void openResultPage(targetScanCode.value)
  }, 1180)
}

onMounted(() => {
  startScanningFlow()
})

onBeforeUnmount(() => {
  window.clearTimeout(prepareTimer)
  window.clearTimeout(forwardTimer)
})
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] flex flex-col homepage-surface">
      <IosStatusBar />

      <div class="flex-1 px-4 pb-5">
        <PageNavBar class="-mx-4" title="防伪扫码" @back="goBack" />

        <section class="pt-4">
          <div class="app-card overflow-hidden px-5 py-6">
            <div class="rounded-lg bg-soft px-4 py-5 ring-1 ring-line">
              <div class="relative h-66 overflow-hidden rounded-[6px] border border-line bg-[#eef0f3]">
                <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.02)_0%,transparent_32%,rgba(0,0,0,0.015)_52%,transparent_70%,rgba(0,0,0,0.02)_100%)]" />
                <div class="absolute inset-5 rounded-lg border border-dashed border-brand-200/70" />
                <div class="absolute left-1/2 top-1/2 h-40 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-card ring-1 ring-black/5" />
                <div
                  class="absolute inset-x-8 h-[2px] bg-brand-500 shadow-[0_0_24px_rgba(255,127,0,0.55)] transition-[top] duration-500"
                  :class="scanningPhase === 'scanning' ? 'top-[46%]' : 'top-[32%]'"
                />
                <div class="absolute inset-x-0 bottom-7 flex flex-col items-center">
                  <div class="h-12 w-12 flex items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <ScanLine :size="21" :stroke-width="2.2" />
                  </div>
                  <p class="mt-4 text-[15px] font-700 tracking-[-0.03em] text-ink">
                    {{ scanningPhase === 'scanning' ? '正在识别二维码' : '正在调用二维码识别' }}
                  </p>
                  <p class="mt-2 text-[12px] leading-[1.7] text-[#7A8782]">
                    {{ scanningPhase === 'scanning' ? '识别成功后将直接展示防伪信息' : '请将产品二维码保持在识别框内' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-5 rounded-lg bg-soft px-4 py-4 ring-1 ring-line">
              <p class="text-[13px] font-700 tracking-[-0.02em] text-ink">当前演示码</p>
              <p class="mt-2 text-[15px] font-700 tracking-[0.02em] text-ink">
                {{ targetScanCode }}
              </p>
              <p class="mt-2 text-[12px] leading-[1.7] text-[#7A8782]">
                Demo 环境未接入真实相机 SDK，当前使用自动模拟扫码进入结果页。
              </p>
            </div>

            <button
              class="mt-5 min-h-12 w-full rounded-lg bg-brand-500 text-[15px] font-700 text-white outline-none transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="startScanningFlow"
            >
              重新调用扫码
            </button>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
