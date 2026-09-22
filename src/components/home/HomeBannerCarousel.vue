<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import type { HomeBanner } from '../../data/home'

const props = defineProps<{
  items: HomeBanner[]
}>()

const currentIndex = ref(0)
let timer: number | undefined

const startRotation = () => {
  if (props.items.length <= 1) return

  timer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.items.length
  }, 3200)
}

onMounted(() => {
  startRotation()
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <section class="px-4 pt-3">
    <div class="app-card-elevated relative overflow-hidden">
      <div class="relative h-54">
        <div
          v-for="(item, index) in items"
          :key="item.key"
          class="absolute inset-0 transition-opacity duration-500"
          :class="index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        >
          <img :src="item.image" :alt="item.title" class="h-full w-full object-cover" />
          <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,10,0.02),rgba(7,10,10,0.12)_38%,rgba(7,10,10,0.64)_100%)]" />
          <div class="absolute inset-x-0 bottom-0 px-5 pb-6">
            <p class="text-[11px] font-600 text-white/72">BLUEPRINT CYCLING</p>
            <p class="mt-2 text-[27px] font-800 leading-none text-white">{{ item.title }}</p>
            <p class="mt-2 text-[13px] font-600 text-white/84">{{ item.subtitle }}</p>
          </div>
        </div>
      </div>

      <div class="absolute right-4 top-4 flex items-center justify-center gap-1.5">
        <span
          v-for="(item, index) in items"
          :key="`${item.key}-dot`"
          class="h-1.5 rounded-full bg-white transition-all duration-300"
          :class="index === currentIndex ? 'w-5 opacity-100' : 'w-1.5 opacity-55'"
        />
      </div>
    </div>
  </section>
</template>
