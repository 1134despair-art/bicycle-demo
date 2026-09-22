<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'

defineProps<{
  accentClass: string
  title: string
  subtitle: string
  notice: string
}>()
</script>

<template>
  <div class="space-y-6 pt-12 text-center">
      <div
        class="third-party-brand-mark mx-auto flex h-18 w-18 shrink-0 items-center justify-center rounded-full text-white shadow-card"
        :class="accentClass"
      >
        <slot name="badge" />
      </div>

      <div class="space-y-2">
        <p class="text-[26px] font-700 text-ink">{{ title }}</p>
        <p class="mx-auto max-w-70 text-[14px] leading-[1.8] text-muted">{{ subtitle }}</p>
      </div>

      <div class="rounded-lg border border-line bg-soft px-5 py-5">
        <div class="flex items-start gap-3 text-left">
          <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
            <ShieldCheck :size="16" :stroke-width="2.1" />
          </div>
          <p class="text-[13px] leading-[1.7] text-muted">{{ notice }}</p>
        </div>
      </div>

      <slot name="action" />
    </div>
</template>
