<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { LocateFixed, PencilLine, X } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

import mapRouteLight from '../assets/live-ride/backgrounds/map-route-light@2x.png'
import mapRouteSatellite from '../assets/live-ride/backgrounds/map-route-satellite@2x.png'
import arrowLeftIcon from '../assets/live-ride/icons/icon-arrow-left.png'
import chevronRightIcon from '../assets/live-ride/icons/icon-chevron-right.png'
import mapLayersIcon from '../assets/live-ride/icons/icon-map-layers.png'
import mapLayersActiveIcon from '../assets/live-ride/icons/icon-map-layers-active.png'
import mapLocateIcon from '../assets/live-ride/icons/icon-map-locate.png'
import mapMinusIcon from '../assets/live-ride/icons/icon-map-minus.png'
import mapPlusIcon from '../assets/live-ride/icons/icon-map-plus.png'
import pauseDarkIcon from '../assets/live-ride/icons/icon-pause-dark.png'
import playWhiteIcon from '../assets/live-ride/icons/icon-play-white.png'
import settingsIcon from '../assets/live-ride/icons/icon-settings.png'
import stopDangerIcon from '../assets/live-ride/icons/icon-stop-danger.png'
import stopWhiteIcon from '../assets/live-ride/icons/icon-stop-white.png'
import turnLeftIcon from '../assets/live-ride/icons/icon-turn-left.png'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import AppOptionSheet from '../components/feedback/AppOptionSheet.vue'
import AppToast from '../components/feedback/AppToast.vue'
import type { RideDetailData } from '../data/data'
import { latestRideId, liveRideMock } from '../data/data'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const endDialogVisible = ref(false)
const settingsPageVisible = ref(false)
const voiceBroadcastSheetVisible = ref(false)
const navBroadcastSheetVisible = ref(false)
const isPaused = ref(false)
const isAutoPaused = ref(false)
const elapsedSeconds = ref(0)
const currentSpeed = ref(0)
const distanceKm = ref(0)
const cadence = ref(0)
const heartRate = ref(0)
const climbing = ref(0)
const currentPower = ref(0)
const currentGrade = ref(0)
const frontGear = ref(1)
const frontGearTotal = ref<number | null>(2)
const rearGear = ref(2)
const rearGearTotal = 12
const maxSpeed = ref(0)
const sampleCount = ref(0)
const cadenceTotal = ref(0)
const heartRateTotal = ref(0)
const powerTotal = ref(0)
const mapMode = ref<'standard' | 'satellite'>('standard')
const mapZoomLevel = ref(1)
const voiceBroadcastEnabled = ref(true)
const navBroadcastEnabled = ref(true)
const autoPauseEnabled = ref(true)
const dataUploadEnabled = ref(true)
const autoPauseTicksRemaining = ref(0)
const lapMode = ref<'distance' | 'time'>('distance')
const lapValue = ref('1.0')
const navTipIndex = ref(0)
const routePointEditorVisible = ref(false)
const editingRoutePoint = ref<'start' | 'end'>('start')
const routePointDraft = ref('')
const isLocatingRoutePoint = ref(false)

let rideTimer: number | undefined

const navTips = [
  '前方100米左转进入吉泰一路',
  '继续沿当前道路直行500米',
  '前方200米右转进入天顺大道中段',
  '沿当前道路骑行1公里到达目的地',
]

const voiceSettingOptions = [
  { key: 'on', label: '开启运动播报', description: '骑行中播报距离、时长、速度等关键信息。' },
  { key: 'off', label: '关闭运动播报', description: '不再播报运动过程中的语音提示。' },
]

const navSettingOptions = [
  { key: 'on', label: '开启导航播报', description: '骑行导航时语音提示转向与路线变化。' },
  { key: 'off', label: '关闭导航播报', description: '只保留地图和页面文字提示，不进行语音播报。' },
]

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const roundTo = (value: number, digits = 1) => Number(value.toFixed(digits))

const formatElapsed = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [hours, minutes, secs].map((item) => String(item).padStart(2, '0')).join(':')
}

