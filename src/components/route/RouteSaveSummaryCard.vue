<script setup lang="ts">
import { computed } from 'vue'

import type { SavedRouteItem } from '../../data/routes'

const props = defineProps<{
  route: SavedRouteItem
}>()

const pointCount = computed(() => props.route.viaPoints.length + 2)
</script>

<template>
  <section class="app-card px-4 py-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">路线草稿</p>
        <h2 class="mt-2 text-[18px] font-700 tracking-[-0.03em] text-ink">{{ route.name || '未命名路线' }}</h2>
      </div>
      <span class="rounded-full bg-#f5f6f8 px-3 py-2 text-[11px] font-700 text-ink">
        {{ route.source }}
      </span>
    </div>

    <p class="mt-3 text-[12px] leading-[1.7] text-muted">
      {{ route.description || '这条路线来自当前规划结果，保存后可在路线中心查看、收藏或下发到码表。' }}
    </p>

    <div class="mt-4 grid grid-cols-2 gap-3">
      <div class="rounded-lg bg-soft px-4 py-3">
        <p class="text-[10px] text-muted">距离</p>
        <p class="mt-1 text-[14px] font-700 text-ink">{{ route.distance }}</p>
      </div>
      <div class="rounded-lg bg-soft px-4 py-3">
        <p class="text-[10px] text-muted">爬升</p>
        <p class="mt-1 text-[14px] font-700 text-brand-700">{{ route.elevation }}</p>
      </div>
      <div class="rounded-lg bg-soft px-4 py-3">
        <p class="text-[10px] text-muted">难度</p>
        <p class="mt-1 text-[14px] font-700 text-ink">{{ route.difficulty }}</p>
      </div>
      <div class="rounded-lg bg-soft px-4 py-3">
        <p class="text-[10px] text-muted">点位数</p>
        <p class="mt-1 text-[14px] font-700 text-ink">{{ pointCount }}</p>
      </div>
    </div>
  </section>
</template>
