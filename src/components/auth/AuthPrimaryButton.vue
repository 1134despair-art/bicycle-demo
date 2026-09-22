<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    variant?: 'brand' | 'soft'
  }>(),
  {
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: true,
    variant: 'brand',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClassMap = {
  brand:
    'auth-primary-button bg-brand-500 text-white shadow-[0_8px_20px_rgba(255,127,0,0.2)] hover:bg-brand-600 focus-visible:ring-brand-500',
  soft:
    'border border-line bg-white text-ink shadow-none hover:bg-soft focus-visible:ring-brand-500',
} as const

const buttonClass = computed(() =>
  [
    'inline-flex h-13 items-center justify-center rounded-lg px-6 text-[16px] font-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-45',
    props.fullWidth ? 'w-full' : '',
    variantClassMap[props.variant],
  ].join(' '),
)
</script>

<template>
  <button :class="buttonClass" :disabled="disabled || loading" :type="type" @click="$emit('click', $event)">
    <span class="inline-flex items-center gap-2">
      <span
        v-if="loading"
        class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
      <slot />
    </span>
  </button>
</template>
