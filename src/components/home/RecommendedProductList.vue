<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

import type { RecommendedProduct } from '../../data/home'

defineProps<{
  items: RecommendedProduct[]
}>()

const emit = defineEmits<{
  detail: [key: string]
  more: []
}>()
</script>

<template>
  <section class="px-4 pt-4">
    <div class="px-0 py-0">
      <div class="mb-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-[20px] font-700 text-ink">推荐产品</h2>
          </div>
          <button
            class="min-h-11 inline-flex shrink-0 items-center gap-1 rounded-lg px-2 text-[14px] font-600 text-brand-500 transition hover:bg-brand-50"
            type="button"
            @click.stop="emit('more')"
          >
            <span>查看全部</span>
            <ChevronRight :size="14" :stroke-width="2.2" />
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <button
          v-for="item in items.slice(0, 2)"
          :key="item.key"
          class="app-card-elevated w-full cursor-pointer overflow-hidden text-left transition hover:border-brand-200 active:scale-[0.995]"
          type="button"
          @click="emit('detail', item.key)"
        >
          <img :src="item.image" :alt="item.name" class="aspect-[16/9] w-full object-cover" />
          <div class="px-4 py-4">
            <h3 class="text-[18px] font-700 text-ink">{{ item.name }}</h3>
            <p class="mt-2 text-[13px] leading-[1.65] text-muted">
              {{ item.specs }}<span v-if="item.description">，{{ item.description }}</span>
            </p>
            <div class="mt-4 flex justify-end">
              <span class="inline-flex items-center gap-1 text-[13px] font-700 text-brand-500">
                立即了解
                <ChevronRight :size="14" :stroke-width="2.2" />
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
