<script setup lang="ts">
import { BatteryMedium, BluetoothConnected, Cpu, Link2 } from 'lucide-vue-next'

defineProps<{
  items: Array<{
    key: string
    title: string
    value: string
    icon: string
    description?: string
    details?: Array<{ label: string; value: string; tone: string }>
  }>
}>()

const emit = defineEmits<{
  action: []
}>()

const iconMap = {
  connect: BluetoothConnected,
  battery: BatteryMedium,
  devices: Cpu,
}
</script>

<template>
  <section class="px-4 pt-4">
    <div class="app-card px-4 py-4">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">设备状态</p>
          <h2 class="mt-1 text-[17px] font-700 tracking-[-0.02em] text-ink">外设连接</h2>
        </div>

        <button
          class="min-h-11 min-w-11 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-700 text-white outline-none transition hover:bg-#2a312f active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
          @click="emit('action')"
        >
          <Link2 :size="15" :stroke-width="2.2" />
          快捷连接
        </button>
      </div>

      <div class="rounded-lg bg-soft px-4 py-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] uppercase tracking-[0.12em] text-muted">{{ items[0].title }}</p>
            <h3 class="mt-2 text-[24px] font-700 leading-none tracking-[-0.04em] text-success">{{ items[0].value }}</h3>
            <p v-if="items[0].description" class="mt-2 text-[12px] leading-[1.45] text-muted">{{ items[0].description }}</p>
          </div>
          <span class="h-11 w-11 flex shrink-0 items-center justify-center rounded-full bg-white text-success ring-1 ring-line">
            <component :is="iconMap[items[0].icon as keyof typeof iconMap]" :size="18" :stroke-width="2.2" />
          </span>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-2 gap-3">
        <div
          v-for="item in items.slice(1)"
          :key="item.key"
          class="rounded-lg bg-soft px-3 py-3"
        >
          <div class="mb-5 flex items-start justify-between">
            <div class="text-[11px] text-muted">{{ item.title }}</div>
            <span class="h-9 w-9 flex items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_16px_rgba(31,35,34,0.06)]">
              <component :is="iconMap[item.icon as keyof typeof iconMap]" :size="16" :stroke-width="2.1" />
            </span>
          </div>
          <div class="font-700 tracking-[-0.03em] text-ink" :class="[item.key === 'battery' ? 'text-[15px] leading-tight' : '', item.key === 'devices' ? 'text-[14px] leading-tight' : '']">
            {{ item.value }}
          </div>
          <div v-if="item.details?.length" class="mt-3 space-y-2">
            <div
              v-for="detail in item.details"
              :key="`${item.key}-${detail.label}`"
              class="flex items-center justify-between border-t border-line bg-white px-2.5 py-2 text-[11px]"
            >
              <span class="flex items-center gap-1.5 text-muted">
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="[
                    detail.tone === 'danger' ? 'bg-danger' : '',
                    detail.tone === 'success' ? 'bg-success' : '',
                    detail.tone === 'muted' ? 'bg-#b9c0c7' : '',
                    detail.tone === 'normal' ? 'bg-brand-700/70' : '',
                  ]"
                />
                {{ detail.label }}
              </span>
              <span
                class="font-700"
                :class="[
                  detail.tone === 'danger' ? 'text-danger' : '',
                  detail.tone === 'success' ? 'text-success' : '',
                  detail.tone === 'muted' ? 'text-muted' : '',
                  detail.tone === 'normal' ? 'text-ink' : '',
                ]"
              >
                {{ detail.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
