<script setup lang="ts">
defineProps<{
  sectionTitle?: string
  eyebrow?: string
  title?: string
  description?: string
  actionLabel?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <section class="px-4 pt-4">
    <div v-if="sectionTitle" class="app-section-heading mb-3">
      <h2 class="app-section-title">{{ sectionTitle }}</h2>
    </div>

    <div class="app-card px-4 py-4">
      <div v-if="$slots.top" class="mb-4 border-b border-black/6 pb-4">
        <slot name="top" />
      </div>

      <div
        v-if="eyebrow || title || description || actionLabel || $slots.action"
        class="mb-4 flex items-start justify-between gap-3"
      >
        <div class="min-w-0 flex-1">
          <p v-if="eyebrow" class="text-[12px] font-600 text-brand-500">
            {{ eyebrow }}
          </p>
          <h2 v-if="title" class="mt-1 text-[18px] font-700 text-ink">
            {{ title }}
          </h2>
          <p v-if="description" class="mt-1 text-[12px] leading-[1.45] text-muted">
            {{ description }}
          </p>
        </div>

        <button
          v-if="actionLabel"
          class="min-h-10 shrink-0 inline-flex cursor-pointer items-center rounded-lg border border-line bg-white px-3 text-[12px] font-600 text-ink transition hover:bg-soft"
          type="button"
          @click="emit('action')"
        >
          {{ actionLabel }}
        </button>

        <slot v-else-if="$slots.action" name="action" />
      </div>

      <slot />
    </div>
  </section>
</template>
