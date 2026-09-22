<script setup lang="ts">
import type { SavedRouteItem } from '../../data/routes'

defineProps<{
  route: SavedRouteItem
}>()
</script>

<template>
  <div class="relative overflow-hidden rounded-[6px] border border-line bg-white">
    <img :src="route.image" :alt="route.name" class="h-[260px] w-full object-cover">
  </div>
</template>
