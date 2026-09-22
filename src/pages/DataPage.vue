<script setup lang="ts">
import { Play, Share2, Download, Bike, CalendarDays, ChevronDown, ChevronRight } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { DataTrendCard, DataWeekPickerSheet, ExportActionSheet, ShareCardActionSheet } from '../components/data'
import { dataPeriodOptionsMock, dataPeriodPanelsMock, dataWeekOptionsMock, dataWeekPanelsMock, emptyDataWeekPanelMock, exportActionOptionsMock, latestRideId, rideDetailMockMap, rideHistoryMock } from '../data/data'
import type { RideDetailData } from '../data/data'
import type { DataPeriodKey } from '../data/data'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const store = useAppStore()
const { liveRideResult, toastMessage, toastVisible } = storeToRefs(store)

const activePeriod = ref<DataPeriodKey>('week')
const selectedWeekKey = ref('2026-W29')
const weekPickerVisible = ref(false)
const selectedWeekOption = computed(() => dataWeekOptionsMock.find((item) => item.key === selectedWeekKey.value))
const activePeriodPanel = computed(() => {
  if (activePeriod.value !== 'week') {
    return dataPeriodPanelsMock[activePeriod.value]
  }

  const panel = dataWeekPanelsMock[selectedWeekKey.value]
  if (panel) {
    return panel
  }

  return {
    trend: {
      ...emptyDataWeekPanelMock.trend,
      title: selectedWeekOption.value
        ? `第${selectedWeekOption.value.week}周每日里程趋势`
        : emptyDataWeekPanelMock.trend.title,
    },
  }
})
const shareVisible = ref(false)
const exportVisible = ref(false)
const isStartingRide = ref(false)
const trendPeriodOptions = dataPeriodOptionsMock
const selectedDateLabel = computed(() => {
  if (activePeriod.value === 'week') {
    const option = selectedWeekOption.value
    return option
      ? `${option.year}年第${option.week}周 · ${option.startDate}-${option.endDate}`
      : '选择周次'
  }

  if (activePeriod.value === 'month') {
    return '2026年07月'
  }

  return '2026年'
})

const handlePeriodChange = (period: DataPeriodKey) => {
  activePeriod.value = period
  weekPickerVisible.value = false
}

const handleWeekPickerOpen = () => {
  if (activePeriod.value === 'week') {
    weekPickerVisible.value = true
  }
}

const handleWeekConfirm = (key: string) => {
  const option = dataWeekOptionsMock.find((item) => item.key === key)
  if (!option || option.disabled) {
    return
  }

  selectedWeekKey.value = key
  weekPickerVisible.value = false
}

type RideSnapshot = {
  distanceKm: number
  avgSpeed: number
  elapsedSeconds: number
  cadence: number
  heartRate: number
  power: number
  grade: number
  climbing: number
}

type ShareImageOptions = {
  layout: 'standard' | 'long'
  templateId: 'velocity' | 'night' | 'fresh' | 'custom'
  background: File | null
  target: 'save' | 'wechat' | 'moments' | 'more'
}

const defaultRideSnapshot: RideSnapshot = {
  distanceKm: 24.5,
  avgSpeed: 21.3,
  elapsedSeconds: 9 * 3600,
  cadence: 85,
  heartRate: 132,
  power: 245,
  grade: 3.2,
  climbing: 328,
}

const padNumber = (value: number) => String(value).padStart(2, '0')
const numberPattern = /-?\d+(?:\.\d+)?/

