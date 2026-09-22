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
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">路线点位</p>
        <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">起终点与途经点</h3>
      </div>
      <span class="rounded-full bg-#f5f6f8 px-3 py-2 text-[11px] font-700 text-ink">
        {{ viaPoints.length + 2 }} 个点位
      </span>
    </div>

    <div class="mt-4 space-y-4">
      <div class="flex items-start gap-3">
        <div class="flex flex-col items-center">
          <span class="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
          <span class="mt-2 h-10 w-px bg-black/8" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[11px] text-muted">{{ startPoint.label }}</p>
          <p class="mt-1 text-[15px] font-700 text-ink">{{ startPoint.name }}</p>
          <p v-if="startPoint.note" class="mt-1 text-[12px] leading-[1.6] text-muted">{{ startPoint.note }}</p>
        </div>
      </div>

      <div v-for="(point, index) in viaPoints" :key="`${point.name}-${index}`" class="flex items-start gap-3">
        <div class="flex flex-col items-center">
          <span class="mt-1 h-3 w-3 rounded-full bg-amber-500" />
          <span class="mt-2 h-10 w-px bg-black/8" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[11px] text-muted">{{ point.label }}</p>
          <p class="mt-1 text-[15px] font-700 text-ink">{{ point.name }}</p>
          <p v-if="point.note" class="mt-1 text-[12px] leading-[1.6] text-muted">{{ point.note }}</p>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <span class="mt-1 h-3 w-3 rounded-full bg-rose-500" />
        <div class="min-w-0 flex-1">
          <p class="text-[11px] text-muted">{{ endPoint.label }}</p>
          <p class="mt-1 text-[15px] font-700 text-ink">{{ endPoint.name }}</p>
          <p v-if="endPoint.note" class="mt-1 text-[12px] leading-[1.6] text-muted">{{ endPoint.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
