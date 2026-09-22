<script setup lang="ts">
import { Bluetooth, ChevronRight, Ellipsis, Gauge, Grid2X2, Languages, Mountain, Power, RefreshCw, RotateCcw, Settings, SlidersHorizontal, Trash2, TriangleAlert, Unplug } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppDialog from '../components/feedback/AppDialog.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { firmwareInfoMock, primaryDeviceId, trainerRealtimeMock } from '../data/device'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'

type TrainerTabKey = 'settings' | 'mode' | 'calibration'
type DerailleurTabKey = 'rear' | 'front' | 'controller'
type SeatpostTabKey = 'height' | 'preset' | 'advanced'
type ComputerRoutePath = 'sensors' | 'altitude-calibration' | 'page-settings' | 'alert-settings' | 'power-management' | 'language' | 'other-settings' | 'firmware'
type DeviceSettingEntry = {
  key: string
  title: string
  description: string
  icon: typeof SlidersHorizontal
  danger?: boolean
  routePath?: 'firmware' | 'page-settings' | 'alert-settings' | 'power-management' | 'language'
}
type ComputerMenuEntry = {
  key: string
  title: string
  icon: typeof Settings
  tone: string
  routePath?: ComputerRoutePath
  action?: 'reset' | 'erase' | 'unbind'
  danger?: boolean
}

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const { computerSettings, computerSync } = storeToRefs(deviceStore)

const activeTrainerTab = ref<TrainerTabKey>('mode')
const activeDerailleurTab = ref<DerailleurTabKey>('rear')
const activeSeatpostTab = ref<SeatpostTabKey>('height')
const unbindDialogVisible = ref(false)
const computerResetDialogVisible = ref(false)
const computerEraseDialogVisible = ref(false)
const trainerResetDialogVisible = ref(false)
const trainerFaultDialogVisible = ref(false)
const seatpostResetDialogVisible = ref(false)
const virtualInertiaEnabled = ref(false)
const ledLightEnabled = ref(false)
const roadFeelEnabled = ref(false)
const resistanceValue = ref(0)
const constantPower = ref(0)
const trainerMode = ref<'resistance' | 'power'>('resistance')
const rearGear = ref(3)
const frontGear = ref(1)
const rearMicroAdjust = ref(0)
const frontMicroAdjust = ref(0)
const leftControllerTarget = ref<'front' | 'rear'>('front')
const rightControllerTarget = ref<'front' | 'rear'>('rear')
const seatpostUnlocked = ref(false)
const seatpostHeight = ref(75)
const seatpostSavedHeight = ref(75)
const seatpostSpeed = ref<'high' | 'medium' | 'low'>('medium')
const seatpostAutoMemory = ref(false)
const seatpostPresets = ref([
  { id: 'preset-climb', label: '爬坡位置', height: 84 },
  { id: 'preset-flat', label: '平路位置', height: 72 },
  { id: 'preset-rest', label: '休闲位置', height: 58 },
])

const deviceId = computed(() => typeof route.params.deviceId === 'string' ? route.params.deviceId : primaryDeviceId)
const device = computed(() => deviceStore.getDeviceById(deviceId.value))
const isTrainer = computed(() => device.value?.kind === 'trainer')
const isComputer = computed(() => device.value?.kind === 'computer')
const isDerailleur = computed(() => device.value?.kind === 'derailleur')
const isSeatpost = computed(() => device.value?.kind === 'seatpost')
const derailleurUsageDurationMap: Record<string, string> = {
  'device-derailleur-e12': '128小时',
  'device-derailleur-e11': '86小时',
}
const seatpostUsageDurationMap: Record<string, string> = {
  'device-seatpost-s1': '64小时',
  'device-seatpost-s2': '41小时',
}
const derailleurHeaderMetrics = computed(() => {
  if (!device.value || !isDerailleur.value) {
    return []
  }

  return [
    { label: '连接状态', value: device.value.statusText, tone: device.value.connected ? 'success' : 'warning' },
    { label: '使用时长', value: derailleurUsageDurationMap[device.value.id] ?? '128小时', tone: undefined },
    { label: '版本号', value: device.value.firmware, tone: undefined },
    { label: '设备ID', value: device.value.deviceId, tone: undefined },
  ]
})
const trainerHeaderTitle = computed(() => {
  if (!device.value || !isTrainer.value) {
    return ''
  }

  return device.value.name.replace(' ', ' • ')
})
const trainerHeaderMetrics = computed(() => {
  if (!device.value || !isTrainer.value) {
    return []
  }

  return [
    { label: '连接状态', value: device.value.statusText, tone: device.value.connected ? 'success' : 'warning' },
    { label: '当前温度', value: trainerRealtimeMock.temperature, tone: undefined },
    { label: '版本号', value: device.value.firmware, tone: undefined },
    { label: '设备ID', value: device.value.deviceId, tone: undefined },
  ]
})
const seatpostHeaderTitle = computed(() => {
  if (!device.value || !isSeatpost.value) {
    return ''
  }

  return '蓝图电子升降坐管'
})
const seatpostHeaderMetrics = computed(() => {
  if (!device.value || !isSeatpost.value) {
    return []
  }

  return [
    { label: '连接状态', value: device.value.statusText, tone: device.value.connected ? 'success' : 'warning' },
    { label: '使用时长', value: seatpostUsageDurationMap[device.value.id] ?? '64小时', tone: undefined },
    { label: '版本号', value: device.value.firmware, tone: undefined },
    { label: '设备ID', value: device.value.deviceId, tone: undefined },
  ]
})
const trainerHasFault = computed(() => isTrainer.value && device.value?.extraStatus?.includes('故障'))
const trainerCanAdjustResistance = computed(() => trainerMode.value === 'resistance')
const trainerCanAdjustPower = computed(() => trainerMode.value === 'power')
const seatpostHasPendingChanges = computed(() => seatpostHeight.value !== seatpostSavedHeight.value)
const detailNavTitle = computed(() => (isDerailleur.value || isTrainer.value || isSeatpost.value || isComputer.value ? '设备详情' : device.value?.name ?? '设备详情'))
const languageLabels = {
  system: '跟随系统',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
  'es-ES': 'Español',
  'ko-KR': '한국어',
} as const
const computerEphemerisItem = computed(() => computerSync.value.items.find((item) => item.key === 'ephemeris'))
const computerEphemerisStatus = computed(() => {
  if (computerEphemerisItem.value?.status === 'syncing') {
    return '同步中'
  }
  if (computerEphemerisItem.value?.status === 'synced') {
    return '已同步'
  }
  if (computerSync.value.ephemerisCached) {
    return '已缓存'
  }
  return '待同步'
})
const computerMenuEntries: ComputerMenuEntry[] = [
  { key: 'sensors', title: '传感器', icon: Bluetooth, tone: 'bg-[#E9FBF1] text-[#1AA66A]', routePath: 'sensors' },
  { key: 'altitude', title: '高度校准', icon: Mountain, tone: 'bg-[#FFF3E6] text-[#F08A24]', routePath: 'altitude-calibration' },
  { key: 'pages', title: '页面设置', icon: Grid2X2, tone: 'bg-[#E5FAF6] text-[#28B6A6]', routePath: 'page-settings' },
  { key: 'alerts', title: '警示设置', icon: TriangleAlert, tone: 'bg-[#FFE9EA] text-[#E34D59]', routePath: 'alert-settings' },
  { key: 'power', title: '电源管理', icon: Power, tone: 'bg-[#FFF8D8] text-[#E6B315]', routePath: 'power-management' },
  { key: 'language', title: '语言设置', icon: Languages, tone: 'bg-[#EEF0FF] text-[#6366D9]', routePath: 'language' },
  { key: 'other', title: '其他设置', icon: Settings, tone: 'bg-[#E8F8FB] text-[#22A8BC]', routePath: 'other-settings' },
  { key: 'firmware', title: '固件检测', icon: RefreshCw, tone: 'bg-[#F4EAFE] text-[#9A55D8]', routePath: 'firmware' },
  { key: 'reset', title: '恢复出厂设置', icon: RotateCcw, tone: 'bg-[#FFE9EA] text-[#E34D59]', action: 'reset', danger: true },
  { key: 'erase', title: '抹除数据', icon: Trash2, tone: 'bg-[#FFE9EA] text-[#E34D59]', action: 'erase', danger: true },
  { key: 'unbind', title: '解除绑定', icon: Unplug, tone: 'bg-[#F1F3F5] text-[#66727A]', action: 'unbind', danger: true },
]