const formattedElapsed = computed(() => formatElapsed(elapsedSeconds.value))
const formattedCurrentSpeed = computed(() => currentSpeed.value.toFixed(1))
const formattedDistance = computed(() => distanceKm.value.toFixed(1))
const formattedAvgSpeed = computed(() => {
  if (elapsedSeconds.value === 0) {
    return '0.0'
  }
  return (distanceKm.value / (elapsedSeconds.value / 3600)).toFixed(1)
})
const formattedCadence = computed(() => String(Math.round(cadence.value)))
const formattedHeartRate = computed(() => String(Math.round(heartRate.value)))
const formattedPower = computed(() => String(Math.round(currentPower.value)))
const formattedClimbing = computed(() => String(Math.round(climbing.value)))
const ridingMinutes = computed(() => Math.max(1, Math.round(elapsedSeconds.value / 60)))
const hasFrontDerailleur = computed(() => frontGearTotal.value !== null)
const isRidePaused = computed(() => isPaused.value || isAutoPaused.value)
const pauseButtonLabel = computed(() => (isRidePaused.value ? '开始骑行' : '暂停骑行'))
const pauseButtonIcon = computed(() => (isRidePaused.value ? playWhiteIcon : pauseDarkIcon))
const navTipText = computed(() => navTips[navTipIndex.value])
const routeName = computed(() => liveRideMock.routeHint.replace('当前路线：', ''))
const rideStartPoint = ref('当前位置')
const rideEndPoint = ref(liveRideMock.routeHint.replace('当前路线：', ''))
const routePointEditorTitle = computed(() => (editingRoutePoint.value === 'start' ? '设置起点' : '设置终点'))
const routePointInputPlaceholder = computed(() => (editingRoutePoint.value === 'start' ? '请输入起点名称或地址' : '请输入终点名称或地址'))
const lapInputPlaceholder = computed(() => (lapMode.value === 'distance' ? '请输入距离' : '请输入时间'))
const lapUnit = computed(() => (lapMode.value === 'distance' ? 'km' : 'min'))
const voiceBroadcastLabel = computed(() => (voiceBroadcastEnabled.value ? '已开启' : '已关闭'))
const navBroadcastLabel = computed(() => (navBroadcastEnabled.value ? '已开启' : '已关闭'))
const hasRideStarted = computed(() => store.rideStatus !== 'idle')
const canBeginRide = computed(() => rideStartPoint.value.trim().length > 0 && rideEndPoint.value.trim().length > 0)
const mapBackground = computed(() => (mapMode.value === 'satellite' ? mapRouteSatellite : mapRouteLight))
const mapLayersButtonIcon = computed(() => (mapMode.value === 'satellite' ? mapLayersActiveIcon : mapLayersIcon))
const mapScaleStyle = computed(() => ({
  transform: `scale(${mapZoomLevel.value})`,
  transformOrigin: 'center center',
}))
const liveMetricItems = computed(() => [
  { key: 'speed', label: '速度', value: formattedCurrentSpeed.value, unit: 'km/h', tone: 'text-brand-500' },
  { key: 'duration', label: '时长', value: formattedElapsed.value, unit: '', tone: 'text-ink' },
  { key: 'climbing', label: '爬升', value: formattedClimbing.value, unit: 'm', tone: 'text-ink' },
  { key: 'cadence', label: '踏频', value: formattedCadence.value, unit: 'rpm', tone: 'text-ink' },
  { key: 'heart-rate', label: '心率', value: formattedHeartRate.value, unit: 'bpm', tone: 'text-ink' },
  { key: 'power', label: '功率', value: formattedPower.value, unit: 'W', tone: 'text-ink' },
])

const tickRide = () => {
  if (isPaused.value) {
    return
  }

  if (isAutoPaused.value) {
    autoPauseTicksRemaining.value -= 1
    currentSpeed.value = 0
    currentGrade.value = 0
    if (autoPauseTicksRemaining.value <= 0) {
      isAutoPaused.value = false
      store.showToast('已自动继续骑行')
    }
    return
  }

  elapsedSeconds.value += 1

  if (autoPauseEnabled.value && elapsedSeconds.value > 0 && elapsedSeconds.value % 48 === 0) {
    isAutoPaused.value = true
    autoPauseTicksRemaining.value = 4
    currentSpeed.value = 0
    currentGrade.value = 0
    store.showToast('检测到短暂停车，已自动暂停')
    return
  }

  const nextSpeed = clamp(
    roundTo(23 + Math.sin(elapsedSeconds.value / 18) * 2.2 + (Math.random() * 2.8 - 1.1)),
    6,
    36,
  )
  const nextCadence = clamp(Math.round(82 + nextSpeed * 0.6 + (Math.random() * 8 - 4)), 68, 108)
  const nextHeartRate = clamp(Math.round(118 + nextSpeed * 1.2 + (Math.random() * 10 - 5)), 96, 178)
  const nextPower = clamp(Math.round(110 + nextSpeed * 4.2 + (Math.random() * 28 - 12)), 90, 360)
  const nextGrade = clamp(roundTo(Math.random() * 4.6 - 1.2), -2.5, 7.5)
  const nextClimbing = climbing.value + (nextGrade > 1.2 ? roundTo(nextGrade * 0.45, 1) : 0)

  currentSpeed.value = nextSpeed
  cadence.value = nextCadence
  heartRate.value = nextHeartRate
  currentPower.value = nextPower
  currentGrade.value = nextGrade
  rearGear.value = clamp(Math.round(nextSpeed / 3), 1, rearGearTotal)
  if (hasFrontDerailleur.value) {
    frontGear.value = nextSpeed >= 25 ? 2 : 1
  }
  climbing.value = roundTo(nextClimbing, 1)
  distanceKm.value = roundTo(distanceKm.value + nextSpeed / 3600, 3)
  maxSpeed.value = Math.max(maxSpeed.value, nextSpeed)
  sampleCount.value += 1
  cadenceTotal.value += nextCadence
  heartRateTotal.value += nextHeartRate
  powerTotal.value += nextPower

  if (elapsedSeconds.value % 24 === 0) {
    navTipIndex.value = (navTipIndex.value + 1) % navTips.length
  }
}

