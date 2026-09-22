<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import AppDialog from '../components/feedback/AppDialog.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import RouteCreateTypeDialog from '../components/route/RouteCreateTypeDialog.vue'
import { tabItems } from '../data/home'
import { officialRouteLibraryMock } from '../data/routes'
import type { SavedRouteItem } from '../data/routes'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

type RouteHomeTabKey = 'saved' | 'create' | 'official'

const routeHomeTabs: Array<{ key: RouteHomeTabKey, label: string }> = [
  { key: 'saved', label: '我的路线' },
  { key: 'create', label: '创建路线' },
  { key: 'official', label: '官方推荐' },
]

const router = useRouter()
const route = useRoute()
const store = useAppStore()
const { bikeComputerConnected, savedRoutes, toastMessage, toastVisible } = storeToRefs(store)

const activeTab = ref<RouteHomeTabKey>('saved')
const createTypeDialogVisible = ref(false)
const pendingDeleteRoute = ref<SavedRouteItem | null>(null)
const swipeOffsets = ref<Record<string, number>>({})
const draggingRouteId = ref<string | null>(null)
const dragStartX = ref(0)
const openedDeleteRouteId = ref<string | null>(null)
const isSwipeGesture = ref(false)
const SWIPE_ACTION_WIDTH = 86
const SWIPE_OPEN_THRESHOLD = 36
const SWIPE_TRIGGER_DISTANCE = 8
const highlightedRouteId = computed(() => typeof route.query.highlight === 'string' ? route.query.highlight : '')
const hasSavedRoutes = computed(() => savedRoutes.value.length > 0)
const createTypeOptions = [
  {
    key: 'map',
    title: '手动绘制生成',
    description: '',
    icon: 'map',
  },
  {
    key: 'history',
    title: '历史骑行记录生成',
    description: '',
    icon: 'history',
  },
  {
    key: 'import',
    title: 'GPX或FIX文件导入',
    description: '',
    icon: 'file',
  },
] as const

const handleViewRoute = (routeId: string) => {
  if (openedDeleteRouteId.value === routeId) {
    swipeOffsets.value = {
      ...swipeOffsets.value,
      [routeId]: 0,
    }
    openedDeleteRouteId.value = null
    return
  }

  void router.push(`/routes/${routeId}`)
}

const handleImportRoute = (routeName: string) => {
  if (!bikeComputerConnected.value) {
    return
  }

  store.showToast(`已导入到码表：${routeName}`)
}

const handleCreateRoute = () => {
  createTypeDialogVisible.value = true
}

const handleCloseCreateTypeDialog = () => {
  createTypeDialogVisible.value = false
}

const handleSelectCreateType = (key: 'map' | 'history' | 'import') => {
  createTypeDialogVisible.value = false

  if (key === 'map') {
    void router.push('/routes/create/map')
    return
  }

  if (key === 'history') {
    void router.push('/routes/create/history')
    return
  }

  void router.push('/routes/create/import')
}

const handleAddOfficialRoute = (routeId: string) => {
  const target = officialRouteLibraryMock.find((item) => item.id === routeId)
  if (!target) {
    return
  }

  const added = store.addOfficialRouteToSaved(target)
  if (added) {
    activeTab.value = 'saved'
  }
}

const isOfficialRouteAdded = (routeId: string) => {
  const target = officialRouteLibraryMock.find((item) => item.id === routeId)
  if (!target) {
    return false
  }

  return store.hasSavedRouteByOfficialRoute(target)
}

const handleSwipeStart = (routeId: string, event: PointerEvent) => {
  draggingRouteId.value = routeId
  dragStartX.value = event.clientX
  isSwipeGesture.value = false

  if (openedDeleteRouteId.value && openedDeleteRouteId.value !== routeId) {
    swipeOffsets.value = {
      ...swipeOffsets.value,
      [openedDeleteRouteId.value]: 0,
    }
    openedDeleteRouteId.value = null
  }
}

const handleSwipeMove = (routeId: string, event: PointerEvent) => {
  if (draggingRouteId.value !== routeId) {
    return
  }

  const deltaX = event.clientX - dragStartX.value
  if (Math.abs(deltaX) > SWIPE_TRIGGER_DISTANCE) {
    isSwipeGesture.value = true
  }

  if (deltaX > 0 && openedDeleteRouteId.value !== routeId) {
    swipeOffsets.value = {
      ...swipeOffsets.value,
      [routeId]: 0,
    }
    return
  }

  const nextOffset = openedDeleteRouteId.value === routeId
    ? Math.max(-SWIPE_ACTION_WIDTH, Math.min(0, -SWIPE_ACTION_WIDTH + deltaX))
    : Math.max(-SWIPE_ACTION_WIDTH, Math.min(0, deltaX))

  swipeOffsets.value = {
    ...swipeOffsets.value,
    [routeId]: nextOffset,
  }
}

