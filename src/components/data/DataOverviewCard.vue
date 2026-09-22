<script setup lang="ts">
import type { DataOverviewCardData } from '../../data/data'
import DataSectionCard from './DataSectionCard.vue'

defineProps<{
  item: DataOverviewCardData
}>()
</script>

<template>
  <DataSectionCard
    :eyebrow="item.eyebrow"
    :title="item.title"
    :description="item.description"
  >
    <div class="border-b border-line pb-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">
            {{ item.highlightLabel }}
          </p>
          <div class="mt-2 flex items-end gap-1.5">
            <span class="app-metric-value text-[30px] font-700 leading-none text-ink">
              {{ item.highlightValue }}
            </span>
            <span class="pb-1 text-[12px] font-600 text-muted">
              {{ item.highlightUnit }}
            </span>
          </div>
          <p v-if="item.summary" class="mt-2 text-[12px] leading-[1.5] text-muted">
            {{ item.summary }}
          </p>
        </div>

        <div class="shrink-0 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-right">
          <p class="text-[10px] font-600 text-muted">
            {{ item.comparisonLabel }}
          </p>
          <p class="mt-1 text-[13px] font-700 text-brand-700">
            {{ item.comparisonValue }}
          </p>
        </div>
      </div>
    </div>

      <div class="mt-3 grid grid-cols-3 gap-2">
      <div
        v-for="stat in item.stats"
        :key="stat.label"
          class="rounded-lg border border-line bg-soft px-3 py-3 text-center"
      >
        <p class="text-[11px] text-muted">
          {{ stat.label }}
        </p>
        <p class="app-metric-value mt-1 text-[18px] font-700 leading-none" :class="stat.tone ?? 'text-ink'">
          {{ stat.value }}
        </p>
      </div>
    </div>
  </DataSectionCard>
</template>
