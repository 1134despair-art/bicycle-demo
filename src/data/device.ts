export type DeviceKind = 'computer' | 'trainer' | 'derailleur' | 'seatpost' | 'sensor'
export type DeviceCategory = '码表' | '电子骑行台' | '电子变速器' | '电子升降坐管' | '传感器'

export type DeviceCategoryConfig = {
  key: DeviceKind
  label: DeviceCategory
  image: string
  description: string
  enabled: boolean
  sort: number
  displayLimit: number
}

export type DeviceMetric = {
  label: string
  value: string
  tone?: 'brand' | 'success' | 'warning' | 'muted'
}

export type DeviceItem = {
  id: string
  kind: DeviceKind
  category: DeviceCategory
  name: string
  subtitle: string
  description: string
  image: string
  connected: boolean
  battery: string
  firmware: string
  deviceId: string
  lastSeen: string
  usage: string
  statusText: string
  extraStatus?: string
  hasConnectedHistory: boolean
  metrics: DeviceMetric[]
}

export type DeviceCandidate = {
  id: string
  kind: DeviceKind
  category: DeviceCategory
  name: string
  image: string
  subtitle: string
  description: string
  signal: string
  battery?: string
}

export type SensorDevice = {
  id: string
  name: string
  value: string
  connected: boolean
}

export type FirmwareInfo = {
  currentVersion: string
  latestVersion: string
  changelog: string[]
}

export const primaryDeviceId = 'device-bike-computer-pro'

const bikeComputerImage =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20cycling%20computer%20device%20product%20photo%2C%20clean%20light%20background%2C%20commercial%20sports%20tech%20hardware%2C%20front%20view&image_size=square'

const trainerImage =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=smart%20indoor%20bike%20trainer%20product%20photo%2C%20clean%20studio%20lighting%2C%20premium%20fitness%20hardware%2C%20commercial%20app%20device%20page&image_size=square'

const derailleurImage =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=electronic%20bicycle%20derailleur%20product%20photo%2C%20minimal%20white%20studio%20background%2C%20premium%20cycling%20component&image_size=square'

const seatpostImage =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=electronic%20dropper%20seatpost%20product%20photo%2C%20clean%20studio%20lighting%2C%20premium%20cycling%20component&image_size=square'

const sensorImage =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20cycling%20sensor%20set%20product%20photo%2C%20heart%20rate%20cadence%20and%20speed%20sensors%2C%20clean%20white%20studio%20background&image_size=square'

// 与后台“设备分类管理”字段保持一致；接口接入后可直接替换此默认配置。
export const deviceCategoryConfigMock: DeviceCategoryConfig[] = [
  {
    key: 'computer',
    label: '码表',
    image: bikeComputerImage,
    description: '骑行数据、导航与训练入口',
    enabled: true,
    sort: 1,
    displayLimit: 5,
  },
  {
    key: 'trainer',
    label: '电子骑行台',
    image: trainerImage,
    description: '智能变阻，室内训练',
    enabled: true,
    sort: 2,
    displayLimit: 5,
  },
  {
    key: 'derailleur',
    label: '电子变速器',
    image: derailleurImage,
    description: '精准变速，顺畅骑行',
    enabled: true,
    sort: 3,
    displayLimit: 5,
  },
  {
    key: 'seatpost',
    label: '电子升降坐管',
    image: seatpostImage,
    description: '一键调节，舒适骑行',
    enabled: true,
    sort: 4,
    displayLimit: 5,
  },
  {
    key: 'sensor',
    label: '传感器',
    image: sensorImage,
    description: '心率、踏频与速度传感器',
    enabled: true,
    sort: 5,
    displayLimit: 5,
  },
]

