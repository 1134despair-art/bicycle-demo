<script setup lang="ts">
import { FileUp, History, Map } from 'lucide-vue-next'

type RouteCreateTypeKey = 'map' | 'history' | 'import'
type RouteCreateTypeIcon = 'map' | 'history' | 'file'

type RouteCreateTypeOption = {
  key: RouteCreateTypeKey
  title: string
  description: string
  icon: RouteCreateTypeIcon
}

const props = defineProps<{
  visible: boolean
  options: ReadonlyArray<RouteCreateTypeOption>
}>()

const emit = defineEmits<{
  close: []
  select: [key: RouteCreateTypeKey]
}>()

const iconMap = {
  map: Map,
  history: History,
  file: FileUp,
} as const
</script>

<template>
  <teleport to="body">
    <div
      v-if="props.visible"
      class="fixed inset-0 z-60 bg-black/24"
      @click="emit('close')"
    >
      <div class="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10" @click.stop>
        <div class="app-dialog-surface mx-auto max-w-90 rounded-2xl border border-line bg-white p-4 shadow-phone">
          <div class="mb-3 flex justify-center">
            <div class="h-1.5 w-14 rounded-full bg-#d8dde2" />
          </div>

          <div class="px-1">
            <h3 class="text-[20px] font-700 text-ink">选择创建方式</h3>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-3">
            <button
              v-for="item in props.options"
              :key="item.key"
              class="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white px-4 py-4 text-left transition hover:bg-soft active:scale-[0.985]"
              type="button"
              @click="emit('select', item.key)"
            >
              <span class="h-11 w-11 shrink-0 flex items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <component :is="iconMap[item.icon]" :size="18" :stroke-width="2.1" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="text-[15px] font-700 text-ink">{{ item.title }}</span>
              </span>
            </button>
          </div>

          <button
            class="mt-4 min-h-12 w-full cursor-pointer rounded-lg border border-line bg-white text-[14px] font-700 text-ink transition hover:bg-soft"
            type="button"
            @click="emit('close')"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