const deviceSettingEntries = computed<DeviceSettingEntry[]>(() => {
  if (isDerailleur.value) {
    return [
      { key: 'password', title: '修改设备密码', description: '保护设备连接安全', icon: SlidersHorizontal },
      { key: 'speed-level', title: '速别设置', description: '支持 10 / 11 / 12 速切换', icon: Gauge },
      { key: 'shift-count', title: '换挡次数统计', description: device.value?.usage ?? '1256 次', icon: Bluetooth },
      { key: 'manual', title: '说明书', description: '查看电子变速器使用说明', icon: ChevronRight },
      { key: 'factory-reset', title: '恢复出厂设置', description: '清空调试与设定参数', icon: Power, danger: true },
    ]
  }

  if (isSeatpost.value) {
    return [
      { key: 'height-control', title: '高度调节', description: '支持上升、下降和当前行程查看', icon: Gauge },
      { key: 'preset-position', title: '预设位置', description: '保存常用坐姿位置并快速切换', icon: SlidersHorizontal },
      { key: 'advanced-settings', title: '高级设置', description: '调节速度、自动记忆和恢复出厂', icon: Power },
      { key: 'firmware', title: '固件检测', description: `当前 ${device.value?.firmware ?? firmwareInfoMock.currentVersion} / 最新 ${firmwareInfoMock.latestVersion}`, icon: ChevronRight, routePath: 'firmware' },
    ]
  }

  return [
    { key: 'firmware', title: '固件检测', description: `当前 ${device.value?.firmware ?? firmwareInfoMock.currentVersion} / 最新 ${firmwareInfoMock.latestVersion}`, icon: ChevronRight, routePath: 'firmware' },
    { key: 'page-settings', title: '页面设置', description: '管理码表页面与数据项布局', icon: SlidersHorizontal, routePath: 'page-settings' },
    { key: 'alert', title: '警示设置', description: '设置心率阈值与提醒方式', icon: TriangleAlert, routePath: 'alert-settings' },
    {
      key: 'power',
      title: '电源管理',
      description: `自动休眠${computerSettings.value.autoSleepEnabled ? '开启' : '关闭'} / 自动关机${computerSettings.value.autoShutdownEnabled ? '开启' : '关闭'}`,
      icon: Power,
      routePath: 'power-management',
    },
    {
      key: 'language',
      title: '语言设置',
      description: languageLabels[computerSettings.value.language],
      icon: Languages,
      routePath: 'language',
    },
  ]
})

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

const handleOpenSettingPage = (routePath: DeviceSettingEntry['routePath']) => {
  if (!device.value || !routePath) {
    return
  }

  void router.push(`/device/${device.value.id}/${routePath}`)
}

const handleSettingAction = (entry: DeviceSettingEntry) => {
  if (entry.routePath) {
    handleOpenSettingPage(entry.routePath)
    return
  }

  if (entry.key === 'password') {
    appStore.showToast('修改设备密码将在下一阶段开放')
    return
  }

  if (entry.key === 'speed-level') {
    appStore.showToast('当前已切换为 12 速设置')
    return
  }

  if (entry.key === 'height-control') {
    appStore.showToast('高度调节页将在下一阶段开放')
    return
  }

  if (entry.key === 'preset-position') {
    appStore.showToast('预设位置页将在下一阶段开放')
    return
  }

  if (entry.key === 'advanced-settings') {
    appStore.showToast('高级设置页将在下一阶段开放')
    return
  }

  if (entry.key === 'factory-reset') {
    appStore.showToast('恢复出厂设置将在下一阶段二次确认后执行')
    return
  }

  if (entry.key === 'manual') {
    appStore.showToast('说明书将在下一阶段提供文档页')
    return
  }

  appStore.showToast('当前功能已记录')
}

const handleComputerMenuAction = (entry: ComputerMenuEntry) => {
  if (!device.value) {
    return
  }

  if (entry.routePath) {
    void router.push(`/device/${device.value.id}/${entry.routePath}`)
    return
  }

  if (entry.action === 'reset') {
    requestComputerReset()
    return
  }

  if (entry.action === 'erase') {
    requestComputerErase()
    return
  }

  if (!device.value.connected) {
    appStore.showToast('当前码表尚未绑定')
    return
  }

  unbindDialogVisible.value = true
}

