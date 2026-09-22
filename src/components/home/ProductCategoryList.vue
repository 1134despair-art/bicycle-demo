<script setup lang="ts">
import type { ProductCategory } from '../../data/home'

defineProps<{
  items: ProductCategory[]
}>()

const emit = defineEmits<{
  select: [key: string]
}>()
</script>

<template>
  <section class="mt-4 border-y border-line bg-white px-4 py-4">
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="item in items"
          :key="item.key"
          class="flex flex-col items-center gap-2 text-center outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
          @click="emit('select', item.key)"
        >
          <div class="app-media aspect-square w-full max-w-16 border border-line">
            <img
              :src="item.image"
              :alt="`${item.label} ${item.sublabel}`"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="leading-tight">
            <p class="text-[12px] font-800 text-brand-500">{{ item.label }}</p>
            <p class="mt-1 text-[11px] font-600 text-muted">{{ item.sublabel }}</p>
          </div>
        </button>
      </div>
  </section>
</template>