const buildRideDetailFromSession = (): RideDetailData => {
  const averageCadence = sampleCount.value ? Math.round(cadenceTotal.value / sampleCount.value) : 0
  const averageHeartRate = sampleCount.value ? Math.round(heartRateTotal.value / sampleCount.value) : 0
  const averagePower = sampleCount.value ? Math.round(powerTotal.value / sampleCount.value) : 0
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const calories = Math.round(elapsedSeconds.value / 60 * 8.4)
  const totalMinutes = Math.max(1, Math.round(elapsedSeconds.value / 60))
  const splits = [
    {
      label: '起步段',
      distance: `${Math.max(0.5, distanceKm.value * 0.25).toFixed(1)}km`,
      duration: `${Math.max(1, Math.round(totalMinutes * 0.25))}m`,
      avgSpeed: `${Math.max(8, Number(formattedAvgSpeed.value) * 0.92).toFixed(1)}km/h`,
    },
    {
      label: '巡航段',
      distance: `${Math.max(0.5, distanceKm.value * 0.45).toFixed(1)}km`,
      duration: `${Math.max(1, Math.round(totalMinutes * 0.45))}m`,
      avgSpeed: `${Math.max(10, Number(formattedAvgSpeed.value) * 1.04).toFixed(1)}km/h`,
    },
    {
      label: '收尾段',
      distance: `${Math.max(0.5, distanceKm.value * 0.3).toFixed(1)}km`,
      duration: `${Math.max(1, Math.round(totalMinutes * 0.3))}m`,
      avgSpeed: `${Math.max(8, Number(formattedAvgSpeed.value) * 0.97).toFixed(1)}km/h`,
    },
  ]

  return {
    id: latestRideId,
    title: '本次骑行',
    subtitle: '',
    date,
    routeName: routeName.value,
    weather: '',
    bikeName: '',
    summary: '',
    heroMetrics: [
      { label: '骑行里程', value: `${formattedDistance.value}km`, tone: 'text-ink' },
      { label: '总时长', value: formattedElapsed.value, tone: 'text-brand-700' },
      { label: '平均速度', value: `${formattedAvgSpeed.value}km/h`, tone: 'text-success' },
    ],
    secondaryMetrics: [
      { label: '爬升', value: `${formattedClimbing.value}m` },
      { label: '平均踏频', value: `${averageCadence}rpm` },
      { label: '平均心率', value: `${averageHeartRate}bpm` },
      { label: '消耗热量', value: `${calories}kcal` },
      { label: '平均功率', value: `${averagePower}w`, tone: 'text-warning' },
      { label: '最大速度', value: `${maxSpeed.value.toFixed(1)}km/h`, tone: 'text-brand-700' },
    ],
    charts: [
      { key: 'speed', label: '速度', unit: 'km/h', tone: 'from-brand-700 to-brand-400', values: [8, 14, 18, Number(formattedCurrentSpeed.value), Number(formattedAvgSpeed.value), Math.max(6, Number(formattedCurrentSpeed.value) - 4), Math.max(5, Number(formattedAvgSpeed.value) - 2)] },
      { key: 'heart-rate', label: '心率', unit: 'bpm', tone: 'from-danger to-#ff9b8f', values: [98, 112, 126, Math.round(heartRate.value), averageHeartRate, Math.max(96, averageHeartRate - 8), Math.max(92, averageHeartRate - 14)] },
      { key: 'power', label: '功率', unit: 'w', tone: 'from-warning to-#ffd27a', values: [80, 126, 168, Math.round(currentPower.value), averagePower, Math.max(90, averagePower - 24), Math.max(84, averagePower - 36)] },
      { key: 'elevation', label: '海拔', unit: 'm', tone: 'from-ink to-brand-600', values: [0, Math.round(climbing.value * 0.2), Math.round(climbing.value * 0.45), Math.round(climbing.value * 0.62), Math.round(climbing.value * 0.8), Math.round(climbing.value * 0.92), Math.round(climbing.value)] },
      { key: 'calories', label: '卡路里', unit: 'kcal', tone: 'from-success to-#92e6b2', values: [0, Math.round(calories * 0.16), Math.round(calories * 0.35), Math.round(calories * 0.58), Math.round(calories * 0.76), Math.round(calories * 0.9), calories] },
    ],
    splits,
  }
}

const startRideTimer = () => {
  window.clearInterval(rideTimer)
  rideTimer = window.setInterval(tickRide, 1000)
}

const handleBeginRide = () => {
  if (!canBeginRide.value) {
    store.showToast('请先设置起点和终点')
    return
  }

  isPaused.value = false
  isAutoPaused.value = false
  autoPauseTicksRemaining.value = 0
  navTipIndex.value = 0
  store.clearLiveRideResult()
  store.startRideSession()
  startRideTimer()
  store.showToast('已开始本次骑行')
}