const handleSwipeEnd = (routeId: string) => {
  if (draggingRouteId.value !== routeId) {
    return
  }

  const currentOffset = swipeOffsets.value[routeId] ?? 0
  const shouldOpen = currentOffset <= -SWIPE_OPEN_THRESHOLD

  swipeOffsets.value = {
    ...swipeOffsets.value,
    [routeId]: shouldOpen ? -SWIPE_ACTION_WIDTH : 0,
  }
  openedDeleteRouteId.value = shouldOpen ? routeId : null
  draggingRouteId.value = null

  window.setTimeout(() => {
    isSwipeGesture.value = false
  }, 0)
}

const requestDeleteRoute = (routeItem: SavedRouteItem) => {
  pendingDeleteRoute.value = routeItem
}

const cancelDeleteRoute = () => {
  pendingDeleteRoute.value = null
}

const confirmDeleteRoute = () => {
  if (!pendingDeleteRoute.value) {
    return
  }

  const targetId = pendingDeleteRoute.value.id
  const targetName = pendingDeleteRoute.value.name
  store.removeSavedRoute(targetId)
  swipeOffsets.value = {
    ...swipeOffsets.value,
    [targetId]: 0,
  }
  openedDeleteRouteId.value = null
  pendingDeleteRoute.value = null
  store.showToast(`已删除路线：${targetName}`)
}

