<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { latestRideId, rideDetailMockMap } from '../data/data'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

type RideDetailTabKey = 'overview' | 'detail' | 'laps' | 'charts'
type ChartTabKey = 'speed' | 'heartrate' | 'cadence' | 'altitude'

const DETAIL_TABS: Array<{ key: RideDetailTabKey, label: string }> = [
  { key: 'overview', label: '概览' },
  { key: 'detail', label: '详情' },
  { key: 'laps', label: '记圈' },
  { key: 'charts', label: '图表' },
]

const CHART_TABS: Array<{ key: ChartTabKey, label: string }> = [
  { key: 'speed', label: '速度' },
  { key: 'heartrate', label: '心率' },
  { key: 'cadence', label: '踏频' },
  { key: 'altitude', label: '海拔' },
]

const CHART_GRID_COUNT = 4
const numberPattern = /-?\d+(?:\.\d+)?/

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const activeTab = ref<RideDetailTabKey>('overview')
const activeChartTab = ref<ChartTabKey>('speed')
const isLandscapeChartVisible = ref(false)
const rideId = computed(() => (typeof route.params.rideId === 'string' ? route.params.rideId : latestRideId))

const rideDetail = computed(() => {
  return rideDetailMockMap[rideId.value] ?? rideDetailMockMap[latestRideId]
})

const parseMetricNumber = (value?: string) => {
  if (!value) {
    return 0
  }

  const matched = value.match(numberPattern)
  return matched ? Number(matched[0]) : 0
}

const getMetricValue = (
  source: 'heroMetrics' | 'secondaryMetrics',
  keywords: string[],
  fallback = '--',
) => rideDetail.value[source].find((item) => keywords.some((keyword) => item.label.includes(keyword)))?.value ?? fallback

const getDurationMinutes = (value: string) => {
  const hourMatch = value.match(/(\d+)\s*h/)
  const minuteMatch = value.match(/(\d+)\s*m/)
  const hours = hourMatch ? Number(hourMatch[1]) : 0
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0
  return hours * 60 + minutes
}

