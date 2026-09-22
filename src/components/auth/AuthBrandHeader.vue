<script setup lang="ts">
withDefaults(
  defineProps<{
    badge?: string
    eyebrow?: string
    title: string
    subtitle?: string
    align?: 'left' | 'center'
  }>(),
  {
    badge: '',
    eyebrow: '',
    subtitle: '',
    align: 'left',
  },
)
</script>

<template>
  <div class="space-y-3.5" :class="align === 'center' ? 'text-center' : 'text-left'">
    <div
      v-if="badge || $slots.badge"
      class="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[12px] font-600 text-brand-700"
      :class="align === 'center' ? 'mx-auto' : ''"
    >
      <slot name="badge">
        {{ badge }}
      </slot>
    </div>

    <div class="space-y-2.5">
      <p v-if="eyebrow" class="text-[12px] font-700 text-brand-500">
        {{ eyebrow }}
      </p>
      <h1 class="text-[28px] font-700 leading-[1.2] text-ink">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="max-w-80 text-[14px] leading-[1.72] text-muted" :class="align === 'center' ? 'mx-auto' : ''">
        {{ subtitle }}
      </p>
    </div>

    <div v-if="$slots.visual" class="pt-2">
      <slot name="visual" />
    </div>
  </div>
</template>
