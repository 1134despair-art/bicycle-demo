<script setup lang="ts">
import { Bike } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppDialog from '../components/feedback/AppDialog.vue'
import type { RideHistoryItem } from '../data/data'
import { rideHistoryMock } from '../data/data'
import AppShell from '../layouts/AppShell.vue'

const router = useRouter()
const rideItems = ref([...rideHistoryMock])
const pendingDeleteRide = ref<RideHistoryItem | null>(null)
const openedDeleteId = ref<string | null>(null)
const draggingRideId = ref<string | null>(null)
const dragStartX = ref(0)
const dragStartOffset = ref(0)
const dragDistanceX = ref(0)
const suppressNextClick = ref(false)
const swipeOffsets = ref<Record<string, number>>({})

const DELETE_ACTION_WIDTH = 86
const SWIPE_OPEN_THRESHOLD = 36

const getSwipeOffset = (rideId: string) => swipeOffsets.value[rideId] ?? 0

const handleSwipeStart = (rideId: string, event: PointerEvent) => {
  draggingRideId.value = rideId
  dragStartX.value = event.clientX
  dragStartOffset.value = getSwipeOffset(rideId)
  dragDistanceX.value = 0
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)

  if (openedDeleteId.value && openedDeleteId.value !== rideId) {
    swipeOffsets.value = {
      ...swipeOffsets.value,
      [openedDeleteId.value]: 0,
    }
    openedDeleteId.value = null
  }
}

const handleSwipeMove = (rideId: string, event: PointerEvent) => {
  if (draggingRideId.value !== rideId) {
    return
  }

  const deltaX = event.clientX - dragStartX.value
  dragDistanceX.value = deltaX
  swipeOffsets.value = {
    ...swipeOffsets.value,
    [rideId]: Math.min(0, Math.max(-DELETE_ACTION_WIDTH, dragStartOffset.value + deltaX)),
  }
}

const handleSwipeEnd = (rideId: string) => {
  if (draggingRideId.value !== rideId) {
    return
  }

  const currentOffset = swipeOffsets.value[rideId] ?? 0
  const openDelete = currentOffset <= -SWIPE_OPEN_THRESHOLD

  openedDeleteId.value = openDelete ? rideId : null
  swipeOffsets.value = {
    ...swipeOffsets.value,
    [rideId]: openDelete ? -DELETE_ACTION_WIDTH : 0,
  }
  if (Math.abs(dragDistanceX.value) > 8) {
    suppressNextClick.value = true
    window.setTimeout(() => {
      suppressNextClick.value = false
    }, 0)
  }
  draggingRideId.value = null
}

const openRideDetail = (rideId: string) => {
  if (suppressNextClick.value) {
    return
  }

  if (openedDeleteId.value === rideId) {
    openedDeleteId.value = null
    swipeOffsets.value = {
      ...swipeOffsets.value,
      [rideId]: 0,
    }
    return
  }

  void router.push(`/data/ride/${rideId}`)
}

const requestDeleteRide = (item: RideHistoryItem) => {
  pendingDeleteRide.value = item
}

const confirmDeleteRide = () => {
  if (!pendingDeleteRide.value) {
    return
  }

  rideItems.value = rideItems.value.filter((item) => item.id !== pendingDeleteRide.value?.id)
  swipeOffsets.value = {
    ...swipeOffsets.value,
    [pendingDeleteRide.value.id]: 0,
  }
  openedDeleteId.value = null
  pendingDeleteRide.value = null
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />

      <section class="px-4 pb-20 pt-4">
        <PageNavBar class="-mx-4" title="全部骑行记录" @back="router.back()" />

        <div v-if="rideItems.length" class="space-y-3">
          <div
            v-for="item in rideItems"
            :key="item.id"
            class="relative overflow-hidden"
          >
            <div
              class="absolute inset-y-0 right-0 w-[86px] overflow-hidden transition-opacity duration-200 ease-out"
              :class="getSwipeOffset(item.id) < 0 ? 'opacity-100' : 'pointer-events-none opacity-0'"
              :aria-hidden="getSwipeOffset(item.id) >= 0"
            >
              <button
                class="h-full w-full cursor-pointer bg-danger px-2 text-[13px] font-700 text-white outline-none transition hover:bg-rose-600 focus-visible:ring-2 focus-visible:ring-danger"
                type="button"
                :tabindex="getSwipeOffset(item.id) < 0 ? 0 : -1"
                @click="requestDeleteRide(item)"
              >
                删除
              </button>
            </div>

            <button
              class="relative z-10 min-h-[76px] w-full flex touch-pan-y select-none cursor-pointer items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3.5 text-left outline-none hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
              :class="draggingRideId === item.id ? 'transition-none' : 'transition-transform duration-200 ease-out'"
              :style="{ transform: `translateX(${getSwipeOffset(item.id)}px)` }"
              type="button"
              @click="openRideDetail(item.id)"
              @pointerdown="handleSwipeStart(item.id, $event)"
              @pointermove="handleSwipeMove(item.id, $event)"
              @pointerup="handleSwipeEnd(item.id)"
              @pointercancel="handleSwipeEnd(item.id)"
              @pointerleave="handleSwipeEnd(item.id)"
            >
              <div class="flex min-w-0 items-center gap-3">
                <div class="h-11 w-11 shrink-0 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Bike :size="19" :stroke-width="2.2" />
                </div>

                <div class="min-w-0">
                  <h3 class="truncate text-[15px] font-700 leading-[1.3] text-ink">{{ item.title }}</h3>
                  <p class="mt-1.5 text-[11px] leading-none text-muted">{{ item.date }}</p>
                </div>
              </div>

              <div class="shrink-0 text-right">
                <p class="text-[16px] font-700 leading-none tabular-nums text-brand-700">{{ item.distance }}</p>
                <p class="mt-2 text-[11px] leading-none tabular-nums text-muted">{{ item.duration }}</p>
              </div>
            </button>
          </div>
        </div>

        <p v-if="rideItems.length" class="mt-5 text-center text-[12px] leading-[1.6] text-muted">
          左滑记录可删除，点击记录可查看骑行详情
        </p>

        <div
          v-else
          class="app-card px-6 py-12 text-center"
        >
          <p class="text-[15px] font-700 text-ink">暂无骑行记录</p>
          <p class="mt-2 text-[12px] leading-[1.7] text-muted">完成一次骑行后，这里会展示你的全部历史轨迹。</p>
        </div>
      </section>
    </div>

    <AppDialog
      description="删除后将从历史记录中移除。"
      title="确认删除这条骑行记录？"
      :visible="Boolean(pendingDeleteRide)"
      @cancel="pendingDeleteRide = null"
      @confirm="confirmDeleteRide"
    />
  </AppShell>
</template>
