import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { DeviceCandidate, DeviceCategoryConfig, DeviceItem, DeviceKind, SensorDevice } from '../data/device'
import { deviceCandidatesMock, deviceCategoryConfigMock, deviceListMock, primaryDeviceId, sensorDevicesMock } from '../data/device'

const cloneDevice = (device: DeviceItem): DeviceItem => ({
  ...device,
  metrics: device.metrics.map((item) => ({ ...item })),
})

const cloneCandidate = (candidate: DeviceCandidate): DeviceCandidate => ({ ...candidate })
const cloneSensor = (sensor: SensorDevice): SensorDevice => ({ ...sensor })
const cloneCategoryConfig = (category: DeviceCategoryConfig): DeviceCategoryConfig => ({ ...category })

export type ComputerLanguage = 'system' | 'zh-CN' | 'zh-TW' | 'en-US' | 'es-ES' | 'ko-KR'
export type ComputerSleepTime = '30s' | '1min' | '2min' | '3min'
export type ComputerShutdownTime = '5min' | '10min' | '15min' | '30min'
export type ComputerBacklightMode = 'auto' | 'always-on' | 'off'
export type ComputerSyncItemKey = 'settings' | 'battery' | 'ephemeris' | 'tracks' | 'routes'
export type ComputerSyncItemStatus = 'idle' | 'syncing' | 'synced' | 'pending'

export type ComputerSyncItem = {
  key: ComputerSyncItemKey
  label: string
  detail: string
  status: ComputerSyncItemStatus
}

const computerSyncItemDefaults: ComputerSyncItem[] = [
  { key: 'settings', label: '设备设置', detail: '等待连接', status: 'idle' },
  { key: 'battery', label: '设备电量', detail: '等待连接', status: 'idle' },
  { key: 'ephemeris', label: '卫星星历', detail: '等待更新', status: 'idle' },
  { key: 'tracks', label: '骑行轨迹', detail: '等待连接', status: 'idle' },
  { key: 'routes', label: '路书路线', detail: '等待连接', status: 'idle' },
]

const formatSyncTime = () => new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date())

const formatEphemerisVersion = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `v${year}.${month}.${day}`
}

