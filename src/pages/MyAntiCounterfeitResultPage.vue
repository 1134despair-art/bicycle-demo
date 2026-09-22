<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { queryAntiCounterfeitByCode } from '../api/antiCounterfeit'
import type { AntiCounterfeitRecord } from '../api/antiCounterfeit'
import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { resolveAntiCounterfeitDevicePath } from '../utils/snDeviceResolver'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const loading = ref(true)
const errorMessage = ref('')
const record = ref<AntiCounterfeitRecord | null>(null)

const queryCode = computed(() => (typeof route.query.code === 'string' ? route.query.code.trim().toUpperCase() : ''))
const resolvedDevicePath = computed(() => (record.value ? resolveAntiCounterfeitDevicePath(record.value) : null))
const infoRows = computed(() => {
  if (!record.value) {
    return []
  }

  return [
    { label: '激活时间', value: record.value.activationTime },
    { label: '地区', value: record.value.region },
    { label: '序列号', value: record.value.sn },
    { label: '产品号', value: record.value.productCode },
    { label: '销售门店', value: record.value.storeName },
    { label: '销售类型', value: record.value.salesType },
    {
      label: '激活状态',
      value: record.value.activationState,
      actionable: Boolean(resolvedDevicePath.value),
    },
  ]
})

const routeExists = (path: string) => router.resolve(path).matched.length > 0

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  if (routeExists('/my/anti-counterfeit')) {
    void router.push('/my/anti-counterfeit')
    return
  }

  void router.push('/my')
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

const loadResult = async () => {
  if (!queryCode.value) {
    loading.value = false
    errorMessage.value = '缺少防伪码，请返回重新扫码。'
    record.value = null
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    record.value = await queryAntiCounterfeitByCode(queryCode.value)
  }
  catch (error) {
    record.value = null
    errorMessage.value = error instanceof Error ? error.message : '防伪信息查询失败，请稍后重试'
  }
  finally {
    loading.value = false
  }
}

const goToDevicePage = () => {
  if (!resolvedDevicePath.value) {
    appStore.showToast('当前 SN 码暂未匹配到对应设备页面')
    return
  }

  void router.push(resolvedDevicePath.value)
}

const handleInfoRowClick = (label: string) => {
  if (label === '激活状态' && resolvedDevicePath.value) {
    goToDevicePage()
  }
}

onMounted(() => {
  void loadResult()
})

watch(
  () => route.query.code,
  () => {
    void loadResult()
  },
)
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] flex flex-col homepage-surface">
      <IosStatusBar />

      <div class="flex-1 px-4 pb-5">
        <PageNavBar class="-mx-4" title="防伪结果" @back="goBack" />

        <section class="pt-4">
          <div class="app-card overflow-hidden px-5 py-5">
            <div v-if="loading" class="py-10 text-center">
              <div class="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#d8dee7] border-t-brand-600" />
              <p class="mt-4 text-[16px] font-700 text-ink">正在查询防伪信息</p>
              <p class="mt-2 text-[12px] leading-[1.8] text-[#7A8782]">正在通过甲方 API 校验当前二维码，请稍候。</p>
            </div>

            <div v-else-if="errorMessage" class="py-4">
              <div class="flex items-start gap-3 rounded-lg bg-[#fff5ea] px-4 py-4 ring-1 ring-[#f4dfbe]">
                <div class="h-11 w-11 shrink-0 flex items-center justify-center rounded-[6px] bg-white text-[#d97706] ring-1 ring-[#f4dfbe]">
                  <AlertTriangle :size="20" :stroke-width="2.2" />
                </div>
                <div class="min-w-0">
                  <p class="text-[15px] font-700 text-ink">查询失败</p>
                  <p class="mt-2 text-[12px] leading-[1.8] text-[#7A8782]">{{ errorMessage }}</p>
                </div>
              </div>

              <button
                class="mt-5 min-h-12 w-full rounded-lg bg-brand-500 text-[14px] font-700 text-white outline-none transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
                @click="loadResult"
              >
                重新查询
              </button>
            </div>

            <div v-else-if="record">
              <div class="overflow-hidden rounded-lg bg-soft ring-1 ring-line">
                <button
                  v-for="row in infoRows"
                  :key="row.label"
                  class="w-full flex items-center justify-between gap-5 border-b border-black/6 px-4 py-4 text-left last:border-b-0"
                  type="button"
                  :disabled="!row.actionable"
                  @click="handleInfoRowClick(row.label)"
                >
                  <span class="text-[14px] font-600 tracking-[-0.02em] text-ink">{{ row.label }}</span>
                  <span class="flex items-center gap-2 text-right text-[14px] font-500 text-[#59655F]">
                    <span class="max-w-[190px] break-all">{{ row.value }}</span>
                    <span v-if="row.actionable" class="text-black/28">›</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
