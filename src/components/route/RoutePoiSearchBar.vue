<template>
  <div class="app-card px-4 py-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[11px] uppercase tracking-[0.12em] text-muted">POI 搜索</p>
        <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">选择途经地点</h3>
      </div>
      <span class="rounded-full bg-#f5f6f8 px-3 py-2 text-[11px] font-700 text-ink">地图模式</span>
    </div>

    <label class="mt-4 flex items-center gap-3 rounded-full bg-#f5f6f8 px-4 py-3">
      <span class="text-[16px] text-muted">⌕</span>
      <input
        class="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
        placeholder="搜索地点 / POI / 补给点"
        readonly
        type="text"
      >
    </label>

    <p class="mt-3 text-[12px] leading-[1.6] text-muted">
      当前为静态规划演示，已预置一条适合城市骑行的路线模板，可继续保存到路线库。
    </p>
  </div>
</template>
