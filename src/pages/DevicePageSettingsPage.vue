<script setup lang="ts">
import { Pencil, Plus, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { primaryDeviceId } from '../data/device'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const deviceId = computed(() => (typeof route.params.deviceId === 'string' ? route.params.deviceId : primaryDeviceId))
const device = computed(() => deviceStore.getDeviceById(deviceId.value))

type MetricCategoryKey = 'speed' | 'power' | 'heartRate' | 'cadence' | 'distance' | 'time' | 'altitude' | 'temperature'
type MetricOption = {
  key: string
  label: string
  value: string
}
type MetricCategory = {
  key: MetricCategoryKey
  label: string
  options: MetricOption[]
}

const metricCategories: MetricCategory[] = [
  {
    key: 'speed',
    label: '速度',
    options: [
      { key: 'currentSpeed', label: '当前速度', value: '28.5 km/h' },
      { key: 'avgSpeed', label: '平均速度', value: '26.1 km/h' },
      { key: 'maxSpeed', label: '最大速度', value: '43.8 km/h' },
    ],
  },
  {
    key: 'power',
    label: '功率',
    options: [
      { key: 'currentPower', label: '实时功率', value: '268 w' },
      { key: 'avgPower', label: '平均功率', value: '212 w' },
      { key: 'maxPower', label: '最大功率', value: '684 w' },
      { key: 'power3s', label: '3s 功率', value: '245 w' },
    ],
  },
  {
    key: 'heartRate',
    label: '心率',
    options: [
      { key: 'currentHeartRate', label: '实时心率', value: '132 bpm' },
      { key: 'avgHeartRate', label: '平均心率', value: '125 bpm' },
      { key: 'maxHeartRate', label: '最大心率', value: '168 bpm' },
    ],
  },
  {
    key: 'cadence',
    label: '踏频',
    options: [
      { key: 'currentCadence', label: '当前踏频', value: '85 rpm' },
      { key: 'avgCadence', label: '平均踏频', value: '82 rpm' },
      { key: 'maxCadence', label: '最大踏频', value: '116 rpm' },
    ],
  },
  {
    key: 'distance',
    label: '距离',
    options: [
      { key: 'rideDistance', label: '实时距离', value: '42.6 km' },
      { key: 'lapDistance', label: '圈距离', value: '6.3 km' },
      { key: 'remainingDistance', label: '剩余距离', value: '10.5 km' },
    ],
  },
  {
    key: 'time',
    label: '时间',
    options: [
      { key: 'rideTime', label: '运动时长', value: '32:45' },
      { key: 'elapsedTime', label: '已用时间', value: '55:05' },
      { key: 'clockTime', label: '当前时间', value: '09:37' },
    ],
  },
  {
    key: 'altitude',
    label: '海拔',
    options: [
      { key: 'currentAltitude', label: '当前海拔', value: '326 m' },
      { key: 'avgAltitude', label: '平均海拔', value: '301 m' },
      { key: 'maxAltitude', label: '最大海拔', value: '1205 m' },
    ],
  },
  {
    key: 'temperature',
    label: '温度',
    options: [
      { key: 'currentTemperature', label: '当前温度', value: '24℃' },
      { key: 'deviceBattery', label: '设备电量', value: '75%' },
    ],
  },
]

const metricOptionMap = Object.fromEntries(
  metricCategories.flatMap((category) =>
    category.options.map((option) => [option.key, { ...option, categoryKey: category.key, categoryLabel: category.label }]),
  ),
)

const pageTabs = ref([
  { key: 'page1', label: '1', slots: ['currentSpeed', 'currentHeartRate', 'currentCadence', 'rideDistance', 'rideTime'] },
  { key: 'page2', label: '2', slots: ['currentPower', 'avgHeartRate', 'avgCadence', 'remainingDistance', 'currentAltitude'] },
  { key: 'page3', label: '3', slots: ['avgSpeed', 'maxHeartRate', 'deviceBattery', 'rideDistance', 'clockTime'] },
])
const activePageKey = ref('page1')
const drawerVisible = ref(false)
const editingSlotIndex = ref<number | null>(null)
const activeCategoryKey = ref<MetricCategoryKey>('speed')
const pendingOptionKey = ref('currentSpeed')

const activePage = computed(() => pageTabs.value.find((item) => item.key === activePageKey.value) ?? pageTabs.value[0])
const activeCategory = computed(() => metricCategories.find((item) => item.key === activeCategoryKey.value) ?? metricCategories[0])
const activeSlotItems = computed(() =>
  activePage.value.slots.map((slotKey) => metricOptionMap[slotKey] ?? metricOptionMap.currentSpeed),
)

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

  if (key === 'profile') {
    void router.push('/my')
    return
  }

  appStore.showToast('我的模块将在下一阶段开发')
}

const openMetricDrawer = (index: number) => {
  const currentSlot = activePage.value.slots[index]
  const currentOption = metricOptionMap[currentSlot] ?? metricOptionMap.currentSpeed
  editingSlotIndex.value = index
  activeCategoryKey.value = currentOption.categoryKey
  pendingOptionKey.value = currentOption.key
  drawerVisible.value = true
}

const closeMetricDrawer = () => {
  drawerVisible.value = false
  editingSlotIndex.value = null
}

const selectCategory = (categoryKey: MetricCategoryKey) => {
  activeCategoryKey.value = categoryKey
  pendingOptionKey.value = activeCategory.value.options[0]?.key ?? pendingOptionKey.value
}

const confirmMetricSelection = () => {
  if (editingSlotIndex.value === null) {
    return
  }
  activePage.value.slots[editingSlotIndex.value] = pendingOptionKey.value
  closeMetricDrawer()
}

