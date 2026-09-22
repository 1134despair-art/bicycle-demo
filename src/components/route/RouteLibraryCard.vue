<script setup lang="ts">
import type { SavedRouteItem } from '../../data/routes'

defineProps<{
  item: SavedRouteItem
  highlighted?: boolean
}>()

const emit = defineEmits<{
  detail: [id: string]
  push: [id: string]
}>()
</script>

<template>
  <article
    class="overflow-hidden rounded-lg border border-line bg-soft"
    :class="highlighted ? 'ring-2 ring-brand-500/45' : ''"
  >
    <img :src="item.image" :alt="item.name" class="h-32 w-full object-cover">
    <div class="px-4 py-4">
      <div class="flex items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-white px-3 py-1.5 text-[10px] font-700 tracking-[0.08em] text-brand-700">
            {{ item.source }}
          </span>
          <span class="rounded-full bg-white px-3 py-1.5 text-[10px] font-700 text-ink">
            {{ item.difficulty }}
          </span>
        </div>
        <span class="text-[12px] font-600" :class="item.isFavorite ? 'text-amber-500' : 'text-muted'">
          {{ item.isFavorite ? '已收藏' : '未收藏' }}
        </span>
      </div>

      <h4 class="mt-3 text-[17px] font-700 tracking-[-0.03em] text-ink">{{ item.name }}</h4>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-white px-3 py-3 text-center">
          <p class="text-[10px] text-muted">距离</p>
          <p class="mt-1 text-[13px] font-700 text-ink">{{ item.distance }}</p>
        </div>
        <div class="rounded-lg bg-white px-3 py-3 text-center">
          <p class="text-[10px] text-muted">爬升</p>
          <p class="mt-1 text-[13px] font-700 text-brand-700">{{ item.elevation }}</p>
        </div>
        <div class="rounded-lg bg-white px-3 py-3 text-center">
          <p class="text-[10px] text-muted">创建</p>
          <p class="mt-1 text-[13px] font-700 text-ink">{{ item.createdAt }}</p>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <button class="min-h-11 rounded-lg border border-line bg-white text-[13px] font-700 text-ink" type="button" @click="emit('detail', item.id)">
          查看路线
        </button>
        <button class="min-h-11 rounded-lg bg-brand-500 text-[13px] font-700 text-white transition hover:bg-brand-600" type="button" @click="emit('push', item.id)">
          下发到码表
        </button>
      </div>
    </div>
  </article>
</template>
