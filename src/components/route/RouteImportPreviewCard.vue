<script setup lang="ts">
import type { RouteImportPreview } from '../../data/routes'

defineProps<{
  preview: RouteImportPreview
}>()
</script>

<template>
  <div class="app-card overflow-hidden">
    <img :src="preview.image" :alt="preview.fileName" class="h-32 w-full object-cover">

    <div class="px-4 py-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-[11px] text-muted">{{ preview.format }} 文件</p>
          <h3 class="mt-1 text-[15px] font-700 text-ink">{{ preview.fileName }}</h3>
        </div>
        <span class="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-700 text-emerald-600">
          导入成功
        </span>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <div class="rounded-lg bg-soft px-3 py-3 text-center">
          <p class="text-[10px] text-muted">距离</p>
          <p class="mt-1 text-[12px] font-700 text-ink">{{ preview.distance }}</p>
        </div>
        <div class="rounded-lg bg-soft px-3 py-3 text-center">
          <p class="text-[10px] text-muted">爬升</p>
          <p class="mt-1 text-[12px] font-700 text-brand-700">{{ preview.elevation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
