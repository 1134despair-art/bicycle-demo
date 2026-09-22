<script setup lang="ts">
defineProps<{
  title: string
  date: string
  distance: string
  duration: string
  elevation: string
  image: string
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    class="w-full overflow-hidden rounded-lg border border-line bg-white text-left transition hover:border-brand-200 focus-visible:ring-2 focus-visible:ring-brand-500"
    type="button"
    @click="emit('select')"
  >
    <div class="relative">
      <img :src="image" :alt="title" class="h-28 w-full object-cover">
      <span
        class="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-700 text-brand-700"
      >
        生成路线
      </span>
    </div>

    <div class="px-4 py-4">
      <p class="text-[12px] text-muted">{{ date }}</p>
      <h3 class="mt-1 text-[16px] font-700 text-ink">{{ title }}</h3>

      <div class="mt-3 grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-soft px-3 py-3 text-center">
          <p class="text-[10px] text-muted">距离</p>
          <p class="mt-1 text-[12px] font-700 text-ink">{{ distance }}</p>
        </div>
        <div class="rounded-lg bg-soft px-3 py-3 text-center">
          <p class="text-[10px] text-muted">时长</p>
          <p class="mt-1 text-[12px] font-700 text-ink">{{ duration }}</p>
        </div>
        <div class="rounded-lg bg-soft px-3 py-3 text-center">
          <p class="text-[10px] text-muted">爬升</p>
          <p class="mt-1 text-[12px] font-700 text-brand-700">{{ elevation }}</p>
        </div>
      </div>
    </div>
  </button>
</template>
