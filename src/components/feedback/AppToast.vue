<script setup lang="ts">
defineProps<{
  visible: boolean
  message: string
}>()
</script>

<template>
  <transition name="fade-slide">
    <div
      v-if="visible"
      class="pointer-events-none fixed inset-x-4 top-[calc(env(safe-area-inset-top,0px)+16px)] z-[120] flex justify-center"
      role="status"
      aria-live="polite"
    >
      <div
        class="max-w-[440px] rounded-lg bg-ink/94 px-4 py-3 text-center text-[13px] leading-[1.6] text-white shadow-[0_12px_28px_rgba(29,29,31,0.18)]"
      >
        {{ message }}
      </div>
    </div>
  </transition>
</template>