const handleOpenDerailleurSettings = () => {
  if (!device.value) {
    return
  }

  void router.push(`/device/${device.value.id}/derailleur-settings`)
}

const adjustRearGear = (delta: number) => {
  rearGear.value = Math.min(12, Math.max(1, rearGear.value + delta))
}

const adjustFrontGear = (delta: number) => {
  frontGear.value = Math.min(2, Math.max(1, frontGear.value + delta))
}

const adjustMicroTune = (target: 'rear' | 'front', delta: number) => {
  if (target === 'rear') {
    rearMicroAdjust.value = Math.min(10, Math.max(-10, rearMicroAdjust.value + delta))
    return
  }

  frontMicroAdjust.value = Math.min(10, Math.max(-10, frontMicroAdjust.value + delta))
}

const selectControllerTarget = (side: 'left' | 'right', target: 'front' | 'rear') => {
  if (side === 'left') {
    leftControllerTarget.value = target
    rightControllerTarget.value = target === 'front' ? 'rear' : 'front'
  }
  else {
    rightControllerTarget.value = target
    leftControllerTarget.value = target === 'front' ? 'rear' : 'front'
  }

  appStore.showToast(`手把控制已切换：左手把 ${leftControllerTarget.value === 'front' ? '前拨' : '后拨'}，右手把 ${rightControllerTarget.value === 'front' ? '前拨' : '后拨'}`)
}

const selectTrainerMode = (mode: 'resistance' | 'power') => {
  trainerMode.value = mode
  appStore.showToast(`已切换到${mode === 'resistance' ? '阻力模式' : '功率模式'}`)
}

const resetTrainerSettingsToFactory = () => {
  trainerMode.value = 'resistance'
  resistanceValue.value = 0
  constantPower.value = 0
  virtualInertiaEnabled.value = false
  ledLightEnabled.value = false
  roadFeelEnabled.value = false
}

const confirmTrainerReset = () => {
  resetTrainerSettingsToFactory()
  trainerResetDialogVisible.value = false
  appStore.showToast('骑行台已恢复出厂设置')
}

const unlockSeatpost = () => {
  seatpostUnlocked.value = true
  appStore.showToast('升降坐管已解锁，可开始调节高度')
}

const saveSeatpostHeight = () => {
  if (!seatpostUnlocked.value) {
    appStore.showToast('请先点击解锁')
    return
  }

  seatpostSavedHeight.value = seatpostHeight.value
  appStore.showToast(`已保存当前高度 ${seatpostHeight.value}%`)
}

const adjustSeatpostHeight = (delta: number) => {
  if (!seatpostUnlocked.value) {
    appStore.showToast('请先点击解锁')
    return
  }

  seatpostHeight.value = Math.min(100, Math.max(0, seatpostHeight.value + delta))
}

const applySeatpostPreset = (height: number, label: string) => {
  seatpostHeight.value = height
  appStore.showToast(`已切换到${label}`)
}

const addSeatpostPreset = () => {
  const nextIndex = seatpostPresets.value.length + 1
  seatpostPresets.value.push({
    id: `preset-custom-${nextIndex}`,
    label: `自定义${nextIndex}`,
    height: seatpostHeight.value,
  })
  appStore.showToast(`已添加预设 ${seatpostHeight.value}%`)
}

const resetSeatpostSettings = () => {
  seatpostUnlocked.value = false
  seatpostHeight.value = 75
  seatpostSavedHeight.value = 75
  seatpostSpeed.value = 'medium'
  seatpostAutoMemory.value = false
  seatpostResetDialogVisible.value = false
  appStore.showToast('电子升降坐管已恢复默认设置')
}

const syncComputerDetails = () => {
  if (!isComputer.value) {
    return
  }

  void deviceStore.syncComputer(deviceId.value, navigator.onLine)
}

const handleNetworkChange = () => {
  syncComputerDetails()
}

const requestComputerReset = () => {
  if (!device.value?.connected) {
    appStore.showToast('请先连接码表，再恢复出厂设置')
    return
  }

  computerResetDialogVisible.value = true
}

const requestComputerErase = () => {
  if (!device.value?.connected) {
    appStore.showToast('请先连接码表，再抹除设备数据')
    return
  }

  computerEraseDialogVisible.value = true
}

const confirmComputerReset = () => {
  deviceStore.resetComputerSettings(Boolean(device.value?.connected))
  computerResetDialogVisible.value = false
  appStore.showToast('码表设置已恢复为出厂默认值')
}

const confirmComputerErase = () => {
  deviceStore.eraseComputerData(Boolean(device.value?.connected))
  computerEraseDialogVisible.value = false
  appStore.showToast('码表设置、骑行轨迹和路书已抹除')
}

const handleConfirmUnbind = () => {
  if (!device.value) {
    return
  }

  const targetId = device.value.id
  const targetName = device.value.name
  const result = deviceStore.unbindDevice(targetId)

  if (!result) {
    appStore.showToast('解绑失败，请稍后重试')
    unbindDialogVisible.value = false
    return
  }

  unbindDialogVisible.value = false
  appStore.showToast(`已解绑设备：${targetName}`)
  void router.push('/device')
}

