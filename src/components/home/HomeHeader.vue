<script setup lang="ts">
import { BellDot, ChevronDown, Gauge, Radio } from 'lucide-vue-next'

defineProps<{
  brand: string
  subtitle: string
  stats: Array<{ label: string; value: string; tone: string }>
}>()
</script>

<template>
  <header class="px-5 pt-2">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-1 text-[20px] font-700 tracking-[-0.03em] text-ink">
          <span>{{ brand }}</span>
          <ChevronDown :size="16" class="text-muted" :stroke-width="2.1" />
        </div>
        <p class="mt-1 text-[12px] text-muted">{{ subtitle }}</p>
      </div>

      <button
        class="relative h-11 w-11 flex items-center justify-center rounded-full bg-white/78 text-ink shadow-[0_8px_18px_rgba(34,40,38,0.06)] outline-none backdrop-blur-md transition hover:bg-white/88 focus-visible:ring-2 focus-visible:ring-brand-500"
        type="button"
      >
        <BellDot :size="19" :stroke-width="2.1" />
        <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
      </button>
    </div>

    <div class="flex gap-2 text-[11px] text-muted">
      <div
        v-for="item in stats"
        :key="item.label"
        class="inline-flex items-center gap-1.5 rounded-full bg-white/74 px-3 py-1.5 shadow-[0_8px_18px_rgba(34,40,38,0.05)] backdrop-blur-md"
      >
        <Gauge v-if="item.label.includes('电量')" :size="14" class="text-ink" :stroke-width="2" />
        <Radio v-else :size="14" class="text-brand-700" :stroke-width="2" />
        <span class="font-600 text-ink">{{ item.value }}</span>
      </div>
    </div>
  </header>
</template>
