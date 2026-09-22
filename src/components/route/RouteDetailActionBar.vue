<script setup lang="ts">
defineProps<{
  pushDisabled?: boolean
}>()

const emit = defineEmits<{
  remove: []
  push: []
}>()
</script>

<template>
  <div class="grid grid-cols-[1fr_1.35fr] gap-3">
    <button
      class="min-h-12 rounded-lg border border-line bg-white text-[15px] font-700 text-ink outline-none transition hover:bg-#f5f6f8 focus-visible:ring-2 focus-visible:ring-brand-500"
      type="button"
      @click="emit('remove')"
    >
      删除路线
    </button>
    <button
      class="min-h-12 rounded-lg bg-brand-500 text-[15px] font-700 text-white outline-none transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-45"
      :disabled="pushDisabled"
      type="button"
      @click="emit('push')"
    >
      下发到码表
    </button>
  </div>
</template>
