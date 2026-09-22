<script setup lang="ts">
import { ChevronLeft, Ellipsis } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    showBack?: boolean
    actionLabel?: string
    iconOnlyAction?: boolean
    statusLabel?: string
    statusTone?: 'success' | 'muted'
  }>(),
  {
    subtitle: '',
    showBack: true,
    actionLabel: '',
    iconOnlyAction: false,
    statusLabel: '',
    statusTone: 'muted',
  },
)

const emit = defineEmits<{
  back: []
  action: []
}>()
</script>

<template>
  <header class="app-page-nav border-b border-line bg-white px-4 pb-2 pt-2">
    <div class="min-h-12 flex items-center justify-between gap-3">
      <div class="min-w-0 flex flex-1 items-center gap-2">
        <button
          v-if="showBack"
          class="app-icon-button shrink-0 cursor-pointer"
          type="button"
          aria-label="返回"
          @click="emit('back')"
        >
          <ChevronLeft :size="20" :stroke-width="2.4" />
        </button>

        <div class="min-w-0 flex-1">
          <p v-if="subtitle" class="mb-0.5 text-[12px] font-600 text-brand-500">
            {{ subtitle }}
          </p>
          <h1 class="app-page-title text-[22px]">
            {{ title }}
          </h1>
        </div>
      </div>

      <button
        v-if="actionLabel"
        class="min-h-11 shrink-0 inline-flex cursor-pointer items-center justify-center rounded-lg px-3 text-[13px] font-700 text-brand-500 transition hover:bg-brand-50"
        :class="iconOnlyAction ? 'app-icon-button px-0' : ''"
        type="button"
        :aria-label="iconOnlyAction ? actionLabel : undefined"
        @click="emit('action')"
      >
        <Ellipsis
          v-if="iconOnlyAction"
          :size="18"
          :stroke-width="2.2"
        />
        <span v-else>{{ actionLabel }}</span>
      </button>

      <span
        v-else-if="statusLabel"
        class="min-h-11 shrink-0 inline-flex items-center gap-1.5 text-[12px] font-700"
        :class="statusTone === 'success' ? 'text-success' : 'text-muted'"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="statusTone === 'success' ? 'bg-success' : 'bg-muted'"
        />
        {{ statusLabel }}
      </span>
    </div>
  </header>
</template>
