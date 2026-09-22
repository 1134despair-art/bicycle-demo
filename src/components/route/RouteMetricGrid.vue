<script setup lang="ts">
defineProps<{
  distance: string
  elevation: string
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div class="app-card px-4 py-4">
      <p class="text-[11px] text-muted">距离</p>
      <p class="mt-1 text-[18px] font-700 text-ink">{{ distance }}</p>
    </div>
    <div class="app-card px-4 py-4">
      <p class="text-[11px] text-muted">爬升</p>
      <p class="mt-1 text-[18px] font-700 text-brand-700">{{ elevation }}</p>
    </div>
  </div>
</template>
