<script setup lang="ts">
defineProps<{
  total: number
  pushable: number
  plannerCount: number
  deviceOnline: boolean
}>()
</script>

<template>
  <section class="app-card px-4 py-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">路线中心</p>
        <h2 class="mt-1 text-[22px] font-700 tracking-[-0.04em] text-ink">路线规划与管理</h2>
      </div>
      <span
        class="rounded-full px-3 py-2 text-[11px] font-700"
        :class="deviceOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'"
      >
        {{ deviceOnline ? '码表在线' : '码表离线' }}
      </span>
    </div>

    <div class="mt-4 grid grid-cols-3 gap-2">
      <div class="rounded-lg bg-soft px-3 py-3 text-center">
        <p class="text-[10px] text-muted">已保存</p>
        <p class="mt-1 text-[16px] font-700 text-ink">{{ total }}</p>
      </div>
      <div class="rounded-lg bg-soft px-3 py-3 text-center">
        <p class="text-[10px] text-muted">可下发</p>
        <p class="mt-1 text-[16px] font-700 text-brand-700">{{ pushable }}</p>
      </div>
      <div class="rounded-lg bg-soft px-3 py-3 text-center">
        <p class="text-[10px] text-muted">创建方式</p>
        <p class="mt-1 text-[16px] font-700 text-ink">{{ plannerCount }}</p>
      </div>
    </div>
  </section>
</template>