export const useDeviceStore = defineStore('device', () => {
  const devices = ref(deviceListMock.map(cloneDevice))
  const candidates = ref(deviceCandidatesMock.map(cloneCandidate))
  const sensors = ref(sensorDevicesMock.map(cloneSensor))
  const deviceCategoryConfig = ref(deviceCategoryConfigMock.map(cloneCategoryConfig))
  const hasCompletedFirstDeviceSetup = ref(false)
  const computerSettings = ref({
    language: 'system' as ComputerLanguage,
    autoSleepEnabled: false,
    sleepTime: '30s' as ComputerSleepTime,
    autoShutdownEnabled: false,
    shutdownTime: '10min' as ComputerShutdownTime,
    backlightMode: 'auto' as ComputerBacklightMode,
    buttonSoundEnabled: false,
    autoPauseEnabled: false,
    autoLapEnabled: false,
  })
  const computerSync = ref({
    status: 'idle' as 'idle' | 'syncing' | 'synced' | 'partial' | 'pending',
    lastSyncedAt: '尚未同步',
    lastServerFetchAt: '尚未更新',
    ephemerisVersion: '--',
    ephemerisCached: false,
    items: computerSyncItemDefaults.map((item) => ({ ...item })),
  })
  const pruneSensorDevicesFromMainList = () => {
    devices.value = devices.value.filter((item) => item.kind !== 'sensor')
  }

  pruneSensorDevicesFromMainList()

  const primaryDevice = computed(() =>
    devices.value.find((item) => item.id === primaryDeviceId) ?? devices.value[0] ?? null,
  )

  const connectedDevices = computed(() => devices.value.filter((item) => item.connected))

  const secondaryDevices = computed(() =>
    devices.value.filter((item) => item.id !== primaryDeviceId && item.kind !== 'sensor'),
  )

  const currentConnectedDevices = computed(() =>
    devices.value.filter((item) => item.connected && item.kind !== 'sensor'),
  )

  const hasMoreDevices = computed(() => deviceCategoryConfig.value.some((item) => item.enabled))
  const connectedSensors = computed(() => sensors.value.filter((item) => item.connected))
  const availableSensorCandidates = computed(() => candidates.value.filter((item) => item.kind === 'sensor'))

  const deviceCategoryEntries = computed(() => {
    return deviceCategoryConfig.value
      .filter((category) => category.enabled)
      .sort((left, right) => left.sort - right.sort)
      .map((category) => {
        const items = devices.value.filter((item) => item.kind === category.key)
        const connectedCount = items.filter((item) => item.connected).length
        const historyCount = items.filter((item) => !item.connected && item.hasConnectedHistory).length

        return {
          ...category,
          connectedCount,
          historyCount,
        }
      })
  })

  const getDeviceById = (deviceId: string) => devices.value.find((item) => item.id === deviceId) ?? null

  const getDevicesByKind = (kind: DeviceKind) =>
    devices.value.filter((item) => item.kind === kind)

  const syncComputer = async (deviceId: string, online = true) => {
    const target = getDeviceById(deviceId)
    if (!target || target.kind !== 'computer' || computerSync.value.status === 'syncing') {
      return null
    }

    computerSync.value.status = 'syncing'
    computerSync.value.items = computerSync.value.items.map((item) => ({
      ...item,
      detail: '同步中',
      status: 'syncing',
    }))

    await new Promise((resolve) => window.setTimeout(resolve, 520))

    const connected = target.connected
    const syncTime = formatSyncTime()
    const ephemerisVersion = online ? formatEphemerisVersion() : computerSync.value.ephemerisVersion
    const ephemerisCached = online || computerSync.value.ephemerisCached

    computerSync.value.items = computerSync.value.items.map((item) => {
      if (item.key === 'ephemeris') {
        if (connected && ephemerisCached) {
          return { ...item, detail: ephemerisVersion, status: 'synced' }
        }
        if (online) {
          return { ...item, detail: '已缓存', status: 'pending' }
        }
        return { ...item, detail: '等待联网', status: 'pending' }
      }

      if (!connected) {
        return { ...item, detail: '等待连接', status: 'pending' }
      }

      if (item.key === 'settings') {
        return { ...item, detail: '已获取', status: 'synced' }
      }
      if (item.key === 'battery') {
        return { ...item, detail: target.battery, status: 'synced' }
      }
      if (item.key === 'tracks') {
        return { ...item, detail: '126 条', status: 'synced' }
      }
      return { ...item, detail: '8 条', status: 'synced' }
    })

    const allSynced = computerSync.value.items.every((item) => item.status === 'synced')
    computerSync.value.status = allSynced ? 'synced' : connected ? 'partial' : 'pending'
    computerSync.value.lastSyncedAt = connected ? syncTime : computerSync.value.lastSyncedAt
    computerSync.value.lastServerFetchAt = online ? syncTime : computerSync.value.lastServerFetchAt
    computerSync.value.ephemerisVersion = ephemerisVersion
    computerSync.value.ephemerisCached = ephemerisCached

    return computerSync.value
  }

  const updateComputerLanguage = (language: ComputerLanguage, connected: boolean) => {
    computerSettings.value.language = language
    computerSync.value.items = computerSync.value.items.map((item) =>
      item.key === 'settings'
        ? { ...item, detail: connected ? '已同步' : '等待连接', status: connected ? 'synced' : 'pending' }
        : item,
    )
  }

  const updateComputerPowerSettings = (settings: Partial<Pick<typeof computerSettings.value, 'autoSleepEnabled' | 'sleepTime' | 'autoShutdownEnabled' | 'shutdownTime'>>, connected: boolean) => {
    computerSettings.value = { ...computerSettings.value, ...settings }
    computerSync.value.items = computerSync.value.items.map((item) =>
      item.key === 'settings'
        ? { ...item, detail: connected ? '已同步' : '等待连接', status: connected ? 'synced' : 'pending' }
        : item,
    )
  }

  const updateComputerOtherSettings = (settings: Partial<Pick<typeof computerSettings.value, 'backlightMode' | 'buttonSoundEnabled' | 'autoPauseEnabled' | 'autoLapEnabled'>>, connected: boolean) => {
    computerSettings.value = { ...computerSettings.value, ...settings }
    computerSync.value.items = computerSync.value.items.map((item) =>
      item.key === 'settings'
        ? { ...item, detail: connected ? '已同步' : '等待连接', status: connected ? 'synced' : 'pending' }
        : item,
    )
  }

  const resetComputerSettings = (connected: boolean) => {
    computerSettings.value = {
      language: 'system',
      autoSleepEnabled: false,
      sleepTime: '30s',
      autoShutdownEnabled: false,
      shutdownTime: '10min',
      backlightMode: 'auto',
      buttonSoundEnabled: false,
      autoPauseEnabled: false,
      autoLapEnabled: false,
    }
    computerSync.value.items = computerSync.value.items.map((item) =>
      item.key === 'settings'
        ? { ...item, detail: connected ? '已重置' : '等待连接', status: connected ? 'synced' : 'pending' }
        : item,
    )
  }

  const eraseComputerData = (connected: boolean) => {
    computerSync.value.items = computerSync.value.items.map((item) =>
      item.key === 'tracks' || item.key === 'routes'
        ? { ...item, detail: connected ? '0 条' : '等待连接', status: connected ? 'synced' : 'pending' }
        : item,
    )
  }

  const bindCandidate = (candidateId: string) => {
    const target = candidates.value.find((item) => item.id === candidateId)
    if (!target) {
      return null
    }

    if (target.kind === 'sensor') {
      return null
    }

    const targetDeviceId = candidateId.replace('candidate-', 'device-')
    devices.value = devices.value.map((item) => {
      if (item.id !== targetDeviceId) {
        return item
      }

      return {
        ...item,
        connected: true,
        statusText: '已连接',
        lastSeen: '刚刚连接',
        usage: item.kind === 'computer'
          ? '累计使用 1 小时'
          : item.kind === 'trainer'
            ? '累计使用 1 小时'
            : item.kind === 'derailleur'
              ? '换挡次数 12 次'
              : '累计动作 6 次',
        extraStatus: '运行正常',
        hasConnectedHistory: true,
        metrics: item.metrics.map((metric) => {
          if (metric.label === '连接状态' || metric.label === '蓝牙状态') {
            return { ...metric, value: '已连接', tone: 'success' }
          }
          if (metric.label === '使用时长') {
            return { ...metric, value: '1 小时' }
          }
          if (metric.label === '换挡次数') {
            return { ...metric, value: '12 次' }
          }
          if (metric.label === '动作次数') {
            return { ...metric, value: '6 次' }
          }
          if (metric.label === '星历状态') {
            return { ...metric, value: '已同步', tone: 'success' }
          }
          if (metric.label === '电量' && target.battery) {
            return { ...metric, value: target.battery, tone: 'brand' }
          }
          return metric
        }),
      }
    })

    hasCompletedFirstDeviceSetup.value = true
    return getDeviceById(targetDeviceId)
  }

  const bindSensorCandidate = (candidateId: string) => {
    const target = candidates.value.find((item) => item.id === candidateId && item.kind === 'sensor')
    if (!target) {
      return null
    }

    const nextSensor: SensorDevice = {
      id: `sensor-${target.id}`,
      name: target.name,
      value: '已连接',
      connected: true,
    }

    sensors.value = [...sensors.value.filter((item) => item.name !== nextSensor.name), nextSensor]
    candidates.value = candidates.value.filter((item) => item.id !== candidateId)
    return nextSensor
  }

  const unbindSensor = (sensorId: string) => {
    const target = sensors.value.find((item) => item.id === sensorId)
    if (!target) {
      return null
    }

    sensors.value = sensors.value.map((item) =>
      item.id === sensorId
        ? {
            ...item,
            connected: false,
            value: '未连接',
          }
        : item,
    )

    return sensors.value.find((item) => item.id === sensorId) ?? null
  }

  const unbindDevice = (deviceId: string) => {
    const target = getDeviceById(deviceId)
    if (!target) {
      return null
    }

    devices.value = devices.value.map((item) =>
      item.id === deviceId
        ? {
            ...item,
            connected: false,
            statusText: '未连接',
            lastSeen: '刚刚解绑',
            extraStatus: '等待绑定',
            metrics: item.metrics.map((metric) =>
              metric.label === '连接状态' || metric.label === '蓝牙状态'
                ? { ...metric, value: '未连接', tone: 'warning' }
                : metric.label === '使用时长'
                  ? { ...metric, value: '--' }
                  : metric.label === '换挡次数'
                    ? { ...metric, value: '0 次' }
                    : metric.label === '动作次数'
                      ? { ...metric, value: '0 次' }
                      : metric.label === '星历状态'
                        ? { ...metric, value: '待同步', tone: 'warning' }
                : metric,
            ),
          }
        : item,
    )

    return getDeviceById(deviceId)
  }

  return {
    bindCandidate,
    bindSensorCandidate,
    candidates,
    connectedSensors,
    connectedDevices,
    computerSettings,
    computerSync,
    currentConnectedDevices,
    deviceCategoryConfig,
    deviceCategoryEntries,
    devices,
    getDeviceById,
    getDevicesByKind,
    hasCompletedFirstDeviceSetup,
    hasMoreDevices,
    primaryDevice,
    eraseComputerData,
    availableSensorCandidates,
    resetComputerSettings,
    secondaryDevices,
    sensors,
    syncComputer,
    unbindSensor,
    unbindDevice,
    updateComputerLanguage,
    updateComputerOtherSettings,
    updateComputerPowerSettings,
  }
})
