<script setup lang="ts">
import { FileSpreadsheet, Route } from 'lucide-vue-next'

import type { DataActionIcon, DataActionOption } from '../../data/data'

defineProps<{
  visible: boolean
  options: DataActionOption[]
}>()

const emit = defineEmits<{
  close: []
  select: [key: string]
}>()

const iconMap: Record<DataActionIcon, typeof Route> = {
  gpx: Route,
  fit: FileSpreadsheet,
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-60 bg-black/24"
      @click="emit('close')"
    >
      <div class="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10" @click.stop>
        <div class="app-dialog-surface mx-auto max-w-90 rounded-2xl border border-line bg-white p-4 shadow-phone">
          <div class="mb-3 flex justify-center">
            <div class="h-1.5 w-14 rounded-full bg-#d8dde2" />
          </div>
          <div class="px-1">
            <h3 class="text-[20px] font-700 text-ink">导出 GPX / FIT</h3>
            <p class="mt-1 text-[12px] leading-[1.45] text-muted">支持导出 GPX 和 FIT 文件，用于轨迹保存、路线复用和第三方平台同步。</p>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <button
              v-for="item in options"
              :key="item.key"
              class="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white px-3 py-3 text-left transition hover:bg-soft active:scale-[0.985]"
              type="button"
              @click="emit('select', item.key)"
            >
              <span class="h-11 w-11 shrink-0 flex items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <component :is="iconMap[item.icon]" :size="18" :stroke-width="2.1" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="text-[13px] font-700 text-ink">{{ item.label }}</span>
                <span class="mt-1 block text-[12px] leading-[1.45] text-muted">{{ item.description }}</span>
              </span>
            </button>
          </div>

          <button
            class="mt-4 min-h-12 w-full cursor-pointer rounded-lg border border-line bg-white text-[14px] font-700 text-ink transition hover:bg-soft"
            type="button"
            @click="emit('close')"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
