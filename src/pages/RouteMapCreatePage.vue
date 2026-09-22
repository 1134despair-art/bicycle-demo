<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { SavedRouteItem } from '../data/routes'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { routeLibraryMock } from '../data/routes'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

type MapMarker = {
  x: number
  y: number
}

type PlannerWaypoint = {
  id: string
  name: string
  marker: MapMarker | null
}

type PlannerField = 'start' | 'end' | `waypoint:${string}`

const router = useRouter()
const store = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(store)

const templateRoute = computed(() => routeLibraryMock[0] ?? null)
const startName = ref('')
const endName = ref('')
const routeName = ref('')
const waypoints = ref<PlannerWaypoint[]>([])
const activeField = ref<PlannerField>('start')
const startMarker = ref<MapMarker | null>(null)
const endMarker = ref<MapMarker | null>(null)
const successVisible = ref(false)
const lastSavedRouteId = ref('')

const helperLines = [
  '1. 点击地图可以设置起点位置',
  '2. 再次点击地图可以设置终点位置',
  '3. 输入起点和终点名称后保存路线',
  '4. 可直接输入名称创建路线',
]

const plannerTitle = computed(() => {
  const start = startName.value.trim() || '待设置起点'
  const end = endName.value.trim() || '待设置终点'
  return `${start} 至 ${end}`
})

const canSave = computed(() => {
  const hasStartName = startName.value.trim().length > 0
  const hasEndName = endName.value.trim().length > 0
  const hasStartPoint = Boolean(startMarker.value)
  const hasEndPoint = Boolean(endMarker.value)
  return (hasStartPoint && hasEndPoint && hasStartName && hasEndName) || (hasStartName && hasEndName)
})