const handlePause = () => {
  if (isAutoPaused.value) {
    isAutoPaused.value = false
    autoPauseTicksRemaining.value = 0
    store.showToast('已开始本次骑行')
    return
  }

  isPaused.value = !isPaused.value
  store.showToast(isPaused.value ? '已暂停本次骑行' : '已开始本次骑行')
}

const handleEndRide = () => {
  endDialogVisible.value = false
  settingsPageVisible.value = false
  window.clearInterval(rideTimer)
  store.setLiveRideResult(buildRideDetailFromSession())
  store.finishRideSession()
  store.showToast('已结束本次骑行，正在生成骑行详情')
  window.setTimeout(() => {
    void router.push(`/data/ride/${latestRideId}`)
  }, 500)
}

const requestCurrentPosition = () => new Promise<GeolocationPosition>((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error('当前设备不支持定位功能'))
    return
  }

  navigator.geolocation.getCurrentPosition(resolve, reject, {
    enableHighAccuracy: true,
    maximumAge: 30_000,
    timeout: 10_000,
  })
})

const getLocationErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const errorCode = Number(error.code)
    if (errorCode === 1) {
      return '未获得定位权限，请在系统设置中开启定位权限'
    }
    if (errorCode === 2) {
      return '暂时无法获取当前位置，请稍后重试'
    }
    if (errorCode === 3) {
      return '定位超时，请到开阔区域后重试'
    }
  }

  return error instanceof Error ? error.message : '定位失败，请稍后重试'
}

const setRoutePoint = (value: string) => {
  if (editingRoutePoint.value === 'start') {
    rideStartPoint.value = value
    return
  }

  rideEndPoint.value = value
}

const openRoutePointEditor = (point: 'start' | 'end') => {
  editingRoutePoint.value = point
  routePointDraft.value = point === 'start' ? rideStartPoint.value : rideEndPoint.value
  routePointEditorVisible.value = true
}

const closeRoutePointEditor = () => {
  if (isLocatingRoutePoint.value) {
    return
  }

  routePointEditorVisible.value = false
}

const saveRoutePoint = () => {
  const value = routePointDraft.value.trim()
  if (!value) {
    store.showToast(`请输入${editingRoutePoint.value === 'start' ? '起点' : '终点'}`)
    return
  }

  setRoutePoint(value)
  routePointEditorVisible.value = false
  store.showToast(`${routePointEditorTitle.value}已保存`)
}

const locateRoutePoint = async () => {
  isLocatingRoutePoint.value = true
  try {
    const position = await requestCurrentPosition()
    const locationLabel = `当前位置（${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}）`
    routePointDraft.value = locationLabel
    setRoutePoint(locationLabel)
    routePointEditorVisible.value = false
    store.showToast(`${routePointEditorTitle.value}已定位`)
  } catch (error) {
    store.showToast(getLocationErrorMessage(error))
  } finally {
    isLocatingRoutePoint.value = false
  }
}

const handleLocate = async () => {
  try {
    await requestCurrentPosition()
    store.showToast('已定位到当前位置')
  } catch (error) {
    store.showToast(getLocationErrorMessage(error))
  }
}

const handleZoomIn = () => {
  mapZoomLevel.value = clamp(roundTo(mapZoomLevel.value + 0.2, 1), 0.8, 1.8)
  store.showToast(`地图已放大至 ${mapZoomLevel.value.toFixed(1)}x`)
}

const handleZoomOut = () => {
  mapZoomLevel.value = clamp(roundTo(mapZoomLevel.value - 0.2, 1), 0.8, 1.8)
  store.showToast(`地图已缩小至 ${mapZoomLevel.value.toFixed(1)}x`)
}

const toggleMapMode = () => {
  mapMode.value = mapMode.value === 'standard' ? 'satellite' : 'standard'
  store.showToast(mapMode.value === 'satellite' ? '已切换到卫星地图' : '已切换到标准地图')
}

const applyVoiceBroadcast = (enabled: boolean) => {
  voiceBroadcastEnabled.value = enabled
  voiceBroadcastSheetVisible.value = false
  store.showToast(enabled ? '已开启运动播报' : '已关闭运动播报')
}

const applyNavBroadcast = (enabled: boolean) => {
  navBroadcastEnabled.value = enabled
  navBroadcastSheetVisible.value = false
  store.showToast(enabled ? '已开启导航播报' : '已关闭导航播报')
}

const toggleAutoPause = () => {
  autoPauseEnabled.value = !autoPauseEnabled.value
  if (!autoPauseEnabled.value) {
    isAutoPaused.value = false
    autoPauseTicksRemaining.value = 0
  }
  store.showToast(autoPauseEnabled.value ? '已开启自动暂停' : '已关闭自动暂停')
}

