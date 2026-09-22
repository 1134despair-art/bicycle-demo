<script setup lang="ts">
defineProps<{
  saveDisabled?: boolean
}>()

const emit = defineEmits<{
  save: []
  reset: []
}>()
</script>

<template>
  <div class="sticky bottom-0 z-10 mt-6 grid grid-cols-[1fr_1.3fr] gap-3 bg-[linear-gradient(180deg,rgba(245,247,250,0),rgba(245,247,250,0.92)_26%,rgba(245,247,250,1)_100%)] px-4 pb-4 pt-5">
    <button
      class="min-h-12 rounded-lg border border-line bg-white text-[15px] font-700 text-ink"
      type="button"
      @click="emit('reset')"
    >
      重新规划
    </button>
    <button
      class="min-h-12 rounded-lg bg-brand-500 text-[15px] font-700 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-45"
      :disabled="saveDisabled"
      type="button"
      @click="emit('save')"
    >
      保存路线
    </button>
  </div>
</template>