const createWaypoint = (): PlannerWaypoint => ({
  id: `waypoint-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '',
  marker: null,
})

const getWaypointFieldId = (id: string): PlannerField => `waypoint:${id}`

const getCurrentTimestamp = () => {
  return new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
}

const createMarkerNote = (label: string, marker: MapMarker | null) => {
  if (!marker) {
    return '手动输入'
  }

  return `${label}地图点位 ${Math.round(marker.x * 100)}%, ${Math.round(marker.y * 100)}%`
}

const setActiveField = (field: PlannerField) => {
  activeField.value = field
}

const clearStartField = () => {
  startName.value = ''
  startMarker.value = null
  activeField.value = 'start'
}

const clearEndField = () => {
  endName.value = ''
  endMarker.value = null
  activeField.value = 'end'
}

const handleAddWaypoint = () => {
  const nextWaypoint = createWaypoint()
  waypoints.value = [...waypoints.value, nextWaypoint]
  activeField.value = getWaypointFieldId(nextWaypoint.id)
}

const handleRemoveWaypoint = (id: string) => {
  waypoints.value = waypoints.value.filter((item) => item.id !== id)
  if (activeField.value === getWaypointFieldId(id)) {
    activeField.value = 'end'
  }
}

const clearWaypointPoint = (id: string) => {
  const target = waypoints.value.find((item) => item.id === id)
  if (!target) {
    return
  }

  target.marker = null
  activeField.value = getWaypointFieldId(id)
}

const assignWaypointMarker = (id: string, marker: MapMarker) => {
  const target = waypoints.value.find((item) => item.id === id)
  if (!target) {
    return
  }

  target.marker = marker
  if (!target.name.trim()) {
    const index = waypoints.value.findIndex((item) => item.id === id) + 1
    target.name = `地图途经点${index}`
  }

  const currentIndex = waypoints.value.findIndex((item) => item.id === id)
  const nextWaypoint = waypoints.value[currentIndex + 1]
  activeField.value = nextWaypoint ? getWaypointFieldId(nextWaypoint.id) : 'end'
}

const handleMapClick = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLDivElement | null
  if (!target) {
    return
  }

  const rect = target.getBoundingClientRect()
  if (!rect.width || !rect.height) {
    return
  }

  const nextMarker = {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
  }

  if (activeField.value === 'start') {
    startMarker.value = nextMarker
    if (!startName.value.trim()) {
      startName.value = '地图起点'
    }
    activeField.value = waypoints.value[0] ? getWaypointFieldId(waypoints.value[0].id) : 'end'
    return
  }

  if (activeField.value.startsWith('waypoint:')) {
    assignWaypointMarker(activeField.value.replace('waypoint:', ''), nextMarker)
    return
  }

  endMarker.value = nextMarker
  if (!endName.value.trim()) {
    endName.value = '地图终点'
  }
  activeField.value = 'end'
}

const handleReset = () => {
  startName.value = ''
  endName.value = ''
  routeName.value = ''
  waypoints.value = []
  startMarker.value = null
  endMarker.value = null
  activeField.value = 'start'
}

const handleBackToMyRoutes = () => {
  successVisible.value = false
  void router.push({
    path: '/routes',
    query: {
      highlight: lastSavedRouteId.value,
    },
  })
}

const handleSave = () => {
  if (!templateRoute.value || !canSave.value) {
    store.showToast('请先补充起点和终点信息')
    return
  }

  const nextId = `route-${Date.now()}`
  const nextRoute: SavedRouteItem = {
    ...templateRoute.value,
    id: nextId,
    name: routeName.value.trim() || `${startName.value.trim()}-${endName.value.trim()}`,
    source: '地图规划',
    description: `通过地图规划创建，起点为 ${startName.value.trim()}，终点为 ${endName.value.trim()}。`,
    createdAt: getCurrentTimestamp(),
    isFavorite: false,
    deviceOnline: false,
    startPoint: {
      label: '起点',
      name: startName.value.trim(),
      note: createMarkerNote('起点', startMarker.value),
    },
    viaPoints: waypoints.value
      .filter((item) => item.name.trim())
      .map((item, index) => ({
        label: `途经点${index + 1}`,
        name: item.name.trim(),
        note: createMarkerNote(`途经点${index + 1}`, item.marker),
      })),
    endPoint: {
      label: '终点',
      name: endName.value.trim(),
      note: createMarkerNote('终点', endMarker.value),
    },
  }

  store.prependSavedRoute(nextRoute)
  lastSavedRouteId.value = nextId
  successVisible.value = true
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <PageNavBar title="地图规划" @back="router.back()" />

      <template v-if="templateRoute">
        <section class="px-4 pt-2">
          <div class="overflow-hidden rounded-[6px] border border-line bg-white">
            <div
              class="relative h-[320px] cursor-crosshair overflow-hidden bg-#dfe9dd"
              @click="handleMapClick"
            >
              <img
                :alt="`${plannerTitle} 地图预览`"
                :src="templateRoute.image"
                class="h-full w-full object-cover"
              >
              <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(18,24,26,0.16))]" />

              <div class="pointer-events-none absolute left-4 top-4 rounded-[16px] bg-white/92 px-4 py-3 shadow-[0_10px_24px_rgba(34,40,38,0.10)] backdrop-blur-sm">
                <p class="text-[11px] uppercase tracking-[0.12em] text-muted">路线规划</p>
                <h2 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">{{ plannerTitle }}</h2>
              </div>

              <div
                v-if="startMarker"
                :style="{ left: `${startMarker.x * 100}%`, top: `${startMarker.y * 100}%` }"
                class="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
              >
                <div class="rounded-full bg-#16a34a px-3 py-1.5 text-[12px] font-700 text-white shadow-[0_10px_18px_rgba(22,163,74,0.26)]">
                  起点
                </div>
              </div>

              <div
                v-if="endMarker"
                :style="{ left: `${endMarker.x * 100}%`, top: `${endMarker.y * 100}%` }"
                class="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
              >
                <div class="rounded-full bg-#ef4444 px-3 py-1.5 text-[12px] font-700 text-white shadow-[0_10px_18px_rgba(239,68,68,0.24)]">
                  终点
                </div>
              </div>

              <div
                v-for="(item, index) in waypoints"
                :key="item.id"
                v-show="item.marker"
                :style="{ left: `${(item.marker?.x ?? 0) * 100}%`, top: `${(item.marker?.y ?? 0) * 100}%` }"
                class="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
              >
                <div class="rounded-full bg-brand-500 px-3 py-1.5 text-[12px] font-700 text-white shadow-[0_8px_18px_rgba(255,127,0,0.2)]">
                  途{{ index + 1 }}
                </div>
              </div>

              <div class="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/86 px-3 py-2 text-[12px] font-600 text-ink shadow-[0_10px_24px_rgba(34,40,38,0.10)] backdrop-blur-sm">
                当前地图点击将设置{{
                  activeField === 'start'
                    ? '起点'
                    : activeField === 'end'
                      ? '终点'
                      : '途经点'
                }}
              </div>
            </div>

            <div class="px-4 py-4">
              <h3 class="mb-3 text-[16px] font-700 text-ink">路线信息</h3>
              <div class="space-y-3">
                <div class="rounded-lg border border-line bg-soft px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-full bg-#eaf7ef text-[14px] font-700 text-#16a34a">
                      起
                    </div>
                    <input
                      v-model="startName"
                      class="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
                      placeholder="点击地图创建起点或直接输入起点名称"
                      type="text"
                      @focus="setActiveField('start')"
                    >
                    <button
                      class="app-touch-target min-w-11 px-2 text-[12px] font-700 text-muted"
                      type="button"
                      @click="clearStartField"
                    >
                      清除
                    </button>
                  </div>
                </div>

                <div
                  v-for="(item, index) in waypoints"
                  :key="item.id"
                  class="rounded-lg border border-line bg-soft px-4 py-3"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-[14px] font-700 text-brand-500">
                      经
                    </div>
                    <input
                      v-model="item.name"
                      class="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
                      :placeholder="`请输入途经点${index + 1}名称`"
                      type="text"
                      @focus="setActiveField(getWaypointFieldId(item.id))"
                    >
                    <button
                      v-if="item.marker"
                      class="app-touch-target min-w-11 px-2 text-[12px] font-700 text-muted"
                      type="button"
                      @click="clearWaypointPoint(item.id)"
                    >
                      清点
                    </button>
                    <button
                      class="app-touch-target min-w-11 px-2 text-[12px] font-700 text-#ef4444"
                      type="button"
                      @click="handleRemoveWaypoint(item.id)"
                    >
                      删除
                    </button>
                  </div>
                </div>

                <button
                  class="flex min-h-12 w-full items-center gap-3 rounded-lg border border-dashed border-brand-200 bg-brand-50 px-4 text-left"
                  type="button"
                  @click="handleAddWaypoint"
                >
                  <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-[18px] font-700 text-brand-500">+</span>
                  <span class="text-[14px] font-600 text-muted">添加途径点</span>
                </button>

                <div class="rounded-lg border border-line bg-soft px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-full bg-#fbeaea text-[14px] font-700 text-#ef4444">
                      终
                    </div>
                    <input
                      v-model="endName"
                      class="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
                      placeholder="点击地图创建终点或直接输入终点名称"
                      type="text"
                      @focus="setActiveField('end')"
                    >
                    <button
                      class="app-touch-target min-w-11 px-2 text-[12px] font-700 text-muted"
                      type="button"
                      @click="clearEndField"
                    >
                      清除
                    </button>
                  </div>
                </div>

                <div class="rounded-lg border border-line bg-soft px-4 py-3">
                  <div class="flex items-center gap-3">
                    <input
                      v-model="routeName"
                      class="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
                      placeholder="输入路线名称（可选）"
                      type="text"
                    >
                  </div>
                </div>
              </div>

              <div class="mt-4 rounded-lg bg-soft px-4 py-4">
                <p class="text-[12px] font-700 text-ink">操作说明</p>
                <ul class="mt-3 space-y-2 text-[13px] leading-[1.7] text-muted">
                  <li v-for="line in helperLines" :key="line">{{ line }}</li>
                </ul>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-3">
                <button
                  class="min-h-12 rounded-lg bg-#f3f4f6 text-[15px] font-700 text-#4b5563"
                  type="button"
                  @click="handleReset"
                >
                  重置
                </button>
                <button
                  :class="canSave ? 'bg-brand-500 text-white hover:bg-brand-600' : 'bg-#d6dbe2 text-white'"
                  :disabled="!canSave"
                  class="min-h-12 rounded-lg text-[15px] font-700 transition disabled:cursor-not-allowed"
                  type="button"
                  @click="handleSave"
                >
                  保存路线
                </button>
              </div>
            </div>
          </div>
        </section>
      </template>

      <section v-else class="px-4 pt-2">
        <div class="app-card px-4 py-5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">地图规划</p>
          <h2 class="mt-2 text-[20px] font-700 text-ink">当前没有可展示的规划模板</h2>
          <p class="mt-2 text-[14px] leading-[1.7] text-muted">
            请先补充路线 mock 数据，或稍后重试保存链路演示。
          </p>
        </div>
      </section>
    </div>

    <teleport to="body">
      <div
        v-if="successVisible"
        class="fixed inset-0 z-60 bg-black/40 px-6"
      >
        <div class="flex min-h-full items-center justify-center">
          <div class="app-sheet w-full max-w-82 px-6 py-6 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-#e8f7ef text-[24px] font-700 text-#16a34a">
              ✓
            </div>
            <h3 class="text-[18px] font-700 text-ink">保存成功</h3>
            <p class="mt-2 text-[13px] leading-6 text-muted">
              路线已成功保存到我的路线中
            </p>
            <button
              class="mt-6 min-h-12 w-full rounded-full bg-brand-500 text-[14px] font-700 text-white"
              type="button"
              @click="handleBackToMyRoutes"
            >
              查看我的路线
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
