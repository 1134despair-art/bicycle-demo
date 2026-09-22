<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  detail: string
  location: string
  primaryAction: string
  secondaryAction: string
  visible: boolean
}>()

const emit = defineEmits<{
  primary: []
  secondary: []
}>()
</script>

<template>
  <section class="px-5 pb-4 pt-4">
    <div v-if="visible" class="overflow-hidden rounded-lg border border-line bg-soft">
      <div class="h-34 w-full overflow-hidden bg-#eef1ef">
        <img
          alt="首页路线规划地图预览"
          class="h-full w-full object-cover"
          src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=minimal%20mobile%20cycling%20route%20map%20preview%2C%20light%20gray%20roads%2C%20green%20park%20area%2C%20subtle%20blue%20water%2C%20route%20path%20line%2C%20clean%20fitness%20app%20map%20style&image_size=landscape_16_9"
        />
      </div>

      <div class="px-4 py-4">
        <div class="mb-3">
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">路线规划</p>
          <h2 class="mt-1 text-[18px] font-700 leading-tight text-ink">{{ title }}</h2>
          <p class="mt-1 text-[12px] text-muted">{{ subtitle }}</p>
        </div>

        <div>
          <div class="text-[15px] font-700 text-ink">{{ detail }}</div>
          <p class="mt-1 text-[12px] text-muted">{{ location }}</p>
        </div>

        <div class="mt-4 flex items-center gap-2">
          <button
            class="min-h-11 min-w-11 cursor-pointer rounded-full bg-ink px-4 text-[13px] font-700 text-white outline-none transition hover:bg-#2d3230 focus-visible:ring-2 focus-visible:ring-brand-500"
            type="button"
            @click="emit('primary')"
          >
            {{ primaryAction }}
          </button>
          <button
            class="min-h-11 min-w-11 cursor-pointer rounded-full border border-#cfd7d4 bg-white px-4 text-[13px] font-600 text-ink outline-none transition hover:bg-#f7f8f8 focus-visible:ring-2 focus-visible:ring-brand-500"
            type="button"
            @click="emit('secondary')"
          >
            {{ secondaryAction }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-lg border border-dashed border-line bg-soft px-4 py-6 text-center"
    >
      <div class="mx-auto mb-3 h-10 w-10 flex items-center justify-center rounded-full bg-white text-brand-700 shadow-card">
        <span class="i-lucide-map-off h-5 w-5" />
      </div>
      <p class="text-sm font-600 text-ink">暂无路线规划数据</p>
      <p class="mt-1 text-[12px] text-muted">导入路线或完成一次骑行后，这里会展示推荐路线和规划入口。</p>
    </div>
  </section>
</template>
