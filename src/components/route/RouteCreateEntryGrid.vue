<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

import type { RoutePlannerEntry } from '../../data/routes'

defineProps<{ items: RoutePlannerEntry[] }>()

const emit = defineEmits<{
  select: [key: RoutePlannerEntry['key']]
}>()
</script>

<template>
  <section class="app-card px-4 py-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">创建路线</p>
        <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">路线创建入口</h3>
      </div>
      <span class="rounded-full bg-#f5f6f8 px-3 py-2 text-[11px] font-700 text-ink">
        {{ items.length }} 种方式
      </span>
    </div>

    <div class="app-list-group mt-4">
      <button
        v-for="item in items"
        :key="item.key"
        class="app-list-row w-full items-start justify-between gap-3 text-left transition hover:bg-soft"
        type="button"
        @click="emit('select', item.key)"
      >
        <div>
          <p class="text-[15px] font-700 text-ink">{{ item.title }}</p>
          <p class="mt-1 text-[12px] leading-[1.5] text-muted">{{ item.description }}</p>
        </div>
        <span class="h-9 w-9 flex items-center justify-center rounded-full bg-white text-ink">
          <ChevronRight :size="16" :stroke-width="2.2" />
        </span>
      </button>
    </div>
  </section>
</template>
