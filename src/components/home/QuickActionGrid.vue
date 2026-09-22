<script setup lang="ts">
import { Play, Route, SlidersHorizontal } from 'lucide-vue-next'
import type { QuickAction } from '../../data/home'

defineProps<{
  actions: QuickAction[]
}>()

const emit = defineEmits<{
  action: [key: string]
}>()

const iconMap = {
  startRide: Play,
  deviceDebug: SlidersHorizontal,
  routePlan: Route,
}
</script>

<template>
  <section class="px-4 pt-4">
    <div class="app-card px-4 py-4">
      <div class="mb-4">
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">快捷操作</p>
        <h2 class="mt-1 text-[17px] font-700 tracking-[-0.02em] text-ink">骑行快捷操作</h2>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="action in actions"
          :key="action.key"
          class="group min-h-25 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg bg-soft px-2 text-center outline-none transition duration-180 hover:bg-#eef0f5 active:translate-y-[1px] active:bg-#eceef2 focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
          @click="emit('action', action.key)"
        >
          <span
            class="h-11 w-11 flex items-center justify-center rounded-full bg-white text-ink shadow-[0_8px_16px_rgba(31,35,34,0.08)] transition duration-180 group-hover:bg-#fbfbfc group-active:shadow-[0_4px_10px_rgba(31,35,34,0.06)]"
          >
            <component :is="iconMap[action.icon]" :size="20" :stroke-width="2.1" />
          </span>
          <span class="text-[13px] font-600 leading-[1.2] text-ink transition duration-180 group-active:opacity-90">
            {{ action.label }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
