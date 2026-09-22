<script setup lang="ts">
defineProps<{
  visible: boolean
  routeName: string
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
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/32 px-4 pb-8 pt-20 md:items-center"
    >
      <div class="app-dialog-surface w-full max-w-88 rounded-2xl border border-line bg-white px-5 py-5 shadow-phone">
        <h3 class="text-[18px] font-700 text-ink">删除路线</h3>
        <p class="mt-2 text-[14px] leading-[1.7] text-muted">
          确认删除 {{ routeName }}？删除后不可恢复。
        </p>

        <div class="mt-5 grid grid-cols-2 gap-3">
          <button
            class="min-h-11 rounded-lg border border-line bg-white text-[14px] font-700 text-ink transition hover:bg-soft"
            type="button"
            @click="emit('cancel')"
          >
            取消
          </button>
          <button
            class="min-h-11 rounded-lg bg-danger text-[14px] font-700 text-white transition hover:bg-rose-600"
            type="button"
            @click="emit('confirm')"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
