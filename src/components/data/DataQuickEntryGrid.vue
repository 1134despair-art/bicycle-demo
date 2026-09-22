<script setup lang="ts">
import { Download, History, RefreshCcw, Share2 } from 'lucide-vue-next'

import type { DataQuickEntry, DataQuickEntryIcon } from '../../data/data'
import DataSectionCard from './DataSectionCard.vue'

withDefaults(
  defineProps<{
    items: DataQuickEntry[]
    eyebrow?: string
    title?: string
    description?: string
  }>(),
  {
    eyebrow: '数据工具',
    title: '分享、导出与同步',
    description: '',
  },
)

const emit = defineEmits<{
  select: [key: string]
}>()

const iconMap: Record<DataQuickEntryIcon, typeof History> = {
  history: History,
  share: Share2,
  export: Download,
  sync: RefreshCcw,
}
</script>

<template>
  <DataSectionCard
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
  >
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="item in items"
        :key="item.key"
        class="flex cursor-pointer items-start gap-3 rounded-lg bg-white px-3 py-3 text-left outline-none ring-1 ring-line transition hover:bg-soft active:scale-[0.985] focus-visible:ring-2 focus-visible:ring-brand-500"
        type="button"
        @click="emit('select', item.key)"
      >
        <span
          class="h-11 w-11 shrink-0 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-700 ring-1 ring-brand-100"
        >
          <component :is="iconMap[item.icon]" :size="18" :stroke-width="2.1" />
        </span>

        <span class="min-w-0 flex-1">
          <span class="text-[13px] font-700 text-ink">
            {{ item.label }}
          </span>
          <span v-if="item.description" class="mt-1 block text-[12px] leading-[1.45] text-muted">
            {{ item.description }}
          </span>
        </span>
      </button>
    </div>
  </DataSectionCard>
</template>
