<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'

import AppShell from '../../layouts/AppShell.vue'

const props = withDefaults(
  defineProps<{
    backgroundClass?: string
    contentClass?: string
    statusBarTheme?: 'dark' | 'light'
    decorative?: boolean
    videoBackground?: boolean
  }>(),
  {
    backgroundClass: '',
    contentClass: '',
    statusBarTheme: 'light',
    decorative: true,
    videoBackground: false,
  },
)

const slots = useSlots()
const backgroundVideoUrl = `${import.meta.env.BASE_URL}media/auth-background.mp4`
const videoFailed = ref(false)
const prefersReducedMotion = ref(false)
let reducedMotionQuery: MediaQueryList | null = null

const syncReducedMotion = (event?: MediaQueryListEvent) => {
  prefersReducedMotion.value = event?.matches ?? reducedMotionQuery?.matches ?? false
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncReducedMotion()
  reducedMotionQuery.addEventListener('change', syncReducedMotion)
})

onBeforeUnmount(() => {
  reducedMotionQuery?.removeEventListener('change', syncReducedMotion)
})

const showVideo = computed(
  () => props.videoBackground && !videoFailed.value && !prefersReducedMotion.value,
)

const frameClass = computed(() =>
  [
    'auth-page-frame relative h-[844px] flex flex-col overflow-hidden',
    props.videoBackground
      ? 'auth-page-frame--video bg-[#101214] text-white'
      : 'bg-white text-ink',
    props.backgroundClass,
  ].join(' '),
)

const contentClassName = computed(() =>
  ['relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto app-scroll-area px-6 pb-10', props.contentClass].join(' '),
)
</script>

<template>
  <AppShell>
    <div :class="frameClass">
      <video
        v-if="showVideo"
        aria-hidden="true"
        autoplay
        class="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        loop
        muted
        playsinline
        preload="auto"
        tabindex="-1"
        @error="videoFailed = true"
      >
        <source :src="backgroundVideoUrl" type="video/mp4" />
      </video>

      <div v-if="videoBackground" class="pointer-events-none absolute inset-0 bg-black/42" />

      <div v-if="decorative && !videoBackground" class="pointer-events-none absolute inset-0">
        <div class="absolute inset-x-0 top-0 h-28 bg-brand-50" />
        <div class="absolute inset-x-0 top-28 h-px bg-brand-100" />
      </div>

      <div :class="contentClassName">
        <div v-if="slots.topbar" class="pt-5">
          <slot name="topbar" />
        </div>

        <div v-if="slots.header" class="pt-8">
          <slot name="header" />
        </div>

        <div class="flex-1" :class="slots.header ? 'pt-8' : 'pt-5'">
          <slot />
        </div>

        <div v-if="slots.footer" class="pt-8">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </AppShell>
</template>