const toggleDataUpload = () => {
  dataUploadEnabled.value = !dataUploadEnabled.value
  store.showToast(dataUploadEnabled.value ? '已开启数据上传' : '已关闭数据上传')
}

const syncRideStatus = () => {
  if (store.rideStatus === 'idle') {
    return
  }

  if (isRidePaused.value) {
    store.pauseRideSession()
    return
  }

  store.resumeRideSession()
}

const consumePendingAction = async () => {
  const action = typeof route.query.action === 'string' ? route.query.action : ''

  if (action === 'end') {
    endDialogVisible.value = true
  }

  if (action === 'mark') {
    store.showToast('已添加打点标记')
  }

  if (action === 'pause' && !isRidePaused.value) {
    handlePause()
  }

  if (action === 'resume' && isRidePaused.value) {
    handlePause()
  }

  if (!action) {
    return
  }

  await router.replace({
    path: '/data/live',
  })
}

onMounted(() => {
  isPaused.value = store.rideStatus === 'paused'
  if (store.rideStatus !== 'idle') {
    startRideTimer()
    void consumePendingAction()
  }
})

onBeforeUnmount(() => {
  window.clearInterval(rideTimer)
})

watch(
  () => route.query.action,
  () => {
    void consumePendingAction()
  },
)

watch(
  isRidePaused,
  () => {
    syncRideStatus()
  },
)
</script>