onMounted(() => {
  syncComputerDetails()
  window.addEventListener('online', handleNetworkChange)
  window.addEventListener('offline', handleNetworkChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', handleNetworkChange)
  window.removeEventListener('offline', handleNetworkChange)
})
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <PageNavBar
          class="-mx-4"
          :title="detailNavTitle"
          @back="router.back()"
        />

        <template v-if="device">
          <section v-if="isComputer" class="app-card p-3">
            <div class="flex items-center gap-3">
              <img :src="device.image" :alt="device.name" class="h-22 w-22 shrink-0 rounded-[6px] object-contain" />
              <div class="min-w-0">
                <h2 class="text-[18px] font-700 leading-tight text-ink">{{ device.name }}</h2>
                <p class="mt-2 break-all text-[11px] font-mono text-muted">设备ID: {{ device.deviceId }}</p>
              </div>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2">
              <div class="min-h-17 rounded-[6px] bg-[#F8F9FB] px-3 py-3">
                <p class="text-[11px] text-muted">固件版本</p>
                <p class="mt-1 text-[13px] font-700 text-ink">{{ device.firmware }}</p>
              </div>
              <div class="min-h-17 rounded-[6px] bg-[#F8F9FB] px-3 py-3">
                <p class="text-[11px] text-muted">电量</p>
                <p class="mt-1 inline-flex items-center gap-1 text-[13px] font-700" :class="device.connected ? 'text-[#15935F]' : 'text-[#D97706]'">
                  <span class="h-2 w-4 rounded-[2px] border border-current p-[1px]"><span class="block h-full rounded-[1px] bg-current" /></span>
                  {{ device.battery }}
                </p>
              </div>
              <div class="min-h-17 rounded-[6px] bg-[#F8F9FB] px-3 py-3">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-[11px] text-muted">星历状态</p>
                  <button
                    class="app-touch-target -my-3 inline-flex min-w-0 items-center gap-1 px-1 text-[11px] font-700 text-[#246BFE] disabled:opacity-55"
                    type="button"
                    aria-label="刷新星历"
                    :disabled="computerSync.status === 'syncing'"
                    @click="syncComputerDetails"
                  >
                    <RefreshCw :size="12" :stroke-width="2.4" :class="computerSync.status === 'syncing' ? 'animate-spin' : ''" />
                    刷新
                  </button>
                </div>
                <p class="mt-1 text-[13px] font-700" :class="computerEphemerisStatus === '已同步' || computerEphemerisStatus === '已缓存' ? 'text-[#246BFE]' : 'text-[#D97706]'">
                  {{ computerEphemerisStatus }}
                </p>
              </div>
              <div class="min-h-17 rounded-[6px] bg-[#F8F9FB] px-3 py-3">
                <p class="text-[11px] text-muted">蓝牙状态</p>
                <p class="mt-1 text-[13px] font-700" :class="device.connected ? 'text-[#15935F]' : 'text-[#D97706]'">
                  {{ device.connected ? '已连接' : '未连接' }}
                </p>
              </div>
            </div>
          </section>

          <section v-else-if="isTrainer" class="app-card p-5">
            <div class="flex items-center justify-between gap-3">
              <h2 class="app-section-title">{{ trainerHeaderTitle }}</h2>
              <button
                v-if="trainerHasFault"
                class="inline-flex items-center gap-1 rounded-full bg-[#FFF1F1] px-3 py-1.5 app-meta-text font-700 text-[#D84C4C]"
                type="button"
                @click="trainerFaultDialogVisible = true"
              >
                <TriangleAlert :size="14" :stroke-width="2.2" />
                故障
              </button>
              <span
                v-else
                class="rounded-full px-4 py-1.5 app-meta-text font-700"
                :class="device.connected ? 'bg-[#EDF9F3] text-[#15935F]' : 'bg-[#FFF3E8] text-[#D97706]'"
              >
                {{ device.connected ? '正常' : '离线' }}
              </span>
            </div>

            <img :src="device.image" :alt="device.name" class="app-media mt-4 h-40 w-full object-cover" />

            <div class="app-metric-panel mt-4 grid grid-cols-2 gap-px bg-line">
              <div
                v-for="metric in trainerHeaderMetrics"
                :key="metric.label"
                class="bg-white px-4 py-3"
              >
                <p class="app-meta-text text-muted">{{ metric.label }}</p>
                <p
                  class="mt-1 app-subsection-title"
                  :class="metric.tone === 'success' ? 'text-[#15935F]' : metric.tone === 'warning' ? 'text-[#D97706]' : 'text-ink'"
                >
                  {{ metric.value }}
                </p>
              </div>
            </div>
          </section>

          <section v-else-if="isSeatpost" class="app-card mt-4 p-5">
            <h2 class="app-section-title">{{ seatpostHeaderTitle }}</h2>

            <img :src="device.image" :alt="device.name" class="app-media mt-4 h-40 w-full object-cover" />

            <div class="app-metric-panel mt-4 grid grid-cols-2 gap-px bg-line">
              <div
                v-for="metric in seatpostHeaderMetrics"
                :key="metric.label"
                class="bg-white px-4 py-3"
              >
                <p class="app-meta-text text-muted">{{ metric.label }}</p>
                <p
                  class="mt-1 app-subsection-title"
                  :class="metric.tone === 'success' ? 'text-[#15935F]' : metric.tone === 'warning' ? 'text-[#D97706]' : 'text-ink'"
                >
                  {{ metric.value }}
                </p>
              </div>
            </div>
          </section>

          <section v-else-if="isDerailleur" class="app-card p-5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 class="app-section-title">蓝图电子变速器</h2>
              </div>
              <button
                class="h-11 w-11 shrink-0 flex items-center justify-center rounded-full bg-[#F7F8FA] text-muted ring-1 ring-black/4 transition hover:bg-[#F1F4F7] focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
                aria-label="进入电变设备设置"
                @click="handleOpenDerailleurSettings"
              >
                <Ellipsis :size="18" :stroke-width="2.2" />
              </button>
            </div>

            <img :src="device.image" :alt="device.name" class="app-media mt-4 h-40 w-full object-cover" />

            <div class="app-metric-panel mt-4 grid grid-cols-2 gap-px bg-line">
              <div
                v-for="metric in derailleurHeaderMetrics"
                :key="metric.label"
                class="bg-white px-4 py-3"
              >
                <p class="app-meta-text text-muted">{{ metric.label }}</p>
                <p
                  class="mt-1 app-card-title"
                  :class="metric.tone === 'brand'
                    ? 'text-brand-700'
                    : metric.tone === 'success'
                      ? 'text-[#15935F]'
                      : metric.tone === 'warning'
                        ? 'text-[#D97706]'
                        : 'text-ink'"
                >
                  {{ metric.value }}
                </p>
              </div>
            </div>
          </section>

          <section v-if="isComputer" class="app-card mt-3 overflow-hidden">
            <button
              v-for="entry in computerMenuEntries"
              :key="entry.key"
              class="flex min-h-15 w-full items-center gap-3 border-b border-line px-3.5 py-2.5 text-left transition last:border-b-0 hover:bg-[#FAFBFC] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#246BFE]"
              type="button"
              @click="handleComputerMenuAction(entry)"
            >
              <span class="h-9 w-9 flex shrink-0 items-center justify-center rounded-[6px]" :class="entry.tone">
                <component :is="entry.icon" :size="18" :stroke-width="2.3" />
              </span>
              <span class="min-w-0 flex-1 text-[14px] font-600" :class="entry.danger ? 'text-[#E34D59]' : 'text-ink'">{{ entry.title }}</span>
              <ChevronRight :size="17" :stroke-width="2.2" class="shrink-0 text-[#A5ADB5]" />
            </button>
          </section>

          <section v-else-if="isDerailleur" class="mt-4 space-y-4">
            <div class="app-card p-5">
              <div class="app-segmented grid grid-cols-3 gap-1">
                <button
                  :class="activeDerailleurTab === 'rear' ? 'bg-white text-brand-700 shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeDerailleurTab = 'rear'"
                >
                  后拨
                </button>
                <button
                  :class="activeDerailleurTab === 'front' ? 'bg-white text-brand-700 shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeDerailleurTab = 'front'"
                >
                  前拨
                </button>
                <button
                  :class="activeDerailleurTab === 'controller' ? 'bg-white text-brand-700 shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeDerailleurTab = 'controller'"
                >
                  控制器
                </button>
              </div>

              <div v-if="activeDerailleurTab === 'rear'" class="mt-5 space-y-4">
                <div class="rounded-lg bg-[#F7F8FA] px-4 py-5">
                  <p class="app-card-title text-ink">后拨设置</p>
                  <div class="mt-5 rounded-lg bg-white px-4 py-5">
                    <p class="app-body-text font-600 text-ink">换挡调节</p>
                    <div class="mt-4 flex items-center justify-between gap-4">
                      <button class="h-12 w-12 rounded-full bg-[#F5F7FA] text-[24px] text-brand-700 ring-1 ring-black/4" type="button" @click="adjustRearGear(-1)">-</button>
                      <p class="text-[24px] font-700 text-ink">{{ rearGear }} / 12</p>
                      <button class="h-12 w-12 rounded-full bg-[#F5F7FA] text-[24px] text-brand-700 ring-1 ring-black/4" type="button" @click="adjustRearGear(1)">+</button>
                    </div>
                  </div>

                  <div class="mt-4 rounded-lg bg-white px-4 py-5">
                    <p class="app-body-text font-600 text-ink">单档微调</p>
                    <div class="mt-4 flex items-center justify-between gap-3">
                      <button class="h-11 w-11 rounded-full bg-[#F5F7FA] text-[24px] text-brand-700 ring-1 ring-black/4" type="button" @click="adjustMicroTune('rear', -1)">-</button>
                      <div class="flex-1 px-2">
                        <p class="text-center app-body-text font-700 text-ink">微调数值: <span class="text-brand-700">{{ rearMicroAdjust >= 0 ? `+${rearMicroAdjust}` : rearMicroAdjust }}</span></p>
                        <div class="mt-3 h-2 rounded-full bg-[#E5E9F0]">
                          <div class="h-2 rounded-full bg-brand-500 transition" :style="{ width: `${((rearMicroAdjust + 10) / 20) * 100}%` }" />
                        </div>
                      </div>
                      <button class="h-11 w-11 rounded-full bg-[#F5F7FA] text-[24px] text-brand-700 ring-1 ring-black/4" type="button" @click="adjustMicroTune('rear', 1)">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="activeDerailleurTab === 'front'" class="mt-5 space-y-4">
                <div class="rounded-lg bg-[#F7F8FA] px-4 py-5">
                  <p class="app-card-title text-ink">前拨设置</p>
                  <div class="mt-5 rounded-lg bg-white px-4 py-5">
                    <p class="app-body-text font-600 text-ink">前拨档位</p>
                    <div class="mt-4 flex items-center justify-between gap-4">
                      <button class="h-12 w-12 rounded-full bg-[#F5F7FA] text-[24px] text-brand-700 ring-1 ring-black/4" type="button" @click="adjustFrontGear(-1)">-</button>
                      <p class="text-[24px] font-700 text-ink">{{ frontGear }} / 2</p>
                      <button class="h-12 w-12 rounded-full bg-[#F5F7FA] text-[24px] text-brand-700 ring-1 ring-black/4" type="button" @click="adjustFrontGear(1)">+</button>
                    </div>
                  </div>

                  <div class="mt-4 rounded-lg bg-white px-4 py-5">
                    <p class="app-body-text font-600 text-ink">单档微调</p>
                    <div class="mt-4 flex items-center justify-between gap-3">
                      <button class="h-11 w-11 rounded-full bg-[#F5F7FA] text-[24px] text-brand-700 ring-1 ring-black/4" type="button" @click="adjustMicroTune('front', -1)">-</button>
                      <div class="flex-1 px-2">
                        <p class="text-center app-card-title text-ink">微调数值: <span class="text-brand-700">{{ frontMicroAdjust >= 0 ? `+${frontMicroAdjust}` : frontMicroAdjust }}</span></p>
                        <div class="mt-3 h-2 rounded-full bg-[#E5E9F0]">
                          <div class="h-2 rounded-full bg-brand-500 transition" :style="{ width: `${((frontMicroAdjust + 10) / 20) * 100}%` }" />
                        </div>
                      </div>
                      <button class="h-11 w-11 rounded-full bg-[#F5F7FA] text-[24px] text-brand-700 ring-1 ring-black/4" type="button" @click="adjustMicroTune('front', 1)">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="mt-5 space-y-4">
                <div class="rounded-lg bg-[#F7F8FA] px-4 py-5">
                  <p class="app-subsection-title text-ink">控制器设置</p>
                  <div class="mt-4 rounded-lg bg-white px-4 py-5 ring-1 ring-black/4">
                    <p class="app-body-text font-600 text-ink">手把控制设置</p>
                    <div class="mt-5 space-y-3">
                      <div class="rounded-lg bg-soft p-3">
                        <div class="flex items-center gap-3">
                          <div class="h-10 w-10 flex items-center justify-center rounded-full bg-[#D9E8FF] text-brand-700">
                            <span class="text-[13px] font-700">L</span>
                          </div>
                          <span class="app-card-title text-ink">左手把</span>
                        </div>
                        <div class="mt-3 grid grid-cols-2 gap-2">
                          <button
                            class="app-touch-target w-full rounded-[6px] px-3 text-[14px] font-700 transition"
                            :class="leftControllerTarget === 'front' ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-black/8'"
                            type="button"
                            @click="selectControllerTarget('left', 'front')"
                          >
                            前拨
                          </button>
                          <button
                            class="app-touch-target w-full rounded-[6px] px-3 text-[14px] font-700 transition"
                            :class="leftControllerTarget === 'rear' ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-black/8'"
                            type="button"
                            @click="selectControllerTarget('left', 'rear')"
                          >
                            后拨
                          </button>
                        </div>
                      </div>

                      <div class="rounded-lg bg-soft p-3">
                        <div class="flex items-center gap-3">
                          <div class="h-10 w-10 flex items-center justify-center rounded-full bg-[#DDF5E6] text-[#16A34A]">
                            <span class="text-[13px] font-700">R</span>
                          </div>
                          <span class="app-card-title text-ink">右手把</span>
                        </div>
                        <div class="mt-3 grid grid-cols-2 gap-2">
                          <button
                            class="app-touch-target w-full rounded-[6px] px-3 text-[14px] font-700 transition"
                            :class="rightControllerTarget === 'front' ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-black/8'"
                            type="button"
                            @click="selectControllerTarget('right', 'front')"
                          >
                            前拨
                          </button>
                          <button
                            class="app-touch-target w-full rounded-[6px] px-3 text-[14px] font-700 transition"
                            :class="rightControllerTarget === 'rear' ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-black/8'"
                            type="button"
                            @click="selectControllerTarget('right', 'rear')"
                          >
                            后拨
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                v-if="device?.connected"
                class="w-full rounded-lg border border-[#FFE1E1] bg-[#FFF8F8] px-4 py-4 text-left"
                type="button"
                @click="unbindDialogVisible = true"
              >
                <p class="app-card-title text-[#D84C4C]">解绑设备</p>
                <p class="mt-1 app-supporting-text text-[#9D5C5C]">断开当前电子变速器与账号的绑定关系</p>
              </button>
            </div>
          </section>

          <section v-else-if="isTrainer" class="mt-4 space-y-4">
            <div class="app-metric-panel p-5">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p class="text-[11px] text-muted">功率</p>
                  <p class="mt-2 text-[24px] font-700 text-brand-700">{{ trainerRealtimeMock.power }}</p>
                  <p class="text-[11px] text-muted">w</p>
                </div>
                <div class="border-x border-black/6">
                  <p class="text-[11px] text-muted">踏频</p>
                  <p class="mt-2 text-[24px] font-700 text-brand-700">{{ trainerRealtimeMock.cadence }}</p>
                  <p class="text-[11px] text-muted">rpm</p>
                </div>
                <div>
                  <p class="text-[11px] text-muted">速度</p>
                  <p class="mt-2 text-[24px] font-700 text-brand-700">{{ trainerRealtimeMock.speed }}</p>
                  <p class="text-[11px] text-muted">km/h</p>
                </div>
              </div>
            </div>

            <div class="app-card p-5">
              <div class="app-segmented grid grid-cols-3 gap-1">
                <button
                  :class="activeTrainerTab === 'mode' ? 'bg-white text-ink shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeTrainerTab = 'mode'"
                >
                  训练模式
                </button>
                <button
                  :class="activeTrainerTab === 'settings' ? 'bg-white text-ink shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeTrainerTab = 'settings'"
                >
                  设备设置
                </button>
                <button
                  :class="activeTrainerTab === 'calibration' ? 'bg-white text-ink shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeTrainerTab = 'calibration'"
                >
                  设备校准
                </button>
              </div>

              <div v-if="activeTrainerTab === 'mode'" class="mt-5">
                <div class="app-list-group">
                  <div class="app-list-row justify-between">
                  <span class="text-[14px] text-muted">当前训练模式</span>
                  <span class="text-[14px] font-700 text-brand-700">{{ trainerMode === 'power' ? '功率模式' : '阻力模式' }}</span>
                  </div>
                </div>
                <p class="mt-4 app-body-text text-muted">选择训练模式</p>
                <div class="app-segmented mt-2 grid grid-cols-2 gap-1">
                  <button
                    class="app-segmented-item px-4 text-[14px] font-700 transition"
                    :class="trainerMode === 'resistance' ? 'bg-brand-500 text-white' : 'text-ink'"
                    type="button"
                    @click="selectTrainerMode('resistance')"
                  >
                    阻力模式
                  </button>
                  <button
                    class="app-segmented-item px-4 text-[14px] font-700 transition"
                    :class="trainerMode === 'power' ? 'bg-brand-500 text-white' : 'text-ink'"
                    type="button"
                    @click="selectTrainerMode('power')"
                  >
                    功率模式
                  </button>
                </div>

              </div>

              <div v-else-if="activeTrainerTab === 'settings'" class="app-list-group mt-5">
                <div class="app-list-row justify-between">
                  <span class="text-[14px] font-600 text-ink">当前阻力</span>
                  <span class="text-[18px] font-700" :class="trainerCanAdjustResistance ? 'text-brand-700' : 'text-[#B3BDCC]'">{{ resistanceValue }}%</span>
                </div>

                <div class="app-list-row block" :class="!trainerCanAdjustResistance && 'opacity-45'">
                  <label class="block text-[14px] font-600 text-ink">阻力调节</label>
                  <input v-model="resistanceValue" class="mt-4 w-full disabled:cursor-not-allowed" type="range" min="0" max="100" :disabled="!trainerCanAdjustResistance" />
                </div>

                <div class="app-list-row justify-between">
                  <span class="text-[14px] font-600 text-ink">当前功率</span>
                  <span class="text-[18px] font-700" :class="trainerCanAdjustPower ? 'text-brand-700' : 'text-[#B3BDCC]'">{{ constantPower }} 瓦</span>
                </div>

                <div class="app-list-row justify-between" :class="!trainerCanAdjustPower && 'opacity-45'">
                  <label class="text-[14px] font-600 text-ink" for="constant-power">功率调节</label>
                  <div class="flex items-center gap-2">
                    <input
                      id="constant-power"
                      v-model="constantPower"
                      class="w-20 rounded-lg border border-line bg-white px-3 py-2 text-right text-[14px] font-600 text-ink outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed"
                      type="number"
                      :disabled="!trainerCanAdjustPower"
                    />
                    <span class="text-[12px] text-muted">瓦</span>
                  </div>
                </div>

                <label class="app-list-row justify-between">
                  <div>
                    <p class="text-[14px] font-600 text-ink">虚拟惯量</p>
                    <p class="mt-1 text-[12px] leading-[1.7] text-muted">仅在虚拟坡度模式下生效</p>
                  </div>
                  <input v-model="virtualInertiaEnabled" type="checkbox" class="h-5 w-5 accent-brand-600" />
                </label>

                <label class="app-list-row justify-between">
                  <div>
                    <p class="text-[14px] font-600 text-ink">LED 射灯</p>
                    <p class="mt-1 text-[12px] leading-[1.7] text-muted">控制设备上的 LED 射灯开关</p>
                  </div>
                  <input v-model="ledLightEnabled" type="checkbox" class="h-5 w-5 accent-brand-600" />
                </label>

                <label class="app-list-row justify-between">
                  <div>
                    <p class="text-[14px] font-600 text-ink">路感模拟</p>
                    <p class="mt-1 text-[12px] leading-[1.7] text-muted">模拟真实骑行路感反馈</p>
                  </div>
                  <input v-model="roadFeelEnabled" type="checkbox" class="h-5 w-5 accent-brand-600" />
                </label>
              </div>

              <div v-else class="mt-5">
                <div class="app-list-group">
                  <div class="app-list-row block">
                  <p class="text-[13px] leading-[1.7] text-muted">建议每月完成一次设备校准，以确保运动数据计算的准确性。</p>
                  </div>
                  <div class="app-list-row justify-between">
                  <span class="text-[14px] text-muted">上次校准时间</span>
                  <span class="text-[14px] font-700 text-ink">2024-05-20 14:30</span>
                  </div>
                </div>
                <button class="mt-4 w-full rounded-lg bg-brand-500 px-4 py-3.5 text-[14px] font-700 text-white" type="button" @click="appStore.showToast('设备校准已开始，请保持设备静止')">
                  开始校准
                </button>
              </div>

              <div class="app-list-group mt-5 border-[#FFE1E1] bg-[#FFF8F8]">
                <button class="app-list-row w-full justify-between gap-4 text-left" type="button" @click="trainerResetDialogVisible = true">
                  <p class="shrink-0 app-card-title text-[#D84C4C]">恢复出厂设置</p>
                  <p class="min-w-0 flex-1 text-right app-supporting-text text-[#9D5C5C]">重置骑行台参数和训练状态</p>
                </button>
                <button
                  class="app-list-row w-full justify-between gap-4 text-left"
                  type="button"
                  @click="unbindDialogVisible = true"
                >
                  <p class="shrink-0 app-card-title text-[#D84C4C]">解除绑定</p>
                  <p class="min-w-0 flex-1 text-right app-supporting-text text-[#9D5C5C]">断开当前骑行台与账号绑定关系</p>
                </button>
              </div>

              <div class="app-list-group mt-5">
                <button class="app-list-row w-full justify-between text-left" type="button" @click="handleOpenSettingPage('firmware')">
                  <p class="app-card-title text-ink">固件检测</p>
                  <ChevronRight :size="18" :stroke-width="2.2" class="text-muted" />
                </button>
              </div>
            </div>
          </section>

          <section v-else-if="isSeatpost" class="mt-4 space-y-4">
            <div class="app-card p-5">
              <div class="app-segmented grid grid-cols-3 gap-1">
                <button
                  :class="activeSeatpostTab === 'height' ? 'bg-white text-brand-700 shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeSeatpostTab = 'height'"
                >
                  高度调节
                </button>
                <button
                  :class="activeSeatpostTab === 'preset' ? 'bg-white text-brand-700 shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeSeatpostTab = 'preset'"
                >
                  预设位置
                </button>
                <button
                  :class="activeSeatpostTab === 'advanced' ? 'bg-white text-brand-700 shadow-card' : 'text-muted'"
                  class="app-segmented-item px-3 text-[13px] font-700 transition"
                  type="button"
                  @click="activeSeatpostTab = 'advanced'"
                >
                  高级设置
                </button>
              </div>

              <div v-if="activeSeatpostTab === 'height'" class="mt-5">
                  <h3 class="app-subsection-title text-ink">高度调节</h3>
                  <div class="app-list-group mt-4">
                    <div class="app-list-row app-list-row--stack">
                    <div class="w-full flex items-center justify-between">
                      <span class="text-[14px] text-muted">当前高度</span>
                      <span class="text-[20px] font-700 text-ink">{{ seatpostHeight }}%</span>
                    </div>
                    <input
                      v-model="seatpostHeight"
                      class="mt-4 w-full disabled:cursor-not-allowed"
                      type="range"
                      min="0"
                      max="100"
                      :disabled="!seatpostUnlocked"
                    />
                    <div class="mt-4 grid grid-cols-2 gap-3">
                      <button
                        class="app-touch-target rounded-lg bg-soft px-4 text-[14px] font-700 text-ink disabled:opacity-45"
                        type="button"
                        :disabled="!seatpostUnlocked"
                        @click="adjustSeatpostHeight(5)"
                      >
                        上升
                      </button>
                      <button
                        class="app-touch-target rounded-lg bg-soft px-4 text-[14px] font-700 text-ink disabled:opacity-45"
                        type="button"
                        :disabled="!seatpostUnlocked"
                        @click="adjustSeatpostHeight(-5)"
                      >
                        下降
                      </button>
                    </div>
                    <p class="mt-4 text-[12px] leading-[1.7] text-muted">已保存高度 {{ seatpostSavedHeight }}%，调整完成后需点击下方保存。</p>
                    </div>
                  </div>
                  <button
                    class="mt-4 w-full rounded-lg px-4 py-3.5 text-[14px] font-700 text-white"
                    :class="!seatpostUnlocked ? 'bg-brand-500' : seatpostHasPendingChanges ? 'bg-brand-500' : 'bg-[#7A8B86]'"
                    type="button"
                    @click="!seatpostUnlocked ? unlockSeatpost() : saveSeatpostHeight()"
                  >
                    {{ !seatpostUnlocked ? '解锁' : seatpostHasPendingChanges ? '保存' : '已保存' }}
                  </button>
              </div>

              <div v-else-if="activeSeatpostTab === 'preset'" class="mt-5">
                  <h3 class="app-subsection-title text-ink">预设位置</h3>
                  <div class="mt-4 grid grid-cols-2 gap-3">
                    <button
                      v-for="preset in seatpostPresets"
                      :key="preset.id"
                      class="rounded-lg px-4 py-4 text-left transition"
                      :class="preset.height === seatpostHeight ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' : 'bg-white text-ink ring-1 ring-black/6'"
                      type="button"
                      @click="applySeatpostPreset(preset.height, preset.label)"
                    >
                      <p class="text-[14px] font-700">{{ preset.label }}</p>
                      <p class="mt-1 text-[12px] text-muted">{{ preset.height }}%</p>
                    </button>
                    <button
                      class="rounded-lg bg-white px-4 py-4 text-left text-ink ring-1 ring-dashed ring-black/10 transition hover:bg-soft"
                      type="button"
                      @click="addSeatpostPreset"
                    >
                      <p class="text-[14px] font-700">+ 添加预设</p>
                      <p class="mt-1 text-[12px] text-muted">保存当前高度</p>
                    </button>
                  </div>
              </div>

              <div v-else class="mt-5">
                  <h3 class="app-subsection-title text-ink">高级设置</h3>

                  <div class="app-list-group mt-4">
                    <div class="app-list-row justify-between gap-3">
                      <span class="text-[14px] font-600 text-ink">调节速度</span>
                      <div class="flex items-center gap-2">
                        <button
                          class="min-w-12 rounded-[6px] px-3 py-2 text-[13px] font-700 transition"
                          :class="seatpostSpeed === 'high' ? 'bg-brand-500 text-white' : 'bg-[#F5F7FA] text-ink'"
                          type="button"
                          @click="seatpostSpeed = 'high'"
                        >
                          高
                        </button>
                        <button
                          class="min-w-12 rounded-[6px] px-3 py-2 text-[13px] font-700 transition"
                          :class="seatpostSpeed === 'medium' ? 'bg-brand-500 text-white' : 'bg-[#F5F7FA] text-ink'"
                          type="button"
                          @click="seatpostSpeed = 'medium'"
                        >
                          中
                        </button>
                        <button
                          class="min-w-12 rounded-[6px] px-3 py-2 text-[13px] font-700 transition"
                          :class="seatpostSpeed === 'low' ? 'bg-brand-500 text-white' : 'bg-[#F5F7FA] text-ink'"
                          type="button"
                          @click="seatpostSpeed = 'low'"
                        >
                          低
                        </button>
                      </div>
                    </div>
                    <label class="app-list-row justify-between">
                    <span class="text-[14px] font-600 text-ink">自动记忆</span>
                    <input v-model="seatpostAutoMemory" type="checkbox" class="h-5 w-5 accent-brand-600" />
                    </label>

                    <button
                    class="app-list-row app-list-row--split w-full bg-[#FFF8F8] text-left"
                    type="button"
                    @click="seatpostResetDialogVisible = true"
                  >
                    <p class="shrink-0 text-[14px] font-700 text-[#D84C4C]">恢复出厂设置</p>
                    <p class="min-w-0 flex-1 text-right text-[12px] leading-5 text-[#9D5C5C]">重置高度、预设和高级设置参数</p>
                    </button>
                  </div>
              </div>

              <div class="app-list-group mt-5">
                <button
                class="app-list-row w-full justify-between text-left transition hover:bg-soft"
                type="button"
                @click="handleOpenSettingPage('firmware')"
              >
                <p class="app-card-title text-brand-700">固件检测</p>
                <ChevronRight :size="18" :stroke-width="2.2" class="text-muted" />
                </button>

                <button
                v-if="device?.connected"
                class="app-list-row app-list-row--split w-full bg-[#FFF8F8] text-left"
                type="button"
                @click="unbindDialogVisible = true"
              >
                <p class="shrink-0 app-card-title text-[#D84C4C]">解除绑定</p>
                <p class="min-w-0 flex-1 text-right app-supporting-text text-[#9D5C5C]">断开当前电子升降坐管与账号绑定关系</p>
                </button>
              </div>
            </div>
          </section>

          <section v-else class="mt-4">
            <div class="app-card p-5">
              <h3 class="app-section-title">设备设置</h3>
              <div class="app-list-group mt-4">
                <button
                  v-for="entry in deviceSettingEntries"
                  :key="entry.key"
                  class="app-list-row w-full justify-between text-left"
                  type="button"
                  @click="handleSettingAction(entry)"
                >
                  <div>
                    <p class="app-card-title" :class="entry.danger ? 'text-[#D84C4C]' : 'text-ink'">{{ entry.title }}</p>
                    <p class="mt-1 app-supporting-text text-muted">{{ entry.description }}</p>
                  </div>
                  <ChevronRight :size="16" :stroke-width="2.2" class="text-muted" />
                </button>
              </div>
            </div>
          </section>

        </template>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppDialog
      cancel-label="否"
      confirm-label="是"
      description="解绑后将断开当前设备与账号的连接关系。"
      title="是否确定解绑当前设备？"
      :visible="unbindDialogVisible"
      @cancel="unbindDialogVisible = false"
      @confirm="handleConfirmUnbind"
    />
    <AppDialog
      description="恢复后训练模式将重置为阻力模式，当前阻力为0，功率为0，虚拟惯量、LED射灯和路感模拟均关闭。"
      title="是否恢复出厂设置？"
      :visible="trainerResetDialogVisible"
      @cancel="trainerResetDialogVisible = false"
      @confirm="confirmTrainerReset"
    />
    <AppDialog
      description="检测到飞轮阻力响应异常，请检查电源连接、蓝牙稳定性及设备摆放是否平稳。若多次出现，请联系售后支持。"
      title="设备故障诊断"
      :visible="trainerFaultDialogVisible"
      @cancel="trainerFaultDialogVisible = false"
      @confirm="trainerFaultDialogVisible = false"
    />
    <AppDialog
      description="恢复后将重置高度为75%，调节速度为中，自动记忆关闭。"
      title="是否恢复升降坐管默认设置？"
      :visible="seatpostResetDialogVisible"
      @cancel="seatpostResetDialogVisible = false"
      @confirm="resetSeatpostSettings"
    />
    <AppDialog
      cancel-label="否"
      confirm-label="是"
      description="恢复后语言、电源和页面等设置将重置为默认值，骑行数据不会删除。"
      title="是否恢复码表出厂设置？"
      :visible="computerResetDialogVisible"
      @cancel="computerResetDialogVisible = false"
      @confirm="confirmComputerReset"
    />
    <AppDialog
      cancel-label="否"
      confirm-label="是"
      description="此操作将删除码表内的设备设置、骑行轨迹和路书，且无法撤销。"
      title="是否抹除码表数据？"
      :visible="computerEraseDialogVisible"
      @cancel="computerEraseDialogVisible = false"
      @confirm="confirmComputerErase"
    />
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
