<script setup lang="ts">
import { Bike, ChevronRight } from 'lucide-vue-next'

defineProps<{
  summary: {
    title: string
    date: string
    routeName: string
    distance: string
    duration: string
    avgSpeed: string
    totalMileage: string
    totalDuration: string
    totalRides: string
    emptyTitle: string
    emptyDescription: string
  }
  empty?: boolean
}>()

const emit = defineEmits<{
  detail: []
}>()
</script>

<template>
  <section class="px-4 pt-4">
    <div class="app-card overflow-hidden px-4 py-4 text-ink">
      <button
        v-if="!empty"
        class="w-full cursor-pointer rounded-lg bg-soft px-3 py-3 text-left outline-none transition hover:bg-#eef0f5 active:scale-[0.995] focus-visible:ring-2 focus-visible:ring-brand-500"
        type="button"
        @click="emit('detail')"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[11px] uppercase tracking-[0.12em] text-muted">{{ summary.title }}</p>
            <p class="mt-1 text-[12px] font-600 text-brand-700">最近骑行</p>
            <h2 class="mt-1 text-[17px] font-700 leading-tight tracking-[-0.02em] text-ink">
              {{ summary.routeName }}
            </h2>
            <p class="mt-1 text-[12px] text-muted">{{ summary.date }}</p>
          </div>

          <span class="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-muted shadow-[0_8px_14px_rgba(34,40,38,0.04)]">
            <ChevronRight :size="16" :stroke-width="2.2" />
          </span>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-2">
          <div class="bg-white px-3 py-3 text-center">
            <p class="text-[11px] text-muted">距离</p>
            <p class="mt-1 text-[20px] font-700 leading-none tracking-[-0.03em] text-ink">{{ summary.distance }}</p>
          </div>
          <div class="border-l border-line bg-white px-3 py-3 text-center">
            <p class="text-[11px] text-muted">均速</p>
            <p class="mt-1 text-[20px] font-700 leading-none tracking-[-0.03em] text-ink">{{ summary.avgSpeed }}</p>
          </div>
        </div>
      </button>

      <div class="rounded-lg bg-soft px-4 py-5" v-else>
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">{{ summary.title }}</p>
        <p class="mt-1 text-[12px] font-600 text-brand-700">最近骑行</p>
        <h2 class="mt-1 text-[17px] font-700 leading-tight tracking-[-0.02em] text-ink">
          {{ summary.emptyTitle }}
        </h2>
        <div class="flex items-center gap-3">
          <span class="h-11 w-11 flex items-center justify-center rounded-full bg-white text-brand-700 shadow-[0_8px_14px_rgba(34,40,38,0.05)]">
            <Bike :size="18" :stroke-width="2.1" />
          </span>
          <div>
            <p class="text-[13px] font-700 text-ink">完成首次骑行后生成记录</p>
          </div>
        </div>
      </div>

      <div class="mt-4 border-t border-line pt-4">
        <div class="mb-3 flex items-center justify-between">
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">骑行数据概览</p>
          <p class="text-[12px] text-muted">累计</p>
        </div>
        <div class="grid grid-cols-3 gap-2">
        <div>
          <p class="text-[11px] text-muted">累计总里程</p>
          <p class="mt-1 text-[16px] font-700 tracking-[-0.02em] text-ink">{{ summary.totalMileage }}</p>
        </div>
        <div>
          <p class="text-[11px] text-muted">累计总时长</p>
          <p class="mt-1 text-[16px] font-700 tracking-[-0.02em] text-ink">{{ summary.totalDuration }}</p>
        </div>
        <div>
          <p class="text-[11px] text-muted">累计骑行</p>
          <p class="mt-1 text-[16px] font-700 tracking-[-0.02em] text-ink">{{ summary.totalRides }}</p>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>
