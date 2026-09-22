<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg'
    tone?: 'default' | 'soft' | 'emphasis'
  }>(),
  {
    padding: 'md',
    tone: 'default',
  },
)

const paddingClassMap = {
  none: '',
  sm: 'px-4 py-4',
  md: 'px-5 py-5',
  lg: 'px-6 py-6',
} as const

const toneClassMap = {
  default: 'border-line bg-white text-ink shadow-card',
  soft: 'border-line bg-soft text-ink shadow-none',
  emphasis: 'border-brand-100 bg-brand-50 text-ink shadow-none',
} as const

const cardClass = computed(() =>
  [
    'rounded-lg border',
    paddingClassMap[props.padding],
    toneClassMap[props.tone],
  ].join(' '),
)
</script>

<template>
  <section :class="cardClass">
    <slot />
  </section>
</template>