<template>
  <AppShell>
    <div class="relative h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <header class="app-page-nav border-b border-line bg-white px-4 pb-2 pt-2">
        <div class="min-h-12 flex items-center justify-between gap-3">
          <div class="min-w-0 flex flex-1 items-center gap-2">
            <button
              class="app-icon-button shrink-0 cursor-pointer"
              type="button"
              aria-label="返回"
              title="返回"
              @click="router.back()"
            >
              <img :src="arrowLeftIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
            </button>
            <h1 class="app-page-title min-w-0 flex-1 text-[22px]">实时骑行</h1>
          </div>
          <button
            class="app-icon-button shrink-0 cursor-pointer"
            type="button"
            aria-label="骑行设置"
            title="骑行设置"
            @click="settingsPageVisible = true"
          >
            <img :src="settingsIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
          </button>
        </div>
      </header>

      <main class="relative min-h-0 flex-1 overflow-y-auto app-scroll-area">
        <section class="pt-2">
            <div class="relative h-[58vh] min-h-[440px] overflow-hidden border-y border-line bg-[#edf2f6]">
              <div class="absolute inset-0 overflow-hidden bg-[#edf2f6]">
                <img
                  :src="mapBackground"
                  alt=""
                  class="h-full w-full select-none object-cover transition-transform duration-200"
                  :style="mapScaleStyle"
                  draggable="false"
                >
              </div>

              <div class="absolute left-[24%] top-[32%] -translate-x-1/2 -translate-y-1/2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-#22c55e text-[12px] font-700 text-white shadow-[0_10px_24px_rgba(34,197,94,0.28)]">起</div>
                <div class="mt-2 max-w-40 truncate rounded-full bg-white px-3 py-1 text-[12px] font-600 text-#1f2322 shadow-[0_8px_18px_rgba(17,24,39,0.12)]">{{ rideStartPoint }}</div>
              </div>

              <div class="absolute right-[20%] top-[68%] translate-x-1/2 -translate-y-1/2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-#ef4444 text-[12px] font-700 text-white shadow-[0_10px_24px_rgba(239,68,68,0.28)]">终</div>
                <div class="mt-2 max-w-40 truncate rounded-full bg-white px-3 py-1 text-[12px] font-600 text-#1f2322 shadow-[0_8px_18px_rgba(17,24,39,0.12)]">{{ rideEndPoint }}</div>
              </div>

              <div v-if="hasRideStarted" class="absolute left-4 right-4 top-4 rounded-lg bg-white/94 p-4 shadow-float backdrop-blur-md">
                <div class="flex items-start gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center">
                    <img :src="turnLeftIcon" alt="" class="h-7 w-7 bg-transparent object-contain" draggable="false">
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[16px] font-700 tracking-[-0.02em] text-#1f2322">{{ navTipText }}</p>
                    <p class="mt-1 text-[13px] text-#6b7280">剩余距离：{{ Math.max(0.8, 3.2 - distanceKm).toFixed(1) }}km · 预计{{ Math.max(8, 15 - Math.floor(distanceKm / 1.2)) }}分钟</p>
                  </div>
                </div>
              </div>

              <div v-if="hasRideStarted" class="absolute bottom-4 left-4 right-4 flex gap-4">
                <button
                  class="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-lg text-[16px] font-700 shadow-float backdrop-blur-md outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500"
                  :class="isRidePaused ? 'bg-brand-500 text-white hover:bg-brand-600' : 'bg-white/94 text-#374151 hover:bg-white'"
                  type="button"
                  @click="handlePause"
                >
                  <img :src="pauseButtonIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
                  <span>{{ pauseButtonLabel }}</span>
                </button>
                <button
                  class="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-lg bg-#ef4444/92 text-[16px] font-700 text-white shadow-float backdrop-blur-md outline-none transition hover:bg-#ef4444 focus-visible:ring-2 focus-visible:ring-red-300"
                  type="button"
                  @click="endDialogVisible = true"
                >
                  <img :src="stopWhiteIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
                  <span>结束骑行</span>
                </button>
              </div>

              <div v-else class="absolute bottom-4 left-4 right-4">
                <button
                  class="app-primary-button flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg text-[16px]"
                  type="button"
                  :disabled="!canBeginRide"
                  @click="handleBeginRide"
                >
                  <img :src="playWhiteIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
                  <span>开始骑行</span>
                </button>
              </div>

              <div class="absolute bottom-20 right-5 z-10 flex flex-col gap-3">
                <button
                  class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[20px] font-700 text-#374151 shadow-[0_12px_24px_rgba(17,24,39,0.14)] outline-none transition hover:bg-#f8fafc focus-visible:ring-2 focus-visible:ring-brand-500"
                  type="button"
                  aria-label="放大地图"
                  title="放大地图"
                  @click="handleZoomIn"
                >
                  <img :src="mapPlusIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
                </button>
                <button
                  class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[22px] font-700 text-#374151 shadow-[0_12px_24px_rgba(17,24,39,0.14)] outline-none transition hover:bg-#f8fafc focus-visible:ring-2 focus-visible:ring-brand-500"
                  type="button"
                  aria-label="缩小地图"
                  title="缩小地图"
                  @click="handleZoomOut"
                >
                  <img :src="mapMinusIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
                </button>
                <button
                  class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-#374151 shadow-[0_12px_24px_rgba(17,24,39,0.14)] outline-none transition hover:bg-#f8fafc focus-visible:ring-2 focus-visible:ring-brand-500"
                  type="button"
                  aria-label="定位当前位置"
                  title="定位当前位置"
                  @click="handleLocate"
                >
                  <img :src="mapLocateIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
                </button>
                <button
                  class="flex h-11 w-11 items-center justify-center rounded-full shadow-[0_12px_24px_rgba(17,24,39,0.14)] outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500"
                  :class="mapMode === 'satellite' ? 'bg-brand-500 text-white hover:bg-brand-600' : 'bg-white text-ink hover:bg-soft'"
                  type="button"
                  :aria-label="mapMode === 'satellite' ? '切换到标准地图' : '切换到卫星地图'"
                  :title="mapMode === 'satellite' ? '切换到标准地图' : '切换到卫星地图'"
                  @click="toggleMapMode"
                >
                  <img :src="mapLayersButtonIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
                </button>
              </div>
            </div>
        </section>

        <section class="border-b border-line bg-white">
          <div>
            <div class="grid grid-cols-3 divide-x divide-line px-4 py-5">
            <div class="text-center">
              <p class="app-metric-value text-[28px] font-700 text-brand-500">{{ formattedCurrentSpeed }}</p>
              <p class="mt-1 text-[12px] text-#6b7280">km/h</p>
            </div>
            <div class="text-center">
              <p class="app-metric-value text-[28px] font-700 text-ink">{{ formattedDistance }}</p>
              <p class="mt-1 text-[12px] text-#6b7280">km</p>
            </div>
            <div class="text-center">
              <p class="app-metric-value text-[28px] font-700 text-ink">{{ ridingMinutes }}</p>
              <p class="mt-1 text-[12px] text-#6b7280">min</p>
            </div>
          </div>

            <div
              class="grid border-t border-line px-4 py-5"
              :class="hasFrontDerailleur ? 'grid-cols-2 divide-x divide-line' : 'grid-cols-1'"
            >
              <div v-if="hasFrontDerailleur" class="text-center">
                <p class="app-metric-value text-[24px] font-700 tabular-nums text-ink">{{ frontGear }}/{{ frontGearTotal }}</p>
                <p class="mt-1 text-[12px] text-#6b7280">前拨</p>
              </div>
              <div class="text-center">
                <p class="app-metric-value text-[24px] font-700 tabular-nums text-brand-500">{{ rearGear }}/{{ rearGearTotal }}</p>
                <p class="mt-1 text-[12px] text-#6b7280">后拨</p>
              </div>
            </div>

            <div class="border-t border-line px-4 py-5">
              <h3 class="text-[16px] font-700 text-#1f2322">路线详情</h3>

              <div class="app-list-group mt-3">
                <button
                  class="app-list-row w-full gap-3 text-left outline-none transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                  type="button"
                  aria-label="设置骑行起点"
                  @click="openRoutePointEditor('start')"
                >
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-#22c55e/12 text-[14px] font-700 text-#22c55e">起</div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[14px] font-600 text-#1f2322">起点：{{ rideStartPoint }}</p>
                  </div>
                  <PencilLine :size="17" class="shrink-0 text-muted" :stroke-width="2" />
                </button>

                <button
                  class="app-list-row w-full gap-3 text-left outline-none transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                  type="button"
                  aria-label="设置骑行终点"
                  @click="openRoutePointEditor('end')"
                >
                  <div class="flex h-9 w-9 items-center justify-center rounded-full bg-#ef4444/12 text-[14px] font-700 text-#ef4444">终</div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[14px] font-600 text-#1f2322">终点：{{ rideEndPoint }}</p>
                  </div>
                  <PencilLine :size="17" class="shrink-0 text-muted" :stroke-width="2" />
                </button>
              </div>

              <div class="app-metric-panel mt-4 grid grid-cols-3 gap-px bg-line">
                <div v-for="item in liveMetricItems" :key="item.key" class="min-h-18 bg-white px-2 py-3 text-center">
                  <p class="text-[11px] font-600 text-muted">{{ item.label }}</p>
                  <p class="mt-2 max-w-full whitespace-nowrap text-[17px] font-700 tabular-nums" :class="item.tone">
                    {{ item.value }}<span v-if="item.unit" class="ml-1 text-[9px] font-600 text-muted">{{ item.unit }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section
        v-if="settingsPageVisible"
        class="absolute inset-0 z-30 flex flex-col homepage-surface"
      >
        <IosStatusBar />
        <header class="app-page-nav border-b border-line bg-white px-4 pb-2 pt-2">
          <div class="min-h-12 flex items-center gap-2">
            <button
              class="app-icon-button shrink-0 cursor-pointer"
              type="button"
              aria-label="返回实时骑行"
              title="返回实时骑行"
              @click="settingsPageVisible = false"
            >
              <img :src="arrowLeftIcon" alt="" class="h-5 w-5 bg-transparent object-contain" draggable="false">
            </button>
            <h2 class="app-page-title min-w-0 flex-1 text-[22px]">设置</h2>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto app-scroll-area px-4 py-4">
          <div class="space-y-4">
            <section class="app-list-group">
              <h3 class="px-4 pt-4 text-[16px] font-700 text-#1f2322">骑行设置</h3>

              <div class="mt-2">
                <button
                  class="app-list-row w-full justify-between text-left text-[15px] text-#374151 outline-none transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
                  type="button"
                  @click="voiceBroadcastSheetVisible = true"
                >
                  <span>运动播报</span>
                  <span class="flex items-center gap-2 text-[13px] font-600 text-#6b7280">
                    {{ voiceBroadcastLabel }}
                    <img :src="chevronRightIcon" alt="" class="h-4 w-4 bg-transparent object-contain" draggable="false">
                  </span>
                </button>

                <button
                  class="app-list-row w-full justify-between text-left text-[15px] text-#374151 outline-none transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
                  type="button"
                  @click="navBroadcastSheetVisible = true"
                >
                  <span>导航播报</span>
                  <span class="flex items-center gap-2 text-[13px] font-600 text-#6b7280">
                    {{ navBroadcastLabel }}
                    <img :src="chevronRightIcon" alt="" class="h-4 w-4 bg-transparent object-contain" draggable="false">
                  </span>
                </button>

                <div class="app-list-row justify-between">
                  <span class="text-[15px] text-#374151">自动暂停</span>
                  <button
                    class="relative h-7 w-12 rounded-full transition"
                    :class="autoPauseEnabled ? 'bg-brand-500' : 'bg-#d1d5db'"
                    type="button"
                    @click="toggleAutoPause"
                  >
                    <span
                      class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
                      :class="autoPauseEnabled ? 'left-6' : 'left-1'"
                    />
                  </button>
                </div>

                <div class="border-t border-line px-4 py-4">
                  <p class="text-[15px] font-600 text-#374151">记圈设置</p>
                  <div class="mt-3 flex gap-4">
                    <label class="flex items-center gap-2 text-[14px] text-#4b5563">
                      <input v-model="lapMode" class="accent-brand-500" type="radio" value="distance">
                      <span>距离记圈</span>
                    </label>
                    <label class="flex items-center gap-2 text-[14px] text-#4b5563">
                      <input v-model="lapMode" class="accent-brand-500" type="radio" value="time">
                      <span>时间记圈</span>
                    </label>
                  </div>
                  <div class="mt-3 flex items-center gap-2">
                    <input
                      v-model="lapValue"
                      class="flex-1 rounded-lg border border-line bg-soft px-3 py-2.5 text-[14px] text-ink outline-none focus:border-brand-500"
                      :placeholder="lapInputPlaceholder"
                      type="number"
                    >
                    <span class="w-10 text-right text-[14px] text-#6b7280">{{ lapUnit }}</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="app-list-group">
              <h3 class="px-4 pt-4 text-[16px] font-700 text-#1f2322">数据与路线</h3>

              <div class="mt-2">
                <div class="app-list-row justify-between">
                  <span class="text-[15px] text-#374151">数据上传</span>
                  <button
                    class="relative h-7 w-12 rounded-full transition"
                    :class="dataUploadEnabled ? 'bg-brand-500' : 'bg-#d1d5db'"
                    type="button"
                    @click="toggleDataUpload"
                  >
                    <span
                      class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
                      :class="dataUploadEnabled ? 'left-6' : 'left-1'"
                    />
                  </button>
                </div>

              </div>
            </section>
          </div>
        </div>
      </section>

      <div
        v-if="routePointEditorVisible"
        class="absolute inset-0 z-50 flex items-end bg-black/36 px-3 pt-20 backdrop-blur-[2px]"
        style="padding-bottom: calc(12px + var(--app-safe-bottom));"
        @click.self="closeRoutePointEditor"
      >
        <section class="app-dialog-surface app-sheet w-full border border-line p-5" role="dialog" aria-modal="true" :aria-label="routePointEditorTitle">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-[18px] font-700 text-ink">{{ routePointEditorTitle }}</h3>
            <button
              class="app-icon-button h-10 w-10 shrink-0"
              type="button"
              aria-label="关闭地点设置"
              :disabled="isLocatingRoutePoint"
              @click="closeRoutePointEditor"
            >
              <X :size="18" :stroke-width="2.2" />
            </button>
          </div>

          <button
            class="mt-4 min-h-12 w-full flex items-center justify-center gap-2 rounded-lg border border-brand-500 bg-brand-50 px-4 text-[14px] font-700 text-brand-600 outline-none transition hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-wait disabled:opacity-60"
            type="button"
            :disabled="isLocatingRoutePoint"
            @click="locateRoutePoint"
          >
            <LocateFixed :size="19" :stroke-width="2.2" />
            <span>{{ isLocatingRoutePoint ? '定位中...' : '定位当前位置' }}</span>
          </button>

          <div class="my-4 flex items-center gap-3" aria-hidden="true">
            <span class="h-px flex-1 bg-line" />
            <span class="text-[12px] text-muted">或手动输入</span>
            <span class="h-px flex-1 bg-line" />
          </div>

          <label class="block">
            <span class="mb-2 block text-[13px] font-600 text-ink">地点</span>
            <input
              v-model="routePointDraft"
              class="app-control min-h-12 w-full border border-line bg-white px-3 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/16"
              :placeholder="routePointInputPlaceholder"
              maxlength="50"
              type="text"
              @keyup.enter="saveRoutePoint"
            >
          </label>

          <div class="mt-5 grid grid-cols-2 gap-3">
            <button
              class="min-h-12 rounded-lg border border-line bg-white text-[14px] font-700 text-ink transition hover:bg-soft"
              type="button"
              :disabled="isLocatingRoutePoint"
              @click="closeRoutePointEditor"
            >
              取消
            </button>
            <button
              class="app-primary-button min-h-12 text-[14px]"
              type="button"
              :disabled="isLocatingRoutePoint"
              @click="saveRoutePoint"
            >
              保存
            </button>
          </div>
        </section>
      </div>

      <div
        v-if="endDialogVisible"
        class="absolute inset-0 z-40 flex items-center justify-center bg-black/50 px-6"
      >
        <div class="app-dialog-surface app-sheet w-full max-w-[320px] p-6 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-#fff0ef">
            <img :src="stopDangerIcon" alt="" class="h-6 w-6 bg-transparent object-contain" draggable="false">
          </div>
          <h3 class="mt-4 text-[20px] font-700 tracking-[-0.02em] text-#1f2322">确认结束导航？</h3>
          <p class="mt-2 text-[14px] leading-[1.6] text-#6b7280">结束后将停止记录骑行数据，并继续跳转到骑行详情页。</p>
          <div class="mt-6 flex gap-3">
            <button
              class="app-control flex-1 bg-#f3f4f6 px-4 py-3 text-[15px] font-700 text-#374151 outline-none transition hover:bg-#e5e7eb focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="endDialogVisible = false"
            >
              取消
            </button>
            <button
              class="app-control flex-1 bg-#ef4444 px-4 py-3 text-[15px] font-700 text-white outline-none transition hover:bg-#dc2626 focus-visible:ring-2 focus-visible:ring-red-300"
              type="button"
              @click="handleEndRide"
            >
              确认结束
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppOptionSheet
      :options="voiceSettingOptions"
      :selected-key="voiceBroadcastEnabled ? 'on' : 'off'"
      :visible="voiceBroadcastSheetVisible"
      description="运动播报会在骑行过程中提供关键数据语音提示。"
      title="运动播报"
      @close="voiceBroadcastSheetVisible = false"
      @select="applyVoiceBroadcast($event === 'on')"
    />
    <AppOptionSheet
      :options="navSettingOptions"
      :selected-key="navBroadcastEnabled ? 'on' : 'off'"
      :visible="navBroadcastSheetVisible"
      description="导航播报会在路线骑行中提供转向和到达提醒。"
      title="导航播报"
      @close="navBroadcastSheetVisible = false"
      @select="applyNavBroadcast($event === 'on')"
    />
    <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
  </AppShell>
</template>
