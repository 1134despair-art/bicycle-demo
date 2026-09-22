<script setup lang="ts">
defineProps<{
  imported?: boolean
  fileName?: string
}>()

const emit = defineEmits<{
  choose: []
}>()
</script>

<template>
  <div class="rounded-lg border border-dashed border-line bg-white px-4 py-6 text-center">
    <p class="text-[12px] font-700 text-ink">支持 GPX / FIT 导入</p>
    <p class="mt-2 text-[12px] leading-[1.7] text-muted">
      导入后可继续保存并下发到已连接码表
    </p>

    <div class="mt-4 rounded-lg bg-soft px-4 py-3.5 text-left">
      <p class="text-[11px] uppercase tracking-[0.08em] text-muted">导入状态</p>
      <p class="mt-1 text-[13px] font-700 text-ink">
        {{ imported ? '已识别路线文件' : '尚未选择文件' }}
      </p>
      <p class="mt-1 text-[12px] leading-[1.7] text-muted">
        {{ imported ? fileName || '已导入文件' : '支持从本地文件中导入现有路书，当前为演示导入流程。' }}
      </p>
    </div>

    <button
      class="mt-5 min-h-11 rounded-lg bg-brand-500 px-5 text-[13px] font-700 text-white transition hover:bg-brand-600"
      type="button"
      @click="emit('choose')"
    >
      {{ imported ? '重新选择文件' : '选择文件' }}
    </button>
  </div>
</template>