const formatDateTime = (dateValue: string, minuteOffset = 0) => {
  const baseDate = new Date(dateValue.replace(' ', 'T'))
  if (Number.isNaN(baseDate.getTime())) {
    return dateValue
  }

  baseDate.setMinutes(baseDate.getMinutes() + minuteOffset)
  const year = baseDate.getFullYear()
  const month = String(baseDate.getMonth() + 1).padStart(2, '0')
  const day = String(baseDate.getDate()).padStart(2, '0')
  const hours = String(baseDate.getHours()).padStart(2, '0')
  const minutes = String(baseDate.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const formatDurationDetail = (value: string, subtractSeconds = 0) => {
  const totalSeconds = Math.max(getDurationMinutes(value) * 60 - subtractSeconds, 0)
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${hours}h ${minutes}m ${seconds}s`
}

const overviewMetrics = computed(() => [
  {
    label: '距离',
    value: String(parseMetricNumber(getMetricValue('heroMetrics', ['距离', '里程']))),
    unit: 'km',
    tone: 'text-brand-500',
  },
  {
    label: '平均速度',
    value: String(parseMetricNumber(getMetricValue('heroMetrics', ['平均速度']))),
    unit: 'km/h',
    tone: 'text-ink',
  },
  {
    label: '用时',
    value: getMetricValue('heroMetrics', ['时长']).replace('1h', '01 h').replace('m', 'm'),
    unit: '',
    tone: 'text-ink',
  },
  {
    label: '踏频',
    value: String(parseMetricNumber(getMetricValue('secondaryMetrics', ['踏频']))),
    unit: 'rpm',
    tone: 'text-ink',
  },
])

const detailGroups = computed(() => {
  const duration = getMetricValue('heroMetrics', ['时长'])
  const avgSpeed = getMetricValue('heroMetrics', ['平均速度'])
  const maxSpeed = getMetricValue('secondaryMetrics', ['最大速度'], `${(parseMetricNumber(avgSpeed) + 12).toFixed(1)} km/h`)
  const climbing = getMetricValue('secondaryMetrics', ['爬升'])
  const avgHeartRate = getMetricValue('secondaryMetrics', ['心率'])
  const avgCadence = getMetricValue('secondaryMetrics', ['踏频'])
  const avgPower = getMetricValue('secondaryMetrics', ['功率'])
  const totalMinutes = getDurationMinutes(duration)
  const startTime = formatDateTime(rideDetail.value.date, 0)
  const endTime = formatDateTime(rideDetail.value.date, totalMinutes)

  return [
    {
      title: '计时信息',
      items: [
        { label: '开始时间', value: startTime },
        { label: '结束时间', value: endTime },
        { label: '总用时', value: formatDurationDetail(duration) },
        { label: '移动时间', value: formatDurationDetail(duration, 210) },
      ],
    },
    {
      title: '速度信息',
      items: [
        { label: '平均速度', value: avgSpeed.includes('km/h') ? avgSpeed : `${avgSpeed} km/h` },
        { label: '最大速度', value: maxSpeed.includes('km/h') ? maxSpeed : `${maxSpeed} km/h` },
      ],
    },
    {
      title: '海拔信息',
      items: [
        { label: '最低海拔', value: `${Math.max(parseMetricNumber(climbing) - 287, 125)} m` },
        { label: '最高海拔', value: `${Math.max(parseMetricNumber(climbing) - 26, 386)} m` },
        { label: '累计爬升', value: climbing.includes('m') ? climbing : `${climbing} m` },
        { label: '累计下降', value: `${Math.max(parseMetricNumber(climbing) - 16, 0)} m` },
      ],
    },
    {
      title: '体能信息',
      items: [
        { label: '平均心率', value: avgHeartRate.includes('bpm') ? avgHeartRate : `${avgHeartRate} bpm` },
        { label: '最大心率', value: `${parseMetricNumber(avgHeartRate) + 26} bpm` },
        { label: '平均踏频', value: avgCadence.includes('rpm') ? avgCadence : `${avgCadence} rpm` },
        { label: '平均功率', value: avgPower.toUpperCase().includes('W') ? avgPower.replace('w', ' W') : `${avgPower} W` },
      ],
    },
  ]
})

const lapRows = computed(() =>
  rideDetail.value.splits.map((split, index) => ({
    lap: index + 1,
    duration: split.duration.includes(':')
      ? split.duration
      : `00:${String(parseMetricNumber(split.duration)).padStart(2, '0')}:00`,
    distance: split.distance,
    avgSpeed: split.avgSpeed,
  })),
)

const activeChart = computed(() => {
  const keyMap: Record<ChartTabKey, string[]> = {
    speed: ['speed', '速度'],
    heartrate: ['heart-rate', '心率'],
    cadence: ['cadence', '踏频'],
    altitude: ['elevation', '海拔'],
  }
  return rideDetail.value.charts.find((item) => keyMap[activeChartTab.value].some((key) => item.key === key || item.label.includes(key))) ?? rideDetail.value.charts[0]
})

const chartTitle = computed(() => `${activeChart.value?.label ?? '速度'}变化`)
const chartUnit = computed(() => activeChart.value?.unit ?? '')
const chartValues = computed(() => activeChart.value?.values ?? [])
const chartMin = computed(() => Math.min(...chartValues.value))
const chartMax = computed(() => Math.max(...chartValues.value))
const chartRange = computed(() => Math.max(chartMax.value - chartMin.value, 1))
const chartTimeLabels = ['08:30', '08:50', '09:10', '09:30', '09:50', '10:10']
const chartLineColor = computed(() => '#FF7F00')
const chartAreaColor = computed(() => 'rgba(255,127,0,0.16)')

const chartYAxisLabels = computed(() =>
  Array.from({ length: CHART_GRID_COUNT + 1 }, (_, index) => {
    const ratio = (CHART_GRID_COUNT - index) / CHART_GRID_COUNT
    const value = chartMin.value + chartRange.value * ratio
    return `${Math.round(value)}${chartUnit.value}`
  }),
)

const chartGridRows = computed(() =>
  Array.from({ length: CHART_GRID_COUNT + 1 }, (_, index) => `${(index / CHART_GRID_COUNT) * 100}%`),
)

const chartPoints = computed(() => {
  if (!chartValues.value.length) {
    return []
  }

  const stepX = chartValues.value.length === 1 ? 0 : 100 / (chartValues.value.length - 1)

  return chartValues.value.map((value, index) => {
    const x = stepX * index
    const ratio = (value - chartMin.value) / chartRange.value
    const y = 100 - ratio * 100
    return { x, y, value }
  })
})

const chartLinePath = computed(() =>
  chartPoints.value.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '),
)

const chartAreaPath = computed(() => {
  if (!chartPoints.value.length) {
    return ''
  }

  const firstPoint = chartPoints.value[0]
  const lastPoint = chartPoints.value[chartPoints.value.length - 1]
  const baseline = 100
  const body = chartPoints.value.map((point) => `L ${point.x} ${point.y}`).join(' ')
  return `M ${firstPoint.x} ${baseline} ${body} L ${lastPoint.x} ${baseline} Z`
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

const handleFullscreen = () => {
  isLandscapeChartVisible.value = true
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />
      <PageNavBar :title="rideDetail.title" @back="router.back()" />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area">
        <section class="px-4 pb-20 pt-3">
          <div class="app-segmented mb-5">
            <div class="grid grid-cols-4 gap-1">
              <button
                v-for="tab in DETAIL_TABS"
                :key="tab.key"
                :class="activeTab === tab.key
                  ? 'bg-brand-500 text-white'
                  : 'text-#6b7280 hover:text-ink'"
                class="app-segmented-item px-2 py-2 text-[14px] font-700 whitespace-nowrap transition"
                type="button"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <template v-if="activeTab === 'overview'">
            <div class="app-card p-4">
              <div class="app-media relative mb-4 h-52 border border-line">
                <img
                  alt="骑行地图轨迹"
                  class="h-full w-full object-cover"
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=minimal%20cycling%20route%20map%20preview%2C%20clean%20light%20background%2C%20mobile%20app%20ride%20summary%20screen%2C%20professional%20sports%20ui&image_size=landscape_4_3"
                />
                <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0)_35%,rgba(15,23,42,0.12)_100%)]" />
              </div>

              <div class="app-metric-panel grid grid-cols-2 gap-px bg-line">
                <div
                  v-for="item in overviewMetrics"
                  :key="item.label"
                  class="app-metric-cell min-h-22 bg-white px-4 py-3"
                  :class="item.tone"
                >
                  <p class="mb-2 text-[12px] font-600 tracking-[0.01em] text-#6b7280">{{ item.label }}</p>
                  <p class="app-metric-value whitespace-nowrap text-[23px] font-700 leading-none">
                    {{ item.value }}
                    <span v-if="item.unit" class="ml-1 text-[13px] font-500 opacity-90">{{ item.unit }}</span>
                  </p>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="activeTab === 'detail'">
            <div class="app-card space-y-5 p-4">
              <section v-for="group in detailGroups" :key="group.title">
                <div class="mb-3 flex items-center gap-2">
                  <div class="h-2 w-2 rounded-full bg-brand-500" />
                  <h3 class="text-[17px] font-700 tracking-[-0.02em] text-ink">{{ group.title }}</h3>
                </div>
                <div class="app-metric-panel grid grid-cols-2 gap-px bg-line">
                  <div
                    v-for="item in group.items"
                    :key="`${group.title}-${item.label}`"
                    class="bg-white px-4 py-3"
                  >
                    <p class="mb-1 text-[12px] font-600 text-#7b8491">{{ item.label }}</p>
                    <p class="text-[16px] font-700 tracking-[-0.02em] text-ink">{{ item.value }}</p>
                  </div>
                </div>
              </section>
            </div>
          </template>

          <template v-else-if="activeTab === 'laps'">
            <div class="app-card p-4">
              <div class="app-list-group">
                <table class="w-full table-auto">
                  <thead>
                    <tr class="border-b border-black/6 bg-#f8fafc">
                      <th class="px-4 py-3 text-left text-[12px] font-700 tracking-[0.02em] text-#6b7280">圈数</th>
                      <th class="px-4 py-3 text-left text-[12px] font-700 tracking-[0.02em] text-#6b7280">时间</th>
                      <th class="px-4 py-3 text-left text-[12px] font-700 tracking-[0.02em] text-#6b7280">距离</th>
                      <th class="px-4 py-3 text-left text-[12px] font-700 tracking-[0.02em] text-#6b7280">平均速度</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in lapRows"
                      :key="row.lap"
                      class="border-b border-black/5 transition last:border-none odd:bg-white even:bg-#fbfcfd"
                    >
                      <td class="px-4 py-3.5 text-[14px] font-700 text-ink whitespace-nowrap">{{ row.lap }}</td>
                      <td class="px-4 py-3.5 text-[14px] text-ink whitespace-nowrap">{{ row.duration }}</td>
                      <td class="px-4 py-3.5 text-[14px] text-ink whitespace-nowrap">{{ row.distance }}</td>
                      <td class="px-4 py-3.5 text-[14px] text-brand-700 whitespace-nowrap">{{ row.avgSpeed }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="app-card p-4">
              <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-[18px] font-700 text-ink">数据图表</h3>
                  <p class="mt-1 text-[12px] text-#7b8491">多维度查看本次骑行变化趋势</p>
                </div>
                <button
                  class="min-h-11 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-brand-100 bg-brand-50 px-3 text-[13px] font-700 text-brand-500 transition hover:bg-brand-100"
                  type="button"
                  @click="handleFullscreen"
                >
                  <span>横屏</span>
                </button>
              </div>

              <div class="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-soft p-1">
                <button
                  v-for="tab in CHART_TABS"
                  :key="tab.key"
                  :class="activeChartTab === tab.key
                    ? 'bg-brand-500 text-white'
                    : 'text-#5b6472 hover:text-ink'"
                  class="rounded-lg px-3 py-2.5 text-[14px] font-700 transition"
                  type="button"
                  @click="activeChartTab = tab.key"
                >
                  {{ tab.label }}
                </button>
              </div>

              <p class="mb-4 text-center text-[16px] font-700 text-ink">{{ chartTitle }}</p>

              <div class="rounded-lg border border-line bg-white px-4 py-4">
                <div class="grid grid-cols-[44px_1fr] gap-3">
                  <div class="h-44 flex flex-col justify-between pb-6 text-right text-[11px] leading-none text-#6b7280">
                    <span v-for="label in chartYAxisLabels" :key="label">{{ label }}</span>
                  </div>

                  <div>
                    <div class="relative h-44">
                      <div class="absolute inset-0">
                        <div
                          v-for="line in chartGridRows"
                          :key="line"
                          class="absolute left-0 right-0 border-t border-#d7dfeb"
                          :style="{ top: line }"
                        />
                      </div>

                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        class="absolute inset-0 h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path :d="chartAreaPath" :fill="chartAreaColor" />
                        <path
                          :d="chartLinePath"
                          :stroke="chartLineColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.2"
                          vector-effect="non-scaling-stroke"
                        />

                        <circle
                          v-for="point in chartPoints"
                          :key="`${point.x}-${point.y}`"
                          :cx="point.x"
                          :cy="point.y"
                          r="1.6"
                          fill="#ffffff"
                          :stroke="chartLineColor"
                          stroke-width="1"
                          vector-effect="non-scaling-stroke"
                        />
                      </svg>
                    </div>

                    <div class="mt-2 grid grid-cols-6 text-center text-[11px] leading-none text-#6b7280">
                      <span v-for="label in chartTimeLabels" :key="label">{{ label }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </section>
      </div>

      <BottomTabBar active-key="data" :items="tabItems" @select="handleTab" />
    </div>

    <Teleport to="body">
      <div
        v-if="isLandscapeChartVisible"
        class="chart-landscape-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="chartTitle"
        @keydown.esc="isLandscapeChartVisible = false"
      >
        <button
          class="chart-landscape-close"
          type="button"
          aria-label="关闭横屏图表"
          title="关闭横屏图表"
          autofocus
          @click="isLandscapeChartVisible = false"
        >
          <X :size="22" :stroke-width="2.2" />
        </button>

        <div class="chart-landscape-content">
          <h2 class="chart-landscape-title">{{ chartTitle }}</h2>

          <div class="chart-landscape-plot">
            <div class="chart-landscape-y-axis">
              <span v-for="label in chartYAxisLabels" :key="label">{{ label }}</span>
            </div>

            <div class="chart-landscape-main">
              <div class="chart-landscape-canvas">
                <div class="absolute inset-0">
                  <div
                    v-for="line in chartGridRows"
                    :key="line"
                    class="absolute left-0 right-0 border-t border-#d7dfeb"
                    :style="{ top: line }"
                  />
                </div>

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  class="absolute inset-0 h-full w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path :d="chartAreaPath" :fill="chartAreaColor" />
                  <path
                    :d="chartLinePath"
                    :stroke="chartLineColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    vector-effect="non-scaling-stroke"
                  />

                  <circle
                    v-for="point in chartPoints"
                    :key="`${point.x}-${point.y}`"
                    :cx="point.x"
                    :cy="point.y"
                    r="1.5"
                    fill="#ffffff"
                    :stroke="chartLineColor"
                    stroke-width="1.3"
                    vector-effect="non-scaling-stroke"
                  />
                </svg>
              </div>

              <div class="chart-landscape-x-axis">
                <span v-for="label in chartTimeLabels" :key="label">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AppShell>
</template>

<style scoped>
.chart-landscape-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  padding: clamp(20px, 4vw, 48px);
  overflow: hidden;
  background: #f7f9fc;
  color: #111827;
}

.chart-landscape-content {
  width: min(100%, 1240px);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.chart-landscape-title {
  flex: none;
  padding-right: 56px;
  font-size: clamp(18px, 2.2vw, 28px);
  font-weight: 700;
  line-height: 1.25;
}

.chart-landscape-close {
  position: absolute;
  top: max(16px, env(safe-area-inset-top));
  right: max(16px, env(safe-area-inset-right));
  z-index: 2;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
  color: #273142;
  outline: none;
}

.chart-landscape-close:focus-visible {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3), 0 10px 24px rgba(15, 23, 42, 0.1);
}

.chart-landscape-plot {
  min-height: 0;
  flex: 1;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 18px;
  padding-top: clamp(20px, 4vh, 40px);
}

.chart-landscape-y-axis {
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 30px;
  text-align: right;
  font-size: 12px;
  line-height: 1;
  color: #667085;
}

.chart-landscape-main {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chart-landscape-canvas {
  position: relative;
  min-height: 180px;
  flex: 1;
}

.chart-landscape-x-axis {
  flex: none;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  padding-top: 14px;
  text-align: center;
  font-size: 12px;
  line-height: 1;
  color: #667085;
}

@media (orientation: portrait) and (max-width: 768px) {
  .chart-landscape-overlay {
    top: 50%;
    left: 50%;
    width: 100vh;
    height: 100vw;
    padding: 20px 28px;
    transform: translate(-50%, -50%) rotate(90deg);
  }

  .chart-landscape-title {
    font-size: 20px;
  }

  .chart-landscape-plot {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 14px;
    padding-top: 16px;
  }
}
</style>
