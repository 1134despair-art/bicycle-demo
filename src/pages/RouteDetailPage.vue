<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppToast from '../components/feedback/AppToast.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import { officialRouteLibraryMock } from '../data/routes'
import RouteElevationChart from '../components/route/RouteElevationChart.vue'
import RouteMetricGrid from '../components/route/RouteMetricGrid.vue'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const route = useRoute()
const store = useAppStore()
const { bikeComputerConnected, savedRoutes, toastMessage, toastVisible } = storeToRefs(store)

const ZOOM_MIN = 1
const ZOOM_MAX = 2.5
const ZOOM_STEP = 0.25

const routeId = computed(() => (typeof route.params.routeId === 'string' ? route.params.routeId : ''))
const savedRouteItem = computed(() => savedRoutes.value.find((item) => item.id === routeId.value))
const officialRouteItem = computed(() => officialRouteLibraryMock.find((item) => item.id === routeId.value))
const routeItem = computed(() => savedRouteItem.value ?? officialRouteItem.value)
const showBikeComputerSection = computed(() => Boolean(savedRouteItem.value))
const zoomLevel = ref(ZOOM_MIN)
const isEditingSavedRouteName = ref(false)
const editedSavedRouteName = ref('')

const clampZoomLevel = (value: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value))

const handleBack = () => {
  void router.push('/routes')
}

const handleZoomIn = () => {
  zoomLevel.value = clampZoomLevel(zoomLevel.value + ZOOM_STEP)
}

const handleZoomOut = () => {
  zoomLevel.value = clampZoomLevel(zoomLevel.value - ZOOM_STEP)
}

const handleImportToDevice = () => {
  if (!bikeComputerConnected.value || !routeItem.value) {
    return
  }

  store.showToast(`已导入到码表：${routeItem.value.name}`)
}

const handleStartEditSavedRouteName = () => {
  if (!savedRouteItem.value) {
    return
  }

  editedSavedRouteName.value = savedRouteItem.value.name
  isEditingSavedRouteName.value = true
}

const handleCancelEditSavedRouteName = () => {
  editedSavedRouteName.value = savedRouteItem.value?.name ?? ''
  isEditingSavedRouteName.value = false
}

const handleSaveSavedRouteName = () => {
  if (!savedRouteItem.value) {
    return
  }

  const hasUpdated = store.updateSavedRouteName(savedRouteItem.value.id, editedSavedRouteName.value)
  if (!hasUpdated) {
    store.showToast('请输入路线名称')
    return
  }

  isEditingSavedRouteName.value = false
  store.showToast('路线名称已更新')
}

watch(routeId, () => {
  zoomLevel.value = ZOOM_MIN
})