const formatDurationValue = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(secs)}`
}

const parseMetricNumber = (value?: string) => {
  if (!value) {
    return null
  }

  const matched = value.match(numberPattern)
  return matched ? Number(matched[0]) : null
}

const parseDurationToSeconds = (value?: string) => {
  if (!value) {
    return null
  }

  if (value.includes(':')) {
    const segments = value.split(':').map((segment) => Number(segment))
    if (segments.every((segment) => Number.isFinite(segment))) {
      const [hours = 0, minutes = 0, seconds = 0] = segments
      return hours * 3600 + minutes * 60 + seconds
    }
  }

  const hours = Number(value.match(/(\d+(?:\.\d+)?)\s*h/)?.[1] ?? 0)
  const minutes = Number(value.match(/(\d+(?:\.\d+)?)\s*m/)?.[1] ?? 0)
  const seconds = Number(value.match(/(\d+(?:\.\d+)?)\s*s/)?.[1] ?? 0)
  const totalSeconds = Math.round(hours * 3600 + minutes * 60 + seconds)
  return totalSeconds > 0 ? totalSeconds : null
}

const getMetricValue = (detail: RideDetailData, matcher: (label: string) => boolean, source: 'heroMetrics' | 'secondaryMetrics') =>
  detail[source].find((item) => matcher(item.label))?.value

const buildRideSnapshot = (detail: RideDetailData | null): RideSnapshot => {
  if (!detail) {
    return { ...defaultRideSnapshot }
  }

  const distanceKm = parseMetricNumber(getMetricValue(detail, (label) => label.includes('里程') || label.includes('距离'), 'heroMetrics'))
  const avgSpeed = parseMetricNumber(getMetricValue(detail, (label) => label.includes('平均速度'), 'heroMetrics'))
  const elapsedSeconds = parseDurationToSeconds(getMetricValue(detail, (label) => label.includes('时长'), 'heroMetrics'))
  const cadence = parseMetricNumber(getMetricValue(detail, (label) => label.includes('踏频'), 'secondaryMetrics'))
  const heartRate = parseMetricNumber(getMetricValue(detail, (label) => label.includes('心率'), 'secondaryMetrics'))
  const power = parseMetricNumber(getMetricValue(detail, (label) => label.includes('功率'), 'secondaryMetrics'))
  const climbing = parseMetricNumber(getMetricValue(detail, (label) => label.includes('爬升'), 'secondaryMetrics'))

  return {
    distanceKm: distanceKm ?? defaultRideSnapshot.distanceKm,
    avgSpeed: avgSpeed ?? defaultRideSnapshot.avgSpeed,
    elapsedSeconds: elapsedSeconds ?? defaultRideSnapshot.elapsedSeconds,
    cadence: Math.round(cadence ?? defaultRideSnapshot.cadence),
    heartRate: Math.round(heartRate ?? defaultRideSnapshot.heartRate),
    power: Math.round(power ?? defaultRideSnapshot.power),
    grade: defaultRideSnapshot.grade,
    climbing: Math.round(climbing ?? defaultRideSnapshot.climbing),
  }
}

const latestRideSnapshot = computed(() => {
  const recentRideDetail = liveRideResult.value ?? rideDetailMockMap[latestRideId] ?? null
  return buildRideSnapshot(recentRideDetail)
})

const isDefaultRideSnapshot = computed(() => {
  const snapshot = latestRideSnapshot.value

  return snapshot.distanceKm === defaultRideSnapshot.distanceKm
    && snapshot.avgSpeed === defaultRideSnapshot.avgSpeed
    && snapshot.elapsedSeconds === defaultRideSnapshot.elapsedSeconds
    && snapshot.cadence === defaultRideSnapshot.cadence
    && snapshot.heartRate === defaultRideSnapshot.heartRate
    && snapshot.power === defaultRideSnapshot.power
    && snapshot.grade === defaultRideSnapshot.grade
    && snapshot.climbing === defaultRideSnapshot.climbing
})

const currentRideStats = computed(() => {
  const snapshot = latestRideSnapshot.value
  const durationValue = isDefaultRideSnapshot.value
    ? padNumber(Math.floor(snapshot.elapsedSeconds / 3600))
    : formatDurationValue(snapshot.elapsedSeconds)
  const durationUnit = isDefaultRideSnapshot.value ? 'h' : ''

  return [
    {
      label: '距离',
      value: snapshot.distanceKm.toFixed(1),
      unit: 'km',
      tone: 'text-brand-500',
      surface: 'bg-[#FFF2E6]',
      span: 'col-span-2',
    },
    {
      label: '平均速度',
      value: snapshot.avgSpeed.toFixed(1),
      unit: 'km/h',
      tone: 'text-[#2563EB]',
      surface: 'bg-[#EEF6FF]',
      span: 'col-span-2',
    },
    {
      label: '用时',
      value: durationValue,
      unit: durationUnit,
      tone: 'text-[#374151]',
      surface: 'bg-[#F3F4F6]',
      span: 'col-span-2',
    },
    {
      label: '踏频',
      value: String(snapshot.cadence),
      unit: 'rpm',
      tone: 'text-[#0891B2]',
      surface: 'bg-[#ECFEFF]',
      span: 'col-span-2',
    },
    {
      label: '心率',
      value: String(snapshot.heartRate),
      unit: 'bpm',
      tone: 'text-[#E11D48]',
      surface: 'bg-[#FFF1F2]',
      span: 'col-span-2',
    },
    {
      label: '功率',
      value: String(snapshot.power),
      unit: 'W',
      tone: 'text-[#D97706]',
      surface: 'bg-[#FFFBEB]',
      span: 'col-span-2',
    },
    {
      label: '坡度',
      value: snapshot.grade.toFixed(1),
      unit: '%',
      tone: 'text-[#7C3AED]',
      surface: 'bg-[#F5F3FF]',
      span: 'col-span-3',
    },
    {
      label: '爬升',
      value: String(snapshot.climbing),
      unit: 'm',
      tone: 'text-[#059669]',
      surface: 'bg-[#ECFDF5]',
      span: 'col-span-3',
    },
  ]
})

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

  const label = tabItems.find((item) => item.key === key)?.label ?? '页面'
  store.showToast(`${label}模块将在下一阶段开发`)
}

const handleStartRide = () => {
  if (isStartingRide.value) {
    return
  }

  isStartingRide.value = true
  window.setTimeout(() => {
    store.finishRideSession()
    store.clearLiveRideResult()
    void router.push('/data/live')
  }, 360)
}

const handleExport = (key: string) => {
  exportVisible.value = false
  const label = exportActionOptionsMock.find((item) => item.key === key)?.label ?? '导出方式'
  store.showToast(`已开始${label}`)
}

const handleGenerateShareCard = (options: ShareImageOptions) => {
  shareVisible.value = false
  const feedbackMap = {
    save: '分享海报已保存',
    wechat: '正在打开微信分享',
    moments: '正在打开朋友圈分享',
    more: '正在打开更多分享方式',
  }
  store.showToast(feedbackMap[options.target])
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />
      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area">
        <PageNavBar :show-back="false" title="骑行数据" />

        <section class="px-4 pt-4">
          <button
            class="ride-entry-button app-primary-button min-h-15 w-full cursor-pointer px-5 text-[16px] disabled:cursor-default"
            :class="{ 'is-starting': isStartingRide }"
            :disabled="isStartingRide"
            type="button"
            @click="handleStartRide"
          >
            <span class="ride-entry-content inline-flex items-center justify-center gap-2.5">
              <Play class="ride-entry-icon" :size="18" :stroke-width="2.3" />
              <span>{{ isStartingRide ? '正在进入' : '开始骑行' }}</span>
            </span>
          </button>
        </section>

        <section class="px-4 pt-4">
          <div class="app-section-heading mb-3">
            <h2 class="app-section-title">本次骑行</h2>
            <div class="flex gap-2">
              <button
                class="min-h-11 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[11px] font-700 text-ink transition hover:bg-soft"
                type="button"
                @click="shareVisible = true"
              >
                <Share2 :size="14" :stroke-width="2.1" />
                分享
              </button>
              <button
                class="min-h-11 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[11px] font-700 text-ink transition hover:bg-soft"
                type="button"
                @click="exportVisible = true"
              >
                <Download :size="14" :stroke-width="2.1" />
                导出
              </button>
            </div>
          </div>

          <div class="app-card p-4">
            <div class="app-media mb-4 h-48 border border-line">
              <img
                alt="骑行地图轨迹"
                class="h-full w-full object-cover"
                src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=clean%20cycling%20route%20map%20preview%2C%20white%20background%2C%20minimal%20amap-style%20roads%20and%20river%2C%20mobile%20app%20ride%20tracking%20screen%2C%20professional%20sports%20ui&image_size=landscape_4_3"
              />
            </div>

            <div class="app-metric-panel grid grid-cols-6 gap-px bg-line">
              <div
                v-for="stat in currentRideStats"
                :key="stat.label"
                class="app-metric-cell current-ride-metric-cell"
                :class="[stat.surface, stat.span]"
              >
                <p class="current-ride-metric-label max-w-full truncate text-[10px] font-600 leading-none text-muted">{{ stat.label }}</p>
                <p class="app-metric-value max-w-full inline-flex items-baseline justify-center gap-1 text-[18px] font-700 leading-none" :class="stat.tone">
                  <span class="whitespace-nowrap">{{ stat.value }}</span>
                  <span v-if="stat.unit" class="shrink-0 text-[9px] font-500 text-current opacity-70">{{ stat.unit }}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <DataTrendCard :item="activePeriodPanel.trend" section-title="骑行统计">
          <template #controls>
            <div class="app-segmented grid grid-cols-3">
              <button
                v-for="item in trendPeriodOptions"
                :key="item.key"
                class="app-segmented-item cursor-pointer px-2 py-2 text-[12px] font-700 transition"
                :class="
                  activePeriod === item.key
                    ? 'bg-brand-500 text-white'
                    : 'text-muted hover:text-ink'
                "
                type="button"
                @click="handlePeriodChange(item.key)"
              >
                {{ item.label }}度骑行统计
              </button>
            </div>

            <button
              class="mt-3 min-h-11 max-w-full inline-flex items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-[12px] font-700 transition"
              :class="activePeriod === 'week' ? 'cursor-pointer bg-white text-ink hover:bg-soft' : 'cursor-default bg-soft/60 text-muted'"
              type="button"
              :disabled="activePeriod !== 'week'"
              aria-haspopup="dialog"
              :aria-expanded="weekPickerVisible"
              @click="handleWeekPickerOpen"
            >
              <CalendarDays :size="16" :stroke-width="2.1" class="shrink-0" />
              <span class="min-w-0 truncate">{{ selectedDateLabel }}</span>
              <ChevronDown v-if="activePeriod === 'week'" :size="15" :stroke-width="2.1" class="shrink-0 text-muted" />
            </button>
          </template>
        </DataTrendCard>

        <section class="px-4 pb-6 pt-4">
          <div class="app-section-heading mb-3">
            <h2 class="app-section-title">历史记录</h2>
            <button
              class="min-h-10 inline-flex cursor-pointer items-center rounded-lg px-3 text-[12px] font-700 text-brand-500 transition hover:bg-brand-50"
              type="button"
              @click="router.push('/data/history')"
            >
              更多
            </button>
          </div>

          <div class="app-list-group">
            <div
              v-for="item in rideHistoryMock.slice(0, 3)"
              :key="item.id"
              class="relative border-b border-line bg-white last:border-b-0"
            >
              <button
                class="group app-list-row w-full cursor-pointer justify-between text-left outline-none transition hover:bg-[#fafbfc] focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
                @click="router.push(`/data/ride/${item.id}`)"
              >
                <div class="min-w-0 flex items-center">
                  <div class="mr-4 h-12 w-12 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-500">
                    <Bike :size="20" :stroke-width="2.2" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="truncate text-[14px] font-700 tracking-[-0.01em] text-ink">{{ item.title }}</h4>
                    <p class="mt-1 text-[12px] text-muted">{{ item.date }}</p>
                  </div>
                </div>
                <div class="ml-4 flex items-center gap-3">
                  <div class="text-right">
                    <p class="app-metric-value text-[15px] font-700 text-brand-500">{{ item.distance }}</p>
                    <p class="mt-1 text-[12px] text-muted">{{ item.duration }}</p>
                  </div>
                  <ChevronRight
                    :size="16"
                    :stroke-width="2.1"
                    class="text-black/24 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                  />
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="data" :items="tabItems" @select="handleTab" />
    </div>

    <ShareCardActionSheet
      :visible="shareVisible"
      @close="shareVisible = false"
      @generate="handleGenerateShareCard"
    />
    <ExportActionSheet
      :options="exportActionOptionsMock"
      :visible="exportVisible"
      @close="exportVisible = false"
      @select="handleExport"
    />
    <DataWeekPickerSheet
      :options="dataWeekOptionsMock"
      :selected-key="selectedWeekKey"
      :visible="weekPickerVisible"
      @close="weekPickerVisible = false"
      @confirm="handleWeekConfirm"
    />
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>

<style scoped>
.current-ride-metric-cell {
  min-height: 68px;
  padding: 8px;
}

.current-ride-metric-label {
  margin-bottom: 6px;
}

.ride-entry-button {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(255, 127, 0, 0.2);
  transition:
    background-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.ride-entry-button::before {
  position: absolute;
  top: -35%;
  bottom: -35%;
  left: -18%;
  width: 12%;
  content: '';
  background: rgba(255, 255, 255, 0.16);
  transform: skewX(-18deg) translateX(-180%);
  animation: ride-entry-sweep 3.2s ease-in-out infinite;
}

.ride-entry-button::after {
  position: absolute;
  inset: 5px;
  z-index: -1;
  content: '';
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  animation: ride-entry-breathe 2.4s ease-in-out infinite;
}

.ride-entry-button:hover {
  background-color: var(--un-color-brand-500, #ff7f00);
  box-shadow: 0 10px 24px rgba(255, 127, 0, 0.24);
}

.ride-entry-button:active,
.ride-entry-button.is-starting {
  transform: scale(0.975);
}

.ride-entry-button.is-starting::before {
  width: 28%;
  animation: ride-entry-confirm 360ms ease-out forwards;
}

.ride-entry-content {
  position: relative;
  z-index: 1;
}

.ride-entry-icon {
  animation: ride-entry-icon 2.4s ease-in-out infinite;
}

.ride-entry-button.is-starting .ride-entry-icon {
  animation: ride-entry-icon-start 360ms ease-out forwards;
}

@keyframes ride-entry-breathe {
  0%,
  100% {
    opacity: 0.42;
    transform: scale(0.985);
  }
  50% {
    opacity: 0.9;
    transform: scale(1);
  }
}

@keyframes ride-entry-sweep {
  0%,
  58% {
    transform: skewX(-18deg) translateX(-180%);
  }
  82%,
  100% {
    transform: skewX(-18deg) translateX(1050%);
  }
}

@keyframes ride-entry-icon {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(2px);
  }
}

@keyframes ride-entry-confirm {
  from {
    transform: skewX(-18deg) translateX(-180%);
  }
  to {
    transform: skewX(-18deg) translateX(520%);
  }
}

@keyframes ride-entry-icon-start {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0.7;
    transform: translateX(5px) scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ride-entry-button,
  .ride-entry-button::before,
  .ride-entry-button::after,
  .ride-entry-icon {
    animation: none;
    transition-duration: 1ms;
  }
}

@media (max-width: 340px) {
  .current-ride-metric-cell {
    padding-inline: 4px;
  }

  .current-ride-metric-cell .app-metric-value {
    gap: 2px;
    font-size: 16px;
  }

  .current-ride-metric-label {
    font-size: 9px;
  }
}
</style>