export const deviceListMock: DeviceItem[] = [
  {
    id: primaryDeviceId,
    kind: 'computer',
    category: '码表',
    name: '码表 GPS-01',
    subtitle: '骑行主设备',
    description: '负责骑行记录、导航、传感器联动和设备设置，是设备页主入口。',
    image: bikeComputerImage,
    connected: false,
    battery: '85%',
    firmware: 'v3.2.1',
    deviceId: 'GPS-2024-00158',
    lastSeen: '未连接',
    usage: '尚未开始使用',
    statusText: '未连接',
    extraStatus: '等待绑定',
    hasConnectedHistory: false,
    metrics: [
      { label: '电量', value: '85%', tone: 'success' },
      { label: '固件版本', value: 'v3.2.1' },
      { label: '星历状态', value: '待同步', tone: 'warning' },
      { label: '蓝牙状态', value: '未连接', tone: 'warning' },
    ],
  },
  {
    id: 'device-trainer-bt01',
    kind: 'trainer',
    category: '电子骑行台',
    name: '骑行台 BT01',
    subtitle: '室内训练设备',
    description: '支持阻力调节、训练模式切换、校准和固件检测。',
    image: trainerImage,
    connected: false,
    battery: '--',
    firmware: 'v2.1.0',
    deviceId: 'TRA-2024-00092',
    lastSeen: '未连接',
    usage: '尚未开始使用',
    statusText: '未连接',
    extraStatus: '等待绑定',
    hasConnectedHistory: false,
    metrics: [
      { label: '连接状态', value: '未连接', tone: 'warning' },
      { label: '使用时长', value: '--' },
      { label: '版本号', value: 'v2.1.0' },
      { label: '设备ID', value: 'TRA-2024-00092' },
    ],
  },
  {
    id: 'device-derailleur-e12',
    kind: 'derailleur',
    category: '电子变速器',
    name: '电子变速器 E12',
    subtitle: '变速联动设备',
    description: '支持 OTA、调试、速别设置和换挡参数管理。',
    image: derailleurImage,
    connected: false,
    battery: '86%',
    firmware: 'v1.9.3',
    deviceId: 'DER-2025-10218',
    lastSeen: '未连接',
    usage: '换挡次数 0 次',
    statusText: '未连接',
    extraStatus: '等待绑定',
    hasConnectedHistory: false,
    metrics: [
      { label: '电量', value: '86%', tone: 'warning' },
      { label: '固件版本', value: 'v1.9.3' },
      { label: '换挡次数', value: '0 次' },
      { label: '当前速别', value: '12 速' },
    ],
  },
  {
    id: 'device-seatpost-s1',
    kind: 'seatpost',
    category: '电子升降坐管',
    name: '电子升降坐管 S1',
    subtitle: '姿态调节设备',
    description: '支持 OTA、调试、校准和坐管行程设置。',
    image: seatpostImage,
    connected: false,
    battery: '64%',
    firmware: 'v1.3.0',
    deviceId: 'SEA-2025-00071',
    lastSeen: '未连接',
    usage: '累计动作 0 次',
    statusText: '未连接',
    extraStatus: '等待绑定',
    hasConnectedHistory: false,
    metrics: [
      { label: '电量', value: '64%', tone: 'warning' },
      { label: '固件版本', value: 'v1.3.0' },
      { label: '动作次数', value: '0 次' },
      { label: '当前行程', value: '150 mm' },
    ],
  },
]

export const deviceCandidatesMock: DeviceCandidate[] = [
  {
    id: 'candidate-bike-computer-pro',
    image: bikeComputerImage,
    kind: 'computer',
    category: '码表',
    name: '码表 GPS-01',
    subtitle: '附近蓝牙设备',
    description: '支持导航、传感器联动与骑行记录，可作为骑行主设备接入。',
    signal: '信号强',
    battery: '85%',
  },
  {
    id: 'candidate-trainer-bt01',
    image: trainerImage,
    kind: 'trainer',
    category: '电子骑行台',
    name: '骑行台 BT01',
    subtitle: '附近蓝牙设备',
    description: '支持阻力训练与室内功率课程，可作为主训练设备接入。',
    signal: '信号强',
  },
  {
    id: 'candidate-derailleur-e12',
    image: derailleurImage,
    kind: 'derailleur',
    category: '电子变速器',
    name: '电子变速器 E12',
    subtitle: '附近蓝牙设备',
    description: '支持速别设置、换挡参数管理与固件升级。',
    signal: '信号中',
    battery: '86%',
  },
  {
    id: 'candidate-seatpost-s1',
    image: seatpostImage,
    kind: 'seatpost',
    category: '电子升降坐管',
    name: '电子升降坐管 S1',
    subtitle: '附近蓝牙设备',
    description: '支持预设位置与自动记忆，可作为姿态调节主设备接入。',
    signal: '信号强',
    battery: '64%',
  },
  {
    id: 'candidate-power-meter',
    kind: 'sensor',
    category: '传感器',
    name: '功率计 PM2',
    image: sensorImage,
    subtitle: '附近蓝牙设备',
    description: '支持功率训练和训练区间管理。',
    signal: '信号中',
    battery: '48%',
  },
]

export const sensorDevicesMock: SensorDevice[] = [
  { id: 'sensor-power', name: '功率计 PM2', value: '未连接', connected: false },
]

export const firmwareInfoMock: FirmwareInfo = {
  currentVersion: 'v3.2.1',
  latestVersion: 'v3.2.2',
  changelog: [
    '优化蓝牙连接稳定性',
    '修复心率数据异常问题',
    '增加新的传感器支持',
  ],
}

export const trainerRealtimeMock = {
  power: '186',
  cadence: '87',
  speed: '31.2',
  temperature: '45°',
}