const addPage = () => {
  if (pageTabs.value.length >= 4) {
    appStore.showToast('最多支持 4 个页面')
    return
  }

  const nextNumber = pageTabs.value.length + 1
  const nextKey = `page${nextNumber}`
  pageTabs.value.push({
    key: nextKey,
    label: String(nextNumber),
    slots: ['currentSpeed', 'currentHeartRate', 'currentCadence', 'rideDistance', 'rideTime'],
  })
  activePageKey.value = nextKey
}

const savePageSetting = () => {
  appStore.showToast(`页面 ${activePage.value.label} 布局已应用到码表`)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <div>
          <PageNavBar class="-mx-4" title="页面设置" @back="router.back()" />

          <section class="app-card mt-4 p-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-[15px] font-700 text-ink">页面选择设置</h2>
              <button
                class="rounded-lg bg-brand-500 px-4 py-2 text-[12px] font-700 text-white"
                type="button"
                @click="savePageSetting"
              >
                应用
              </button>
            </div>

            <div class="mt-4 flex items-center gap-3">
              <button
                v-for="item in pageTabs"
                :key="item.key"
                class="h-11 min-w-11 rounded-lg border text-[13px] font-700 transition"
                :class="activePageKey === item.key ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-black/8 bg-white text-ink'"
                type="button"
                @click="activePageKey = item.key"
              >
                {{ item.label }}
              </button>

              <button
                class="h-11 min-w-11 flex items-center justify-center rounded-lg border border-brand-500 bg-brand-50 text-brand-700 transition"
                type="button"
                @click="addPage"
              >
                <Plus :size="16" :stroke-width="2.4" />
              </button>
            </div>
          </section>

          <section class="app-card mt-4 p-4">
            <h2 class="text-[15px] font-700 text-ink">当前布局</h2>

            <div class="mt-4 rounded-lg bg-soft px-4 py-5">
              <div class="mx-auto max-w-64 rounded-lg bg-[#0F172A] p-3 shadow-card">
                <div class="rounded-[6px] bg-[#111C30] px-3 py-6 text-center text-white">
                  <p class="text-[11px] text-white/60">{{ activeSlotItems[0].label }}</p>
                  <div class="mt-2 flex items-center justify-center gap-2">
                  <p class="text-[16px] font-700">{{ activeSlotItems[0].value }}</p>
                    <button
                      class="h-6 w-6 flex items-center justify-center rounded-full text-white/70 transition hover:bg-white/10"
                      type="button"
                      @click="openMetricDrawer(0)"
                    >
                      <Pencil :size="12" :stroke-width="2.2" />
                    </button>
                  </div>
                </div>

                <div class="mt-2 grid grid-cols-2 gap-2">
                  <div
                    v-for="(item, index) in activeSlotItems.slice(1, 5)"
                    :key="`${activePage.key}-${item.key}-${index}`"
                    class="rounded-[6px] bg-[#111C30] px-2 py-4 text-center text-white"
                  >
                    <p class="text-[10px] text-white/56">{{ item.label }}</p>
                    <div class="mt-2 flex items-center justify-center gap-1">
                      <p class="text-[14px] font-700">{{ item.value }}</p>
                      <button
                        class="h-5 w-5 flex items-center justify-center rounded-full text-white/70 transition hover:bg-white/10"
                        type="button"
                        @click="openMetricDrawer(index + 1)"
                      >
                        <Pencil :size="10" :stroke-width="2.2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="device" class="mt-4 flex items-center justify-center">
                <img :src="device.image" :alt="device.name" class="app-media h-20 w-20 bg-white object-cover" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />

    <teleport to="body">
      <div v-if="drawerVisible" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40" @click="closeMetricDrawer" />

        <div class="app-sheet absolute bottom-[128px] left-1/2 flex max-h-[calc(100vh-296px)] w-[calc(100%-24px)] max-w-[360px] -translate-x-1/2 flex-col overflow-hidden">
          <div class="shrink-0 border-b border-black/6 px-4 py-4">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-[16px] font-700 text-ink">选择显示内容</h3>
              <button
                class="h-8 w-8 flex items-center justify-center rounded-full text-muted transition hover:bg-#f3f4f6"
                type="button"
                @click="closeMetricDrawer"
              >
                <X :size="16" :stroke-width="2.2" />
              </button>
            </div>
          </div>

          <div class="min-h-0 flex-1 overflow-hidden">
            <div class="grid h-full min-h-0 grid-cols-[156px_1fr]">
              <div class="overflow-y-auto app-scroll-area border-r border-black/6 bg-[#FAFBFC]">
                <button
                  v-for="category in metricCategories"
                  :key="category.key"
                  class="w-full border-b border-black/6 px-4 py-3 text-left text-[14px] transition"
                  :class="activeCategoryKey === category.key ? 'bg-brand-500 font-700 text-white' : 'text-ink hover:bg-#f1f5f9'"
                  type="button"
                  @click="selectCategory(category.key)"
                >
                  {{ category.label }}
                </button>
              </div>

              <div class="overflow-y-auto app-scroll-area px-3 py-3">
                <button
                  v-for="option in activeCategory.options"
                  :key="option.key"
                  class="mb-2 w-full rounded-lg px-3 py-3 text-left text-[13px] transition"
                  :class="pendingOptionKey === option.key ? 'bg-brand-50 font-700 text-brand-700' : 'text-ink hover:bg-#f3f4f6'"
                  type="button"
                  @click="pendingOptionKey = option.key"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="shrink-0 border-t border-black/6 px-4 py-3">
            <button
              class="w-full rounded-lg bg-brand-500 py-3 text-[14px] font-700 text-white"
              type="button"
              @click="confirmMetricSelection"
            >
              确认选择
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </AppShell>
</template>
