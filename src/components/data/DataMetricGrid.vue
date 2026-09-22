<script setup lang="ts">
import type { DataMetricCardData, DataMetricTone } from '../../data/data'
import DataSectionCard from './DataSectionCard.vue'

withDefaults(
  defineProps<{
    items: DataMetricCardData[]
    eyebrow?: string
    title?: string
    description?: string
  }>(),
  {
    eyebrow: '统计总览',
    title: '关键结果',
    description: '',
  },
)

const toneClassMap: Record<DataMetricTone, string> = {
  brand: 'text-brand-500',
  success: 'text-ink',
  warning: 'text-ink',
  danger: 'text-danger',
  default: 'text-ink',
}
</script>

<template>
  <DataSectionCard
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
  >
    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="item in items"
        :key="item.key"
        class="min-w-0 rounded-lg border border-line bg-white px-2.5 py-3"
      >
        <p class="text-[11px] text-muted">
          {{ item.label }}
        </p>
        <div class="mt-4 flex items-end gap-1">
          <span
            class="app-metric-value text-[21px] font-700 leading-none"
            :class="toneClassMap[item.tone]"
          >
            {{ item.value }}
          </span>
          <span class="pb-0.5 text-[10px] font-600 text-muted">
            {{ item.unit }}
          </span>
        </div>
        <div class="mt-3 flex items-center justify-between gap-1 border-t border-line pt-2">
          <span v-if="item.description" class="text-[11px] text-muted">{{ item.description }}</span>
          <span class="shrink-0 text-[11px] font-700" :class="[toneClassMap[item.tone], !item.description ? 'ml-auto' : '']">
            {{ item.comparison }}
          </span>
        </div>
      </div>
    </div>
  </DataSectionCard>
</template>
