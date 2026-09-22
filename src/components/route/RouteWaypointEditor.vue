<script setup lang="ts">
import type { RoutePoint } from '../../data/routes'

defineProps<{
  startPoint: RoutePoint
  viaPoints: RoutePoint[]
  endPoint: RoutePoint
}>()
</script>

<template>
  <div class="app-card px-4 py-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">点位编辑</p>
        <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">起终点与途经点</h3>
      </div>
      <span class="rounded-full bg-#f5f6f8 px-3 py-2 text-[11px] font-700 text-ink">
        {{ viaPoints.length + 2 }} 个点位
      </span>
    </div>

    <div class="mt-4 space-y-3">
      <div class="rounded-lg bg-soft px-4 py-3">
        <p class="text-[11px] text-muted">{{ startPoint.label }}</p>
        <p class="mt-1 text-[15px] font-700 text-ink">{{ startPoint.name }}</p>
      </div>

      <div
        v-for="point in viaPoints"
        :key="`${point.name}-${point.note ?? ''}`"
        class="rounded-lg bg-soft px-4 py-3"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] text-muted">{{ point.label }}</p>
            <p class="mt-1 text-[15px] font-700 text-ink">{{ point.name }}</p>
          </div>
          <span v-if="point.note" class="rounded-full bg-white px-3 py-1.5 text-[10px] font-700 text-brand-700">
            {{ point.note }}
          </span>
        </div>
      </div>

      <button
        class="w-full rounded-lg border border-dashed border-line bg-white px-4 py-3 text-[14px] font-600 text-muted"
        type="button"
      >
        添加途经点
      </button>

      <div class="rounded-lg bg-soft px-4 py-3">
        <p class="text-[11px] text-muted">{{ endPoint.label }}</p>
        <p class="mt-1 text-[15px] font-700 text-ink">{{ endPoint.name }}</p>
      </div>
    </div>
  </div>
</template>