watch(savedRouteItem, (value) => {
  if (!value) {
    isEditingSavedRouteName.value = false
    editedSavedRouteName.value = ''
    return
  }

  if (isEditingSavedRouteName.value) {
    return
  }

  editedSavedRouteName.value = value.name
}, { immediate: true })
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <PageNavBar title="路线详情" @back="handleBack" />

      <template v-if="routeItem">
        <section class="px-4 pt-2">
          <div class="relative overflow-hidden rounded-[6px] border border-line bg-white">
            <div class="relative h-[260px] overflow-hidden bg-#dfe9dd">
              <div class="absolute inset-0">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_42%),linear-gradient(180deg,rgba(12,31,18,0.02),rgba(12,31,18,0.12))]" />
                <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.22)_1px,transparent_1px)] bg-[size:36px_36px] opacity-55" />
              </div>

              <div class="absolute inset-0 overflow-hidden">
                <img
                  :alt="`${routeItem.name} 地图预览`"
                  :src="routeItem.image"
                  :style="{ transform: `scale(${zoomLevel})` }"
                  class="h-full w-full origin-center object-cover transition-transform duration-200 ease-out"
                >
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,rgba(255,255,255,0.28),transparent_28%)]" />
                <div class="absolute left-[14%] top-[63%] h-[6px] w-[42px] rounded-full bg-#0e7a45/86 shadow-[0_0_0_3px_rgba(255,255,255,0.22)] rotate-[-24deg]" />
                <div class="absolute left-[28%] top-[55%] h-[6px] w-[66px] rounded-full bg-#16a34a/92 shadow-[0_0_0_3px_rgba(255,255,255,0.22)] rotate-[18deg]" />
                <div class="absolute left-[50%] top-[48%] h-[6px] w-[58px] rounded-full bg-#22c55e/92 shadow-[0_0_0_3px_rgba(255,255,255,0.22)] rotate-[-16deg]" />
                <div class="absolute left-[66%] top-[39%] h-[14px] w-[14px] rounded-full border-4 border-white bg-#16a34a shadow-[0_10px_20px_rgba(22,163,74,0.28)]" />
              </div>

              <div class="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-4 pt-4">
                <div class="pointer-events-auto max-w-[72%] rounded-[16px] bg-white/92 px-3 py-2 backdrop-blur-sm shadow-[0_10px_24px_rgba(34,40,38,0.10)]">
                  <p class="text-[11px] uppercase tracking-[0.12em] text-#4c6355">地图视图</p>

                  <template v-if="savedRouteItem">
                    <div v-if="isEditingSavedRouteName" class="mt-1">
                      <input
                        v-model="editedSavedRouteName"
                        class="h-10 w-full rounded-lg border border-brand-500/30 bg-white px-3 text-[14px] text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                        maxlength="24"
                        placeholder="请输入路线名称"
                        type="text"
                        @keydown.enter.prevent="handleSaveSavedRouteName"
                      >

                      <div class="mt-2 flex items-center gap-2">
                        <button
                          class="min-h-11 rounded-lg bg-brand-500 px-3 py-1.5 text-[12px] font-700 text-white outline-none transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
                          type="button"
                          @click="handleSaveSavedRouteName"
                        >
                          保存
                        </button>
                        <button
                          class="min-h-11 rounded-lg bg-white px-3 py-1.5 text-[12px] font-700 text-ink outline-none transition hover:bg-#f5f5f5 focus-visible:ring-2 focus-visible:ring-brand-500"
                          type="button"
                          @click="handleCancelEditSavedRouteName"
                        >
                          取消
                        </button>
                      </div>
                    </div>

                    <div v-else>
                      <div class="mt-1 flex items-center gap-2">
                        <h2 class="min-w-0 flex-1 text-[17px] font-700 leading-[1.3] text-ink">{{ routeItem.name }}</h2>
                        <button
                          class="min-h-11 shrink-0 inline-flex items-center rounded-lg bg-white px-3 text-[11px] font-700 text-#166534 outline-none transition hover:bg-#f7faf8 focus-visible:ring-2 focus-visible:ring-brand-500"
                          type="button"
                          @click="handleStartEditSavedRouteName"
                        >
                          编辑名称
                        </button>
                      </div>
                      <p class="mt-1 text-[12px] text-#53665a">{{ routeItem.distance }} · 爬升 {{ routeItem.elevation }}</p>
                    </div>
                  </template>

                  <template v-else>
                    <h2 class="mt-1 text-[17px] font-700 leading-[1.3] text-ink">{{ routeItem.name }}</h2>
                    <p class="mt-1 text-[12px] text-#53665a">{{ routeItem.distance }} · 爬升 {{ routeItem.elevation }}</p>
                  </template>
                </div>
                <div class="pointer-events-none rounded-full bg-#0f172a/72 px-3 py-1.5 text-[11px] font-600 tracking-[0.08em] text-white shadow-[0_10px_18px_rgba(15,23,42,0.20)]">
                  ZOOM {{ zoomLevel.toFixed(2) }}x
                </div>
              </div>

              <div class="pointer-events-none absolute bottom-4 left-4 flex items-end gap-2">
                <div class="rounded-full bg-white/86 px-3 py-2 text-[12px] font-600 text-ink backdrop-blur-sm shadow-[0_10px_24px_rgba(34,40,38,0.10)]">
                  当前视野
                </div>
                <div class="rounded-full bg-#ecfdf3/92 px-3 py-2 text-[12px] font-600 text-#166534 backdrop-blur-sm shadow-[0_10px_24px_rgba(34,40,38,0.10)]">
                  轨迹已加载
                </div>
              </div>

              <div class="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  :class="zoomLevel < ZOOM_MAX ? 'cursor-pointer bg-white text-#166534 hover:bg-#f7faf8' : 'cursor-not-allowed bg-white/80 text-muted'"
                  :disabled="zoomLevel >= ZOOM_MAX"
                  class="h-11 w-11 flex items-center justify-center rounded-full text-[22px] shadow-[0_10px_24px_rgba(34,40,38,0.12)] outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500 disabled:shadow-none"
                  type="button"
                  @click="handleZoomIn"
                >
                  +
                </button>
                <button
                  :class="zoomLevel > ZOOM_MIN ? 'cursor-pointer bg-white text-#166534 hover:bg-#f7faf8' : 'cursor-not-allowed bg-white/80 text-muted'"
                  :disabled="zoomLevel <= ZOOM_MIN"
                  class="h-11 w-11 flex items-center justify-center rounded-full text-[22px] shadow-[0_10px_24px_rgba(34,40,38,0.12)] outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500 disabled:shadow-none"
                  type="button"
                  @click="handleZoomOut"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </section>

        <section v-if="showBikeComputerSection" class="px-4 pt-4">
          <div class="app-card px-4 py-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[11px] uppercase tracking-[0.12em] text-muted">码表状态</p>
                <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">
                  {{ bikeComputerConnected ? '码表已连接' : '码表未连接' }}
                </h3>
                <p class="mt-2 text-[13px] leading-[1.6] text-muted">
                  {{
                    bikeComputerConnected
                      ? '当前设备在线，可将当前路线快速导入到码表。'
                      : '当前设备离线，暂时无法导入到码表。'
                  }}
                </p>
              </div>
              <div
                :class="bikeComputerConnected ? 'bg-#e8f7ef text-#166534' : 'bg-#f3f4f6 text-#6b7280'"
                class="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-700"
              >
                {{ bikeComputerConnected ? '在线' : '离线' }}
              </div>
            </div>

            <button
              :disabled="!bikeComputerConnected"
              class="mt-4 min-h-12 w-full rounded-lg text-[14px] font-700 outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:bg-#e5e7eb disabled:text-#9ca3af"
              :class="bikeComputerConnected ? 'bg-brand-500 text-white hover:bg-brand-600' : ''"
              type="button"
              @click="handleImportToDevice"
            >
              导入码表
            </button>
          </div>
        </section>

        <section class="px-4 pt-4">
          <RouteMetricGrid
            :distance="routeItem.distance"
            :elevation="routeItem.elevation"
          />
        </section>

        <section class="px-4 py-4">
          <RouteElevationChart :points="routeItem.elevationSeries" />
        </section>
      </template>

      <section v-else class="px-4 pt-2">
        <div class="app-card px-4 py-6 text-center">
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">路线详情</p>
          <h2 class="mt-2 text-[20px] font-700 text-ink">未找到对应路线</h2>
          <p class="mt-2 text-[14px] leading-[1.7] text-muted">当前路线不存在或已失效，请返回路线列表重新选择。</p>
          <button
            class="mt-5 min-h-12 w-full rounded-lg bg-brand-500 text-[14px] font-700 text-white hover:bg-brand-600"
            type="button"
            @click="handleBack"
          >
            返回路线列表
          </button>
        </div>
      </section>
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
