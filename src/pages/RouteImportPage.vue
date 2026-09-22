<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import type { RouteDifficulty, SavedRouteItem } from '../data/routes'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import RouteUploadCard from '../components/route/RouteUploadCard.vue'
import { routeImportPreviewMock, routeLibraryMock } from '../data/routes'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const store = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(store)

const importDraftTemplate = computed(() => routeLibraryMock[1] ?? routeLibraryMock[0] ?? null)

const pickDifficulty = (distanceText: string): RouteDifficulty => {
  const distance = Number.parseFloat(distanceText)
  if (Number.isNaN(distance) || distance < 40) {
    return '轻松'
  }
  if (distance < 70) {
    return '中等'
  }
  return '进阶'
}

const createImportedRouteName = (fileName: string) => {
  const baseName = fileName.replace(/\.[^.]+$/, '').trim()
  return baseName || '导入路线'
}

const getCurrentTimestamp = () => {
  return new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
}

const handleChooseFile = () => {
  if (!importDraftTemplate.value) {
    store.showToast('暂无可用于导入的路线模板')
    return
  }

  const nextRoute: SavedRouteItem = {
    ...importDraftTemplate.value,
    id: `route-${Date.now()}`,
    name: createImportedRouteName(routeImportPreviewMock.fileName),
    source: '文件导入',
    distance: routeImportPreviewMock.distance,
    elevation: routeImportPreviewMock.elevation,
    difficulty: pickDifficulty(routeImportPreviewMock.distance),
    image: routeImportPreviewMock.image,
    description: `由 ${routeImportPreviewMock.format} 文件自动导入，进入保存页后可确认路线名称。`,
    createdAt: getCurrentTimestamp(),
    isFavorite: false,
    deviceOnline: false,
  }

  store.setRouteDraft(nextRoute)
  void router.push('/routes/save')
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <PageNavBar title="文件导入" @back="router.back()" />

      <section class="px-4 pt-2">
        <div class="app-card px-4 py-5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">文件导入</p>
          <h2 class="mt-2 text-[20px] font-700 tracking-[-0.03em] text-ink">导入 GPX / FIT 路书</h2>
          <p class="mt-2 text-[12px] leading-[1.7] text-muted">
            选择本地路线文件后，系统将自动识别并进入保存页确认路线名称。
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span class="rounded-full bg-[#F5F6F8] px-3 py-1 text-[11px] text-[#626970]">支持 GPX</span>
            <span class="rounded-full bg-[#F5F6F8] px-3 py-1 text-[11px] text-[#626970]">支持 FIT</span>
            <span class="rounded-full bg-[#F5F6F8] px-3 py-1 text-[11px] text-[#626970]">进入保存页确认</span>
          </div>
        </div>
      </section>

      <section class="px-4 pt-4">
        <RouteUploadCard @choose="handleChooseFile" />
      </section>
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
