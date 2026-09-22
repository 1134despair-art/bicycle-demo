<script setup lang="ts">
import { CalendarDays, Check, X } from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import type { DataWeekOption } from '../../data/data'

const props = defineProps<{
  visible: boolean
  selectedKey: string
  options: DataWeekOption[]
}>()

const emit = defineEmits<{
  close: []
  confirm: [key: string]
}>()

const draftKey = ref(props.selectedKey)

const displayOptions = computed(() => {
  const available = props.options.filter((item) => !item.disabled).sort((a, b) => b.week - a.week)
  const future = props.options.filter((item) => item.disabled).sort((a, b) => a.week - b.week)
  return [...available, ...future]
})

const draftOption = computed(() => props.options.find((item) => item.key === draftKey.value))
const canConfirm = computed(() => Boolean(draftOption.value && !draftOption.value.disabled))

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.visible) {
    emit('close')
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      draftKey.value = props.selectedKey
      window.addEventListener('keydown', handleEscape)
      return
    }

    window.removeEventListener('keydown', handleEscape)
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})

const handleConfirm = () => {
  if (!canConfirm.value) {
    return
  }

  emit('confirm', draftKey.value)
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-70 bg-black/32"
      role="presentation"
      @click="emit('close')"
    >
      <section
        class="data-week-picker-sheet absolute inset-x-0 bottom-0 mx-auto w-full rounded-t-2xl border border-b-0 border-line bg-white shadow-float"
        role="dialog"
        aria-modal="true"
        aria-labelledby="week-picker-title"
        @click.stop
      >
        <div class="flex items-center justify-between border-b border-line px-4 py-3">
          <div class="min-w-0">
            <h3 id="week-picker-title" class="text-[18px] font-700 text-ink">选择 ISO 周次</h3>
          </div>
          <button
            class="h-11 w-11 flex shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-soft hover:text-ink"
            type="button"
            aria-label="关闭周次选择"
            @click="emit('close')"
          >
            <X :size="20" :stroke-width="2.1" />
          </button>
        </div>

        <div class="max-h-[50vh] overflow-y-auto px-4 py-3 app-scroll-area">
          <div class="app-list-group overflow-hidden">
            <button
              v-for="item in displayOptions"
              :key="item.key"
              class="min-h-15 w-full flex items-center gap-3 border-b border-line px-3 py-2.5 text-left last:border-b-0"
              :class="[
                item.disabled
                  ? 'cursor-not-allowed bg-soft/60 text-muted opacity-55'
                  : 'cursor-pointer bg-white transition hover:bg-soft',
                draftKey === item.key && !item.disabled ? 'bg-brand-50' : '',
              ]"
              type="button"
              :disabled="item.disabled"
              :aria-pressed="draftKey === item.key"
              @click="draftKey = item.key"
            >
              <span
                class="h-10 w-10 flex shrink-0 items-center justify-center rounded-md"
                :class="draftKey === item.key && !item.disabled ? 'bg-brand-500 text-white' : 'bg-soft text-muted'"
              >
                <CalendarDays :size="18" :stroke-width="2.1" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-[14px] font-700" :class="item.disabled ? 'text-muted' : 'text-ink'">
                  {{ item.year }}年第{{ item.week }}周
                </span>
                <span class="mt-0.5 block text-[11px] tabular-nums text-muted">
                  {{ item.startDate }}-{{ item.endDate }}
                  <span v-if="item.disabled"> · 尚未开始</span>
                  <span v-else-if="item.hasData" class="text-success"> · 有骑行数据</span>
                  <span v-else> · 暂无数据</span>
                </span>
              </span>
              <span
                class="h-6 w-6 flex shrink-0 items-center justify-center rounded-full border"
                :class="draftKey === item.key && !item.disabled ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-white text-transparent'"
              >
                <Check :size="14" :stroke-width="2.5" />
              </span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 border-t border-line bg-white px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3">
          <button
            class="min-h-12 cursor-pointer rounded-lg border border-line bg-white text-[14px] font-700 text-ink transition hover:bg-soft"
            type="button"
            @click="emit('close')"
          >
            取消
          </button>
          <button
            class="app-primary-button min-h-12 cursor-pointer text-[14px] font-700 disabled:cursor-not-allowed disabled:opacity-45"
            type="button"
            :disabled="!canConfirm"
            @click="handleConfirm"
          >
            确认
          </button>
        </div>
      </section>
    </div>
  </teleport>
</template>

<style scoped>
.data-week-picker-sheet {
  max-width: 394px;
}

@media (max-width: 639px) {
  .data-week-picker-sheet {
    max-width: none;
  }
}
</style>