const handleTab = (key: string) => {
  if (key === 'home') {
    void router.push('/home')
    return
  }

  if (key === 'data') {
    void router.push('/data')
    return
  }

  if (key === 'route') {
    void router.push('/routes')
    return
  }

  if (key === 'device') {
    void router.push('/device')
    return
  }

  if (key === 'profile') {
    void router.push('/my')
    return
  }

  const label = tabItems.find((item) => item.key === key)?.label ?? '页面'
  store.showToast(`${label}模块将在下一阶段开发`)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />
      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area">
        <PageNavBar
          :show-back="false"
          :status-label="bikeComputerConnected ? '码表已连接' : '码表未连接'"
          :status-tone="bikeComputerConnected ? 'success' : 'muted'"
          title="路线"
        />

        <section class="px-4 pt-4">
          <div class="app-segmented">
            <div class="grid grid-cols-3 gap-1">
              <button
                v-for="item in routeHomeTabs"
                :key="item.key"
                :class="activeTab === item.key ? 'bg-brand-500 text-white' : 'text-muted hover:bg-white'"
                class="app-segmented-item relative px-3 text-[13px] font-700 transition"
                type="button"
                @click="activeTab = item.key"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'saved'" class="px-4 pb-4 pt-4">
          <div v-if="hasSavedRoutes" class="space-y-3">
            <div
              v-for="item in savedRoutes"
              :key="item.id"
              class="relative overflow-hidden"
            >
              <div
                :class="(swipeOffsets[item.id] ?? 0) < 0 ? 'opacity-100' : 'pointer-events-none opacity-0'"
                :aria-hidden="(swipeOffsets[item.id] ?? 0) >= 0"
                class="absolute inset-y-0 right-0 w-[86px] overflow-hidden transition-opacity duration-220 ease-out"
              >
                <button
                  class="h-full w-full flex items-center justify-center bg-danger text-[13px] font-700 text-white"
                  type="button"
                  :tabindex="(swipeOffsets[item.id] ?? 0) < 0 ? 0 : -1"
                  @click="requestDeleteRoute(item)"
                >
                  删除
                </button>
              </div>

              <button
                :class="highlightedRouteId === item.id ? 'border-brand-500 shadow-[0_6px_18px_rgba(255,127,0,0.14)]' : 'border-line'"
                class="app-card relative z-1 w-full p-4 text-left transition-[transform,box-shadow] duration-220 ease-out"
                type="button"
                :style="{ transform: `translateX(${swipeOffsets[item.id] ?? 0}px)` }"
                @click="handleViewRoute(item.id)"
                @pointerdown="handleSwipeStart(item.id, $event)"
                @pointermove="handleSwipeMove(item.id, $event)"
                @pointerup="handleSwipeEnd(item.id)"
                @pointercancel="handleSwipeEnd(item.id)"
              >
                <div class="flex gap-3">
                  <img :src="item.image" :alt="item.name" class="app-media h-22 w-24 object-cover" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="line-clamp-2 text-[15px] font-700 leading-5 text-ink">{{ item.name }}</p>
                        <p class="mt-1 text-[12px] text-muted">{{ item.source }} · {{ item.createdAt }}</p>
                      </div>
                      <span
                        class="shrink-0 rounded-full px-3 py-1 text-[11px] font-700"
                        :class="item.difficulty === '轻松'
                          ? 'bg-[#EAF8F1] text-[#1F8A5B]'
                          : item.difficulty === '中等'
                            ? 'bg-[#FFF2E5] text-[#D97706]'
                            : 'bg-[#FDECEC] text-[#D64545]'"
                      >
                        {{ item.difficulty }}
                      </span>
                    </div>
                    <p class="mt-3 line-clamp-2 text-[12px] leading-5 text-muted">
                      {{ item.description }}
                    </p>
                    <div class="mt-3 flex flex-wrap gap-2 text-[12px] text-muted">
                      <span class="rounded-full bg-[#F5F6F8] px-3 py-1">里程 {{ item.distance }}</span>
                      <span class="rounded-full bg-[#F5F6F8] px-3 py-1">爬升 {{ item.elevation }}</span>
                    </div>
                    <div class="mt-3 flex justify-end">
                      <button
                        :class="bikeComputerConnected
                          ? 'bg-brand-500 text-white'
                          : 'cursor-not-allowed bg-[#E8ECEA] text-[#94A39D]'"
                        class="min-h-11 shrink-0 rounded-lg px-4 text-[12px] font-700 transition"
                        type="button"
                        :disabled="!bikeComputerConnected"
                        @click.stop="handleImportRoute(item.name)"
                      >
                        导入码表
                      </button>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div
            v-else
            class="app-card px-5 py-12 text-center"
          >
            <p class="text-[14px] font-600 text-ink">没有数据，请创建路线</p>
            <button
              class="app-primary-button mt-6 min-h-12 px-6 text-[13px]"
              type="button"
              @click="activeTab = 'create'"
            >
              去创建路线
            </button>
          </div>
        </section>

        <section v-else-if="activeTab === 'create'" class="px-4 pb-4 pt-4">
          <div class="app-card px-5 py-12 text-center">
            <h2 class="app-section-title">点击下方按钮创建路线</h2>
            <button
              class="app-primary-button mt-6 min-h-12 px-6 text-[13px]"
              type="button"
              @click="handleCreateRoute"
            >
              创建路线
            </button>
          </div>
        </section>

        <section v-else class="px-4 pb-4 pt-4">
          <div class="space-y-3">
            <div
              v-for="item in officialRouteLibraryMock"
              :key="item.id"
              class="app-card cursor-pointer p-4 transition hover:border-brand-200"
              @click="handleViewRoute(item.id)"
            >
              <div class="flex gap-3">
                <img :src="item.image" :alt="item.name" class="app-media h-22 w-24 object-cover" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="line-clamp-2 text-[15px] font-700 leading-5 text-ink">{{ item.name }}</p>
                      <p class="mt-1 text-[12px] text-muted">{{ item.officialTag }} · {{ item.region }}</p>
                    </div>
                    <span
                      class="shrink-0 rounded-full px-3 py-1 text-[11px] font-700"
                      :class="item.difficulty === '轻松'
                        ? 'bg-[#EAF8F1] text-[#1F8A5B]'
                        : item.difficulty === '中等'
                          ? 'bg-[#FFF2E5] text-[#D97706]'
                          : 'bg-[#FDECEC] text-[#D64545]'"
                    >
                      {{ item.difficulty }}
                    </span>
                  </div>
                  <p class="mt-3 line-clamp-2 text-[12px] leading-5 text-muted">
                    {{ item.recommendedReason }}
                  </p>
                  <div class="mt-3 flex flex-wrap gap-2 text-[12px] text-muted">
                    <span class="rounded-full bg-[#F5F6F8] px-3 py-1">里程 {{ item.distance }}</span>
                    <span class="rounded-full bg-[#F5F6F8] px-3 py-1">爬升 {{ item.elevation }}</span>
                  </div>
                  <button
                    :class="isOfficialRouteAdded(item.id)
                      ? 'bg-[#E8F3EE] text-[#6B7F78] cursor-not-allowed'
                      : 'bg-brand-500 text-white'"
                    class="mt-4 min-h-10 rounded-lg px-4 text-[12px] font-700 transition"
                    type="button"
                    :disabled="isOfficialRouteAdded(item.id)"
                    @click.stop="handleAddOfficialRoute(item.id)"
                  >
                    {{ isOfficialRouteAdded(item.id) ? '已加入' : '加入我的路线' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomTabBar :active-key="'route'" :items="tabItems" @select="handleTab" />
    </div>
    <RouteCreateTypeDialog
      :options="createTypeOptions"
      :visible="createTypeDialogVisible"
      @close="handleCloseCreateTypeDialog"
      @select="handleSelectCreateType"
    />
    <AppDialog
      :visible="Boolean(pendingDeleteRoute)"
      title="删除路线"
      :description="pendingDeleteRoute ? `确认删除“${pendingDeleteRoute.name}”吗？删除后不可恢复。` : ''"
      @cancel="cancelDeleteRoute"
      @confirm="confirmDeleteRoute"
    />
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
