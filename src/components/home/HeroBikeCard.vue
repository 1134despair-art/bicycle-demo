<script setup lang="ts">
import { BatteryMedium, ChevronRight, Radio } from 'lucide-vue-next'

const bikeImage =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20road%20bicycle%20product%20photo%2C%20side%20view%2C%20carbon%20frame%2C%20clean%20white%20background%2C%20realistic%20studio%20lighting%2C%20minimal%20shadow%2C%20high-end%20cycling%20brand%20aesthetic&image_size=landscape_4_3'

defineProps<{
  bikeName: string
  bikeModel: string
  connectState: string
  battery: string
  heroLabel: string
}>()
</script>

<template>
  <section class="px-5 pt-2">
    <div class="app-card-elevated overflow-hidden px-4 py-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-[0.12em] text-muted">{{ heroLabel }}</p>
          <h2 class="mt-1 truncate text-[16px] font-700 leading-tight tracking-[-0.03em] text-ink">
            {{ bikeName }}
          </h2>
          <p class="mt-1 text-[12px] text-muted">{{ bikeModel }}</p>
        </div>

        <button class="inline-flex shrink-0 items-center gap-1 rounded-full bg-soft px-3 py-2 text-[10px] font-600 text-ink">
          车辆详情
          <ChevronRight :size="13" :stroke-width="2.2" />
        </button>
      </div>

      <div class="mt-4 rounded-lg bg-soft px-3 py-4">
        <img
          :src="bikeImage"
          alt="当前自行车"
          class="h-42 w-full object-contain"
        />
      </div>

      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-[10px] font-600 text-brand-800">
            <Radio :size="12" :stroke-width="2.1" />
            {{ connectState }}
          </span>
          <span class="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-[10px] font-600 text-ink">
            <BatteryMedium :size="12" :stroke-width="2.1" />
            外设 {{ battery }}
          </span>
        </div>
        <p class="text-[11px] text-muted">外设信息见下方设备状态</p>
      </div>
    </div>
  </section>
</template>
