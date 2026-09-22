<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    theme?: 'dark' | 'light'
    time?: string
    networkLabel?: string
    batteryLabel?: string
  }>(),
  {
    theme: 'light',
    time: '11:19',
    networkLabel: '5G',
    batteryLabel: '100',
  },
)

const textClass = computed(() => (props.theme === 'dark' ? 'text-white' : 'text-ink'))
const mutedSignalClass = computed(() => (props.theme === 'dark' ? 'bg-white' : 'bg-ink/82'))
const batteryClass = computed(() =>
  props.theme === 'dark'
    ? 'bg-#2dc86f text-white'
    : 'bg-success/16 text-success ring-1 ring-success/12',
)
</script>

<template>
  <div class="ios-status-bar pointer-events-none relative z-30 box-content h-6 shrink-0 px-6 pb-2">
    <div class="flex items-center justify-between" :class="textClass">
      <span class="text-[17px] font-700">{{ time }}</span>

      <div class="flex items-center gap-1.5">
        <div class="flex items-end gap-[2px]">
          <span class="h-[6px] w-[3px] rounded-full" :class="mutedSignalClass" />
          <span class="h-[8px] w-[3px] rounded-full" :class="mutedSignalClass" />
          <span class="h-[10px] w-[3px] rounded-full" :class="mutedSignalClass" />
          <span class="h-[12px] w-[3px] rounded-full" :class="mutedSignalClass" />
        </div>
        <span class="text-[15px] font-700">{{ networkLabel }}</span>
        <div class="rounded-[8px] px-1.5 py-[1px] text-[11px] font-700" :class="batteryClass">
          {{ batteryLabel }}
        </div>
      </div>
    </div>
  </div>
</template>
