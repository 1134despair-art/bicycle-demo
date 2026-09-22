<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { DataTrendCardData } from '../../data/data'
import DataSectionCard from './DataSectionCard.vue'

const props = defineProps<{
  item: DataTrendCardData
  sectionTitle?: string
}>()

const chartWidth = 320
const chartHeight = 184
const chartPaddingLeft = 24
const chartPaddingRight = 24
const chartPaddingTop = 52
const chartPaddingBottom = 24
const plotHeight = chartHeight - chartPaddingTop - chartPaddingBottom
const selectedPointIndex = ref<number | null>(null)

const buildSmoothLinePath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) {
    return ''
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index]
    const next = points[index + 1]
    const controlX = (current.x + next.x) / 2
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`
  }

  return path
}

const getNiceStep = (maximum: number) => {
  const rawStep = Math.max(maximum, 1) / 3
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const normalized = rawStep / magnitude
  const factors = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]
  const factor = factors.find((item) => item >= normalized) ?? 10
  return factor * magnitude
}

const yAxisStep = computed(() => {
  const maximum = Math.max(...props.item.bars.map((bar) => bar.value), 0)
  return getNiceStep(maximum)
})

const yAxisMaximum = computed(() => yAxisStep.value * 3)

const trendGridLines = computed(() => Array.from({ length: 4 }, (_, index) => {
  const value = index * yAxisStep.value
  const y = chartHeight - chartPaddingBottom - (value / yAxisMaximum.value) * plotHeight
  return { value, y }
}).reverse())

const trendPoints = computed(() => {
  const bars = props.item.bars
  if (bars.length === 0) {
    return []
  }

  const stepX = bars.length === 1 ? 0 : (chartWidth - chartPaddingLeft - chartPaddingRight) / (bars.length - 1)

  return bars.map((bar, index) => {
    const x = bars.length === 1 ? chartWidth / 2 : chartPaddingLeft + stepX * index
    const ratio = bar.value / yAxisMaximum.value
    const y = chartHeight - chartPaddingBottom - ratio * plotHeight
    const [axisLabel, axisDetail = ''] = bar.label.split('|')
    return { ...bar, axisLabel, axisDetail, x, y }
  })
})

const trendLinePath = computed(() => buildSmoothLinePath(trendPoints.value))

const trendAreaPath = computed(() => {
  if (trendPoints.value.length === 0) {
    return ''
  }

  const firstPoint = trendPoints.value[0]
  const lastPoint = trendPoints.value[trendPoints.value.length - 1]
  const baselineY = chartHeight - chartPaddingBottom

  return [
    `M ${firstPoint.x} ${baselineY}`,
    `L ${firstPoint.x} ${firstPoint.y}`,
    buildSmoothLinePath(trendPoints.value).replace(/^M\s[^ ]+\s[^ ]+/, ''),
    `L ${lastPoint.x} ${baselineY}`,
    'Z',
  ].join(' ')
})

const selectedPoint = computed(() => {
  if (selectedPointIndex.value === null) {
    return null
  }

  return trendPoints.value[selectedPointIndex.value] ?? null
})

const selectedTooltipStyle = computed(() => {
  if (!selectedPoint.value || selectedPointIndex.value === null) {
    return {}
  }

  if (selectedPointIndex.value === 0) {
    return { left: '0px' }
  }

  if (selectedPointIndex.value === trendPoints.value.length - 1) {
    return { right: '0px' }
  }

  return {
    left: `${(selectedPoint.value.x / chartWidth) * 100}%`,
    transform: 'translateX(-50%)',
  }
})

const trendSummaryPrefix = computed(() => {
  if (props.item.title.includes('每日')) {
    return '本周'
  }

  const matched = props.item.title.match(/^近\s*\d+\s*[^\s里程]+/)
  return matched?.[0] ?? '本周期'
})

const chartCaption = computed(() => {
  if (props.item.bars.some((bar) => bar.label.includes('|'))) {
    return '周一至周日每日里程'
  }

  if (props.item.title.includes('周')) {
    return '各周骑行里程'
  }

  return '各月骑行里程'
})

const formatDistance = (value: number) => `${Number(value.toFixed(1))} km`

watch(
  () => props.item,
  () => {
    selectedPointIndex.value = null
  },
)
</script>

<template>
  <DataSectionCard
    :section-title="sectionTitle"
    :title="item.title"
    :description="item.description"
  >
    <template v-if="$slots.controls" #top>
      <slot name="controls" />
    </template>

    <div>
      <div class="border-b border-line pb-3">
        <div class="trend-summary-grid app-metric-panel grid grid-cols-3 gap-px bg-line">
          <div class="app-metric-cell min-h-20 bg-white px-3 py-3">
            <p class="text-[12px] text-muted whitespace-nowrap">{{ trendSummaryPrefix }}里程</p>
            <p class="mt-1 text-[20px] font-700 text-ink whitespace-nowrap">{{ item.totalDistance }}</p>
          </div>
          <div class="app-metric-cell min-h-20 bg-white px-3 py-3">
            <p class="text-[12px] text-muted whitespace-nowrap">{{ trendSummaryPrefix }}时长</p>
            <p class="mt-1 text-[20px] font-700 text-ink whitespace-nowrap">{{ item.totalDuration }}</p>
          </div>
          <div class="app-metric-cell min-h-20 bg-white px-3 py-3">
            <p class="text-[12px] text-muted whitespace-nowrap">平均速度</p>
            <p class="mt-1 text-[20px] font-700 text-ink whitespace-nowrap">{{ item.avgSpeed }}</p>
          </div>
        </div>
      </div>

      <div class="mt-3 px-1 pb-1">
        <div class="flex items-end justify-between gap-3 px-1">
          <div>
            <p class="text-[13px] font-700 text-ink">骑行趋势</p>
            <p class="mt-1 text-[12px] leading-[1.45] text-muted">{{ chartCaption }}</p>
          </div>
          <p v-if="trendPoints.length" class="text-[10px] text-muted">点击数据点查看明细</p>
        </div>

        <div v-if="trendPoints.length" class="mt-3">
          <div class="min-w-0">
            <div
              class="trend-chart-stage relative bg-white"
              :style="{ height: `${chartHeight}px` }"
            >
              <span
                class="absolute z-10 whitespace-nowrap text-[10px] font-600 leading-none text-muted"
                :style="{
                  left: `${(chartPaddingLeft / chartWidth) * 100}%`,
                  top: `${chartPaddingTop - 20}px`,
                }"
                aria-hidden="true"
              >
                里程 / km
              </span>
              <span
                v-for="grid in trendGridLines"
                :key="grid.value"
                class="absolute left-0 z-10 w-5 text-right text-[10px] font-600 leading-none tabular-nums text-muted"
                :style="{ top: `${(grid.y / chartHeight) * 100}%`, transform: 'translateY(-50%)' }"
                aria-hidden="true"
              >
                {{ Number(grid.value.toFixed(1)) }}
              </span>
              <svg
                class="absolute inset-0 h-full w-full"
                :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <line
                  v-for="grid in trendGridLines"
                  :key="`grid-${grid.value}`"
                  :x1="chartPaddingLeft"
                  :x2="chartWidth - chartPaddingRight"
                  :y1="grid.y"
                  :y2="grid.y"
                  stroke="#DCE3EA"
                  stroke-dasharray="3 6"
                />
                <line
                  :x1="chartPaddingLeft"
                  :x2="chartPaddingLeft"
                  :y1="chartPaddingTop"
                  :y2="chartHeight - chartPaddingBottom"
                  stroke="#D5DCE3"
                />
                <line
                  :x1="chartPaddingLeft"
                  :x2="chartWidth - chartPaddingRight"
                  :y1="chartHeight - chartPaddingBottom"
                  :y2="chartHeight - chartPaddingBottom"
                  stroke="#D5DCE3"
                />
                  <line
                    v-if="selectedPoint"
                    :x1="selectedPoint.x"
                    :x2="selectedPoint.x"
                    :y1="chartPaddingTop"
                    :y2="chartHeight - chartPaddingBottom"
                    stroke="#FF7F00"
                    stroke-dasharray="4 5"
                    stroke-opacity="0.5"
                  />
                  <path :d="trendAreaPath" fill="url(#trend-area-gradient)" />
                  <path
                    :d="trendLinePath"
                    stroke="#FF7F00"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    vector-effect="non-scaling-stroke"
                  />
                  <circle
                    v-if="selectedPoint"
                    :cx="selectedPoint.x"
                    :cy="selectedPoint.y"
                    fill="#FF7F00"
                    fill-opacity="0.14"
                    r="11"
                  />
                  <circle
                    v-for="(point, index) in trendPoints"
                    :key="point.detailLabel"
                    :cx="point.x"
                    :cy="point.y"
                    :fill="selectedPointIndex === index ? '#FF7F00' : '#ffffff'"
                    :r="selectedPointIndex === index ? 5.5 : 4"
                    :stroke="selectedPointIndex === index ? '#FF7F00' : '#6E7378'"
                    stroke-width="2"
                    vector-effect="non-scaling-stroke"
                  />
                  <defs>
                    <linearGradient id="trend-area-gradient" x1="160" y1="48" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FF7F00" stop-opacity="0.18" />
                      <stop offset="1" stop-color="#FF7F00" stop-opacity="0" />
                    </linearGradient>
                  </defs>
              </svg>

              <div
                v-if="selectedPoint"
                class="absolute top-1 z-20 min-w-27 rounded-md border border-brand-200 bg-white px-2.5 py-1.5 shadow-float"
                :style="selectedTooltipStyle"
                role="status"
              >
                <p class="whitespace-nowrap text-[10px] font-600 text-muted">{{ selectedPoint.detailLabel }}</p>
                <p class="mt-0.5 whitespace-nowrap text-[13px] font-700 tabular-nums text-brand-500">{{ formatDistance(selectedPoint.value) }}</p>
              </div>

              <button
                v-for="(point, index) in trendPoints"
                :key="`hit-${point.detailLabel}`"
                class="trend-point-hit absolute z-10 h-11 w-11 cursor-pointer rounded-full bg-transparent"
                :class="{ 'is-selected': selectedPointIndex === index }"
                :style="{
                  left: `${(point.x / chartWidth) * 100}%`,
                  top: `${(point.y / chartHeight) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }"
                type="button"
                :aria-label="`${point.detailLabel}，骑行里程${formatDistance(point.value)}`"
                :aria-pressed="selectedPointIndex === index"
                @click="selectedPointIndex = index"
              />
            </div>

            <div class="relative mt-2 h-8">
              <div
                v-for="(point, index) in trendPoints"
                :key="`axis-${point.detailLabel}`"
                class="absolute top-0 w-11 text-center leading-none"
                :class="selectedPointIndex === index ? 'font-700 text-brand-500' : 'font-500 text-muted'"
                :style="{
                  left: `${(point.x / chartWidth) * 100}%`,
                  transform: 'translateX(-50%)',
                }"
              >
                <span class="block whitespace-nowrap text-[10px]">{{ point.axisLabel }}</span>
                <span v-if="point.axisDetail" class="mt-1 block whitespace-nowrap text-[9px] tabular-nums">{{ point.axisDetail }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mt-3 h-44 flex flex-col items-center justify-center border-y border-line bg-soft/45 px-4 text-center">
          <p class="text-[14px] font-700 text-ink">该周期暂无骑行数据</p>
          <p class="mt-1 text-[12px] leading-[1.5] text-muted">可选择其他周次查看里程趋势</p>
        </div>
      </div>
    </div>
  </DataSectionCard>
</template>

<style scoped>
.trend-point-hit {
  border: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.trend-point-hit:focus-visible {
  outline: 2px solid #ff7f00;
  outline-offset: -6px;
}

@media (prefers-reduced-motion: reduce) {
  .trend-point-hit {
    transition: none;
  }
}

@media (max-width: 340px) {
  .trend-summary-grid .app-metric-cell {
    padding-inline: 3px;
  }

  .trend-summary-grid p:first-child {
    font-size: 10px;
  }

  .trend-summary-grid p:last-child {
    font-size: 16px;
  }
}
</style>
