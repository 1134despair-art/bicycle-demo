<script setup lang="ts">
import { computed } from 'vue'

import type { RouteElevationPoint } from '../../data/routes'

const props = defineProps<{
  points: RouteElevationPoint[]
}>()

const chartPoints = computed(() => {
  if (!props.points.length) {
    return ''
  }

  const maxDistance = Math.max(...props.points.map((point) => point.distance), 1)
  const altitudes = props.points.map((point) => point.altitude)
  const minAltitude = Math.min(...altitudes)
  const maxAltitude = Math.max(...altitudes)
  const altitudeRange = Math.max(maxAltitude - minAltitude, 1)

  return props.points
    .map((point) => {
      const x = (point.distance / maxDistance) * 320
      const y = 104 - ((point.altitude - minAltitude) / altitudeRange) * 76
      return `${x},${y}`
    })
    .join(' ')
})

const areaPath = computed(() => {
  if (!chartPoints.value) {
    return ''
  }

  return `M0,112 L${chartPoints.value} L320,112 Z`
})

const minAltitudeLabel = computed(() => {
  if (!props.points.length) {
    return '--'
  }

  return `${Math.min(...props.points.map((point) => point.altitude))}m`
})

const maxAltitudeLabel = computed(() => {
  if (!props.points.length) {
    return '--'
  }

  return `${Math.max(...props.points.map((point) => point.altitude))}m`
})
</script>

<template>
  <div class="rounded-lg border border-line bg-white px-4 py-4 shadow-card">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-[18px] font-700 text-ink">路线海拔变化</h3>
      </div>
      <div class="text-right">
        <p class="text-[10px] text-muted">最高点</p>
        <p class="mt-1 text-[13px] font-700 text-ink">{{ maxAltitudeLabel }}</p>
      </div>
    </div>

    <svg class="mt-4 h-36 w-full" viewBox="0 0 320 120" preserveAspectRatio="none">
      <defs>
        <linearGradient id="route-elevation-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#FF7F00" stop-opacity="0.24" />
          <stop offset="100%" stop-color="#FF7F00" stop-opacity="0.02" />
        </linearGradient>
      </defs>

      <path d="M0,112 H320" fill="none" stroke="#d6dbe3" stroke-dasharray="4 6" stroke-width="1.5" />
      <path :d="areaPath" fill="url(#route-elevation-fill)" />
      <polyline
        :points="chartPoints"
        fill="none"
        stroke="#FF7F00"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="4"
      />
    </svg>

    <div class="mt-3 flex items-center justify-between gap-3 text-[12px] text-muted">
      <span>起点</span>
      <span>最低 {{ minAltitudeLabel }}</span>
      <span>终点</span>
    </div>
  </div>
</template>
