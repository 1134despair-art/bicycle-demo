<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import RouteHistorySelectCard from '../components/route/RouteHistorySelectCard.vue'
import { rideDetailMockMap, rideHistoryMock } from '../data/data'
import { createSavedRouteFromRide, routeLibraryMock } from '../data/routes'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const store = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(store)

const coverImage = computed(() => routeLibraryMock[2]?.image ?? routeLibraryMock[0]?.image ?? '')

const getCurrentTimestamp = () => {
  return new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
}

const handleRideSelect = (rideId: string) => {
  const ride = rideHistoryMock.find((item) => item.id === rideId)
  if (!ride) {
    store.showToast('未找到对应的历史骑行记录')
    return
  }

  const detail = rideDetailMockMap[ride.id]
  if (!detail) {
    store.showToast('当前记录暂未生成可保存的路线数据')
    return
  }

  const nextRoute = createSavedRouteFromRide(detail)
  nextRoute.name = `${ride.title}路线`
  nextRoute.description = `由历史骑行记录“${ride.title}”自动生成，进入保存页后可继续确认名称与描述。`
  nextRoute.createdAt = getCurrentTimestamp()
  nextRoute.isFavorite = false
  nextRoute.deviceOnline = true

  store.setRouteDraft(nextRoute)
  void router.push('/routes/save')
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <PageNavBar title="历史轨迹生成" @back="router.back()" />

      <section class="px-4 pt-2">
        <div class="app-card px-4 py-5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">历史记录</p>
          <h2 class="mt-2 text-[20px] font-700 tracking-[-0.03em] text-ink">从最近骑行生成路线</h2>
          <p class="mt-2 text-[14px] leading-[1.7] text-muted">
            选择一条历史骑行记录后，系统会先生成路线草稿，并进入保存页让你确认名称后再保存。
          </p>
        </div>
      </section>

      <section class="px-4 pt-4">
        <div class="space-y-4">
          <RouteHistorySelectCard
            v-for="item in rideHistoryMock"
            :key="item.id"
            :date="item.date"
            :distance="item.distance"
            :duration="item.duration"
            :elevation="item.elevation"
            :image="coverImage"
            :title="item.title"
            @select="handleRideSelect(item.id)"
          />
        </div>
      </section>
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
