<script setup lang="ts">
import type { SavedRouteItem } from '../../data/routes'
import RouteLibraryCard from './RouteLibraryCard.vue'

defineProps<{
  items: SavedRouteItem[]
  highlightedId?: string
}>()

const emit = defineEmits<{
  detail: [id: string]
  push: [id: string]
}>()
</script>

<template>
  <section class="app-card px-4 py-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">我的路线</p>
        <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">路线列表与详情</h3>
      </div>
      <span class="rounded-full bg-#f5f6f8 px-3 py-2 text-[11px] font-700 text-ink">
        {{ items.length }} 条
      </span>
    </div>

    <div class="mt-4 space-y-3">
      <RouteLibraryCard
        v-for="item in items"
        :key="item.id"
        :highlighted="highlightedId === item.id"
        :item="item"
        @detail="emit('detail', $event)"
        @push="emit('push', $event)"
      />
    </div>
  </section>
</template>
