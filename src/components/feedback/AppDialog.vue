<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  title: string
  description?: string
  cancelLabel?: string
  confirmLabel?: string
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="app-dialog-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/36 px-4 pt-20 backdrop-blur-[2px] md:items-center"
    >
      <div class="app-dialog-surface app-sheet w-full max-w-88 border border-line p-5">
        <h3 class="text-[18px] font-700 text-ink">{{ props.title }}</h3>
        <p v-if="props.description" class="mt-2 text-[13px] leading-[1.7] text-muted">{{ props.description }}</p>
        <div class="grid grid-cols-2 gap-3" :class="props.description ? 'mt-5' : 'mt-4'">
          <button
            class="min-h-11 rounded-lg border border-line bg-white text-[14px] font-600 text-ink transition hover:bg-soft"
            type="button"
            @click="emit('cancel')"
          >
            {{ props.cancelLabel ?? '取消' }}
          </button>
          <button
            class="app-primary-button min-h-11 rounded-lg text-[14px]"
            type="button"
            @click="emit('confirm')"
          >
            {{ props.confirmLabel ?? '确认' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
