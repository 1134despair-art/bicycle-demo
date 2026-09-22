<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'

defineProps<{
  visible: boolean
  title: string
  description?: string
  options: Array<{
    key: string
    label: string
    description?: string
  }>
  selectedKey?: string
}>()

const emit = defineEmits<{
  close: []
  select: [key: string]
}>()
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/36 px-4 pb-6 pt-20 backdrop-blur-[2px] md:items-center"
      @click.self="emit('close')"
    >
      <div class="app-dialog-surface app-sheet w-full max-w-92 border border-line p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-[18px] font-700 text-ink">{{ title }}</h3>
            <p v-if="description" class="mt-2 text-[13px] leading-[1.7] text-muted">{{ description }}</p>
          </div>
          <button
            class="app-icon-button h-10 w-10 shrink-0"
            type="button"
            aria-label="关闭"
            @click="emit('close')"
          >
            <X :size="18" :stroke-width="2.2" />
          </button>
        </div>

        <div class="app-list-group mt-4">
          <button
            v-for="item in options"
            :key="item.key"
            class="app-list-row w-full gap-3 text-left transition hover:bg-soft"
            :class="selectedKey === item.key ? 'bg-brand-50' : 'bg-white'"
            type="button"
            @click="emit('select', item.key)"
          >
            <span class="h-5 w-5 shrink-0 flex items-center justify-center rounded-full border-2 transition" :class="selectedKey === item.key ? 'border-brand-500 bg-brand-500 text-white' : 'border-[#B9BEC4]'">
              <Check v-if="selectedKey === item.key" :size="12" :stroke-width="3" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-[14px] font-700 text-ink">{{ item.label }}</p>
              <p v-if="item.description" class="mt-1 text-[12px] leading-[1.6] text-muted">{{ item.description }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
