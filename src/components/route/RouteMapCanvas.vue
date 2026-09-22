<script setup lang="ts">
import { computed } from 'vue'

import type { RoutePoint } from '../../data/routes'

const props = defineProps<{
  image: string
  startPoint: RoutePoint
  viaPoints: RoutePoint[]
  endPoint: RoutePoint
}>()

const waypointSummary = computed(() => {
  if (!props.viaPoints.length) {
    return '直达路线'
  }

  return `${props.viaPoints.length} 个途经点`
})
</script>

<template>
  <div class="relative overflow-hidden rounded-[6px] border border-line bg-white">
    <img :src="image" alt="路线地图" class="h-[280px] w-full object-cover">
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_38%,rgba(18,24,26,0.08)_72%,rgba(18,24,26,0.32)_100%)]" />

    <div class="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-2 text-[11px] font-700 text-ink shadow-[0_8px_20px_rgba(34,40,38,0.12)]">
      地图规划
    </div>

    <div class="absolute inset-x-4 bottom-4 rounded-[16px] bg-white/92 px-4 py-4 shadow-[0_12px_32px_rgba(29,29,31,0.12)] backdrop-blur-md">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">路线概览</p>
          <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">
            {{ startPoint.name }} 至 {{ endPoint.name }}
          </h3>
        </div>
        <span class="rounded-full bg-#f5f6f8 px-3 py-2 text-[11px] font-700 text-ink">
          {{ waypointSummary }}
        </span>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-soft px-3 py-3">
          <p class="text-[10px] text-muted">起点</p>
          <p class="mt-1 text-[13px] font-700 text-ink">{{ startPoint.name }}</p>
        </div>
        <div class="rounded-lg bg-soft px-3 py-3">
          <p class="text-[10px] text-muted">途经</p>
          <p class="mt-1 text-[13px] font-700 text-ink">{{ viaPoints.length || '无' }}</p>
        </div>
        <div class="rounded-lg bg-soft px-3 py-3">
          <p class="text-[10px] text-muted">终点</p>
          <p class="mt-1 text-[13px] font-700 text-ink">{{ endPoint.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
