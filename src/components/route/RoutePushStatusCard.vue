<script setup lang="ts">
defineProps<{ deviceOnline: boolean }>()
</script>

<template>
  <section class="app-card px-4 py-4">
    <p class="text-[11px] uppercase tracking-[0.12em] text-muted">下发说明</p>
    <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">路线推送到码表</h3>
    <p class="mt-2 text-[13px] leading-[1.6] text-muted">
      {{
        deviceOnline
          ? '当前已连接码表在线，可直接从列表页或详情页下发路线。'
          : '路线下发需要码表在线，请先在设备页完成连接。'
      }}
    </p>
  </section>
</template>
