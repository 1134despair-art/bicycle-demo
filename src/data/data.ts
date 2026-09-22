export type DataOverviewStat = {
  label: string
  value: string
  tone?: string
}

export type DataOverviewCardData = {
  eyebrow: string
  title: string
  description: string
  highlightLabel: string
  highlightValue: string
  highlightUnit: string
  comparisonLabel: string
  comparisonValue: string
  summary: string
  stats: DataOverviewStat[]
}

export type DataMetricTone = 'brand' | 'success' | 'warning' | 'danger' | 'default'

export type DataMetricCardData = {
  key: string
  label: string
  value: string
  unit: string
  comparison: string
  description: string
  tone: DataMetricTone
}

export type DataTrendBar = {
  label: string
  detailLabel: string
  value: number
  height: string
  emphasis?: boolean
}

export type DataTrendCardData = {
  eyebrow: string
  title: string
  description: string
  totalDistance: string
  totalDuration: string
  avgSpeed: string
  bars: DataTrendBar[]
}

export type DataQuickEntryIcon = 'history' | 'share' | 'export' | 'sync'

export type DataQuickEntry = {
  key: string
  label: string
  description: string
  icon: DataQuickEntryIcon
}

export const dataOverviewMock: DataOverviewCardData = {
  eyebrow: '骑行工作台',
  title: '本月累计',
  description: '',
  highlightLabel: '本月累计里程',
  highlightValue: '412.8',
  highlightUnit: 'km',
  comparisonLabel: '最近骑行',
  comparisonValue: '07-15',
  summary: '',
  stats: [
    { label: '骑行次数', value: '9 次', tone: 'text-ink' },
    { label: '总时长', value: '18h 42m', tone: 'text-brand-700' },
    { label: '最佳单次', value: '86.5km', tone: 'text-success' },
  ],
}

export const dataMetricCardsMock: DataMetricCardData[] = [
  {
    key: 'distance',
    label: '本周里程',
    value: '186.4',
    unit: 'km',
    comparison: '较上周 +12.8%',
    description: '',
    tone: 'brand',
  },
  {
    key: 'rides',
    label: '本周骑行次数',
    value: '4',
    unit: '次',
    comparison: '最近一次 07-15',
    description: '',
    tone: 'warning',
  },
  {
    key: 'duration',
    label: '本周时长',
    value: '8h 36m',
    unit: '',
    comparison: '较上周 +1.4h',
    description: '',
    tone: 'success',
  },
  {
    key: 'best',
    label: '最佳单次记录',
    value: '86.5',
    unit: 'km',
    comparison: '本月最佳',
    description: '',
    tone: 'brand',
  },
]

export const dataTrendMock: DataTrendCardData = {
  eyebrow: '周期统计',
  title: '近 7 日里程趋势',
  description: '',
  totalDistance: '186.4 km',
  totalDuration: '8h 36m',
  avgSpeed: '26.8 km/h',
  bars: [
    { label: '周一|07/13', detailLabel: '周一 07/13', value: 18.2, height: '31%' },
    { label: '周二|07/14', detailLabel: '周二 07/14', value: 32.4, height: '54%' },
    { label: '周三|07/15', detailLabel: '周三 07/15', value: 24.1, height: '40%' },
    { label: '周四|07/16', detailLabel: '周四 07/16', value: 21.6, height: '36%' },
    { label: '周五|07/17', detailLabel: '周五 07/17', value: 27.3, height: '46%' },
    { label: '周六|07/18', detailLabel: '周六 07/18', value: 43.8, height: '73%', emphasis: true },
    { label: '周日|07/19', detailLabel: '周日 07/19', value: 19, height: '32%' },
  ],
}

export const dataQuickEntriesMock: DataQuickEntry[] = [
  {
    key: 'history',
    label: '历史记录',
    description: '',
    icon: 'history',
  },
  {
    key: 'share',
    label: '分享卡片',
    description: '',
    icon: 'share',
  },
  {
    key: 'export',
    label: '导出文件',
    description: '',
    icon: 'export',
  },
  {
    key: 'sync',
    label: '码表同步',
    description: '',
    icon: 'sync',
  },
]

export const dataPageHomeMock = {
  overview: dataOverviewMock,
  metrics: dataMetricCardsMock,
  trend: dataTrendMock,
  quickEntries: dataQuickEntriesMock,
}

export type DataPeriodKey = 'week' | 'month' | 'year'

export type DataPeriodOption = {
  key: DataPeriodKey
  label: string
}

export type DataRecordPreviewMetric = {
  label: string
  value: string
  tone?: string
}

export type DataRecordPreview = {
  title: string
  date: string
  tag: string
  metrics: DataRecordPreviewMetric[]
  highlightLabel: string
  highlightValue: string
  highlightTone?: string
}

export type DataPeriodPanelData = {
  trend: DataTrendCardData
}

export type DataWeekOption = {
  key: string
  year: number
  week: number
  startDate: string
  endDate: string
  hasData: boolean
  disabled: boolean
}

export const dataPeriodOptionsMock: DataPeriodOption[] = [
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
]

export const dataPeriodPanelsMock: Record<DataPeriodKey, DataPeriodPanelData> = {
  week: {
    trend: {
      eyebrow: '趋势图',
      title: '近 7 日里程趋势',
      description: '',
      totalDistance: '186.4km',
      totalDuration: '8h 36m',
      avgSpeed: '26.8km/h',
      bars: [
        { label: '周一|07/13', detailLabel: '周一 07/13', value: 18.2, height: '31%' },
        { label: '周二|07/14', detailLabel: '周二 07/14', value: 32.4, height: '54%' },
        { label: '周三|07/15', detailLabel: '周三 07/15', value: 24.1, height: '40%' },
        { label: '周四|07/16', detailLabel: '周四 07/16', value: 21.6, height: '36%' },
        { label: '周五|07/17', detailLabel: '周五 07/17', value: 27.3, height: '46%' },
        { label: '周六|07/18', detailLabel: '周六 07/18', value: 43.8, height: '73%', emphasis: true },
        { label: '周日|07/19', detailLabel: '周日 07/19', value: 19, height: '32%' },
      ],
    },
  },
  month: {
    trend: {
      eyebrow: '趋势图',
      title: '近 4 周里程趋势',
      description: '',
      totalDistance: '412.8km',
      totalDuration: '18h 42m',
      avgSpeed: '24.6km/h',
      bars: [
        { label: '第1周', detailLabel: '2026年7月第1周', value: 86, height: '38%' },
        { label: '第2周', detailLabel: '2026年7月第2周', value: 94, height: '44%' },
        { label: '第3周', detailLabel: '2026年7月第3周', value: 61, height: '28%' },
        { label: '第4周', detailLabel: '2026年7月第4周', value: 171, height: '76%', emphasis: true },
      ],
    },
  },
  year: {
    trend: {
      eyebrow: '趋势图',
      title: '近 12 月里程趋势',
      description: '',
      totalDistance: '2846.2km',
      totalDuration: '121h 36m',
      avgSpeed: '23.4km/h',
      bars: [
        { label: '1月', detailLabel: '2026年1月', value: 166, height: '32%' },
        { label: '2月', detailLabel: '2026年2月', value: 214, height: '42%' },
        { label: '3月', detailLabel: '2026年3月', value: 238, height: '46%' },
        { label: '4月', detailLabel: '2026年4月', value: 196, height: '38%' },
        { label: '5月', detailLabel: '2026年5月', value: 247, height: '48%' },
        { label: '6月', detailLabel: '2026年6月', value: 301, height: '58%' },
        { label: '7月', detailLabel: '2026年7月', value: 412, height: '76%', emphasis: true },
      ],
    },
  },
}

const demoWeekYear = 2026

const formatMonthDay = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}/${day}`
}

const getIsoWeekStart = (year: number, week: number) => {
  const januaryFourth = new Date(year, 0, 4)
  const mondayOffset = (januaryFourth.getDay() + 6) % 7
  const firstMonday = new Date(year, 0, 4 - mondayOffset)
  firstMonday.setDate(firstMonday.getDate() + (week - 1) * 7)
  return firstMonday
}

const getIsoWeekNumber = (date: Date) => {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const weekday = (target.getDay() + 6) % 7
  target.setDate(target.getDate() - weekday + 3)
  const isoYear = target.getFullYear()
  const firstThursday = new Date(isoYear, 0, 4)
  const firstWeekday = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - firstWeekday + 3)
  return {
    year: isoYear,
    week: 1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000),
  }
}

const getIsoWeeksInYear = (year: number) => getIsoWeekNumber(new Date(year, 11, 28)).week

const buildWeekBars = (week: number, values: number[]): DataTrendBar[] => {
  const weekStart = getIsoWeekStart(demoWeekYear, week)
  const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const maxValue = Math.max(...values)

  return values.map((value, index) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + index)
    const dateLabel = formatMonthDay(date)

    return {
      label: `${weekdays[index]}|${dateLabel}`,
      detailLabel: `${weekdays[index]} ${dateLabel}`,
      value,
      height: `${Math.round((value / Math.max(maxValue, 1)) * 76)}%`,
      emphasis: value === maxValue,
    }
  })
}

const createWeekPanel = (
  week: number,
  totalDistance: string,
  totalDuration: string,
  avgSpeed: string,
  values: number[],
): DataPeriodPanelData => ({
  trend: {
    eyebrow: '趋势图',
    title: `第${week}周每日里程趋势`,
    description: '',
    totalDistance,
    totalDuration,
    avgSpeed,
    bars: buildWeekBars(week, values),
  },
})

export const dataWeekPanelsMock: Record<string, DataPeriodPanelData> = {
  '2026-W27': createWeekPanel(27, '142.8km', '6h 21m', '22.5km/h', [14.2, 22.8, 0, 28.4, 19.6, 41.3, 16.5]),
  '2026-W28': createWeekPanel(28, '165.7km', '7h 08m', '23.2km/h', [20.6, 18.5, 31.2, 0, 26.7, 49.4, 19.3]),
  '2026-W29': dataPeriodPanelsMock.week,
  '2026-W30': createWeekPanel(30, '208.3km', '8h 12m', '25.4km/h', [24.8, 35.6, 29.2, 38.1, 22.7, 44.9, 13]),
  '2026-W31': createWeekPanel(31, '173.6km', '7h 26m', '23.4km/h', [16.4, 28.8, 20.5, 31.6, 25.2, 39.7, 11.4]),
}

export const emptyDataWeekPanelMock: DataPeriodPanelData = {
  trend: {
    eyebrow: '趋势图',
    title: '本周每日里程趋势',
    description: '',
    totalDistance: '0.0km',
    totalDuration: '--',
    avgSpeed: '--',
    bars: [],
  },
}

const currentIsoWeek = getIsoWeekNumber(new Date())
const currentDemoWeek = currentIsoWeek.year < demoWeekYear
  ? 0
  : currentIsoWeek.year > demoWeekYear
    ? getIsoWeeksInYear(demoWeekYear)
    : currentIsoWeek.week

export const dataWeekOptionsMock: DataWeekOption[] = Array.from(
  { length: getIsoWeeksInYear(demoWeekYear) },
  (_, index) => {
    const week = index + 1
    const start = getIsoWeekStart(demoWeekYear, week)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    const key = `${demoWeekYear}-W${String(week).padStart(2, '0')}`

    return {
      key,
      year: demoWeekYear,
      week,
      startDate: formatMonthDay(start),
      endDate: formatMonthDay(end),
      hasData: Boolean(dataWeekPanelsMock[key]),
      disabled: week > currentDemoWeek,
    }
  },
)

export type DataHistorySummary = {
  monthLabel: string
  totalDistance: string
  totalDuration: string
  totalRides: string
  longestRide: string
  syncStatus: string
}

export type RideHistoryItem = {
  id: string
  title: string
  subtitle: string
  date: string
  distance: string
  duration: string
  avgSpeed: string
  elevation: string
  calories: string
  tag: string
  highlightLabel: string
  highlightValue: string
  highlightTone?: string
}

export type RideMetricItem = {
  label: string
  value: string
  tone?: string
}

export type RideSplitItem = {
  label: string
  distance: string
  duration: string
  avgSpeed: string
}

export type RideChartData = {
  key: string
  label: string
  unit: string
  tone: string
  values: number[]
}

export type RideDetailData = {
  id: string
  title: string
  subtitle: string
  date: string
  routeName: string
  weather: string
  bikeName: string
  summary: string
  heroMetrics: RideMetricItem[]
  secondaryMetrics: RideMetricItem[]
  charts: RideChartData[]
  splits: RideSplitItem[]
}

export type LiveRideStat = {
  label: string
  value: string
  unit: string
}

export type LiveRideData = {
  title: string
  subtitle: string
  routeHint: string
  modeLabel: string
  elapsed: string
  distance: string
  currentSpeed: string
  avgSpeed: string
  cadence: string
  heartRate: string
  climbing: string
  statusNote: string
  supportMetrics: LiveRideStat[]
}

export type DataActionIcon = 'gpx' | 'fit'

export type DataActionOption = {
  key: string
  label: string
  description: string
  icon: DataActionIcon
}

export const dataHistorySummaryMock: DataHistorySummary = {
  monthLabel: '2026 年 7 月',
  totalDistance: '412.8km',
  totalDuration: '18h 42m',
  totalRides: '9 次',
  longestRide: '86.5km',
  syncStatus: '已同步 1 台码表，自动同步已开启',
}

export const rideHistoryMock: RideHistoryItem[] = [
  {
    id: 'ride-0715-recovery',
    title: '环城晨骑',
    subtitle: '',
    date: '07-15 06:40',
    distance: '42.6km',
    duration: '1h 48m',
    avgSpeed: '23.5km/h',
    elevation: '286m',
    calories: '621kcal',
    tag: '公路骑',
    highlightLabel: 'HighLight',
    highlightValue: '最大爬升 286m',
    highlightTone: 'text-brand-700',
  },
  {
    id: 'ride-0713-endurance',
    title: '南湖耐力骑',
    subtitle: '',
    date: '07-13 07:10',
    distance: '68.2km',
    duration: '2h 34m',
    avgSpeed: '26.4km/h',
    elevation: '412m',
    calories: '988kcal',
    tag: '耐力骑',
    highlightLabel: 'HighLight',
    highlightValue: '最长距离 68.2km',
    highlightTone: 'text-warning',
  },
  {
    id: 'ride-0711-interval',
    title: '东门间歇课',
    subtitle: '',
    date: '07-11 18:25',
    distance: '31.8km',
    duration: '1h 16m',
    avgSpeed: '25.1km/h',
    elevation: '198m',
    calories: '536kcal',
    tag: '间歇课',
    highlightLabel: 'HighLight',
    highlightValue: '平均功率 238w',
    highlightTone: 'text-danger',
  },
  {
    id: 'ride-0709-commute',
    title: '城市通勤',
    subtitle: '',
    date: '07-09 08:05',
    distance: '18.4km',
    duration: '0h 52m',
    avgSpeed: '21.2km/h',
    elevation: '96m',
    calories: '264kcal',
    tag: '通勤骑',
    highlightLabel: 'HighLight',
    highlightValue: '最快通勤 52 分钟',
    highlightTone: 'text-success',
  },
]

export const rideDetailMockMap: Record<string, RideDetailData> = {
  'ride-0715-recovery': {
    id: 'ride-0715-recovery',
    title: '环城晨骑',
    subtitle: '',
    date: '2026-07-15 06:40',
    routeName: '成都环城绿道西段',
    weather: '',
    bikeName: '',
    summary: '',
    heroMetrics: [
      { label: '骑行里程', value: '42.6km', tone: 'text-ink' },
      { label: '总时长', value: '1h 48m', tone: 'text-brand-700' },
      { label: '平均速度', value: '23.5km/h', tone: 'text-success' },
    ],
    secondaryMetrics: [
      { label: '爬升', value: '286m' },
      { label: '平均踏频', value: '87rpm' },
      { label: '平均心率', value: '142bpm' },
      { label: '消耗热量', value: '621kcal' },
      { label: '平均功率', value: '186w', tone: 'text-warning' },
      { label: '最大速度', value: '38.2km/h', tone: 'text-brand-700' },
    ],
    charts: [
      { key: 'speed', label: '速度', unit: 'km/h', tone: 'from-brand-700 to-brand-400', values: [18, 24, 26, 30, 28, 25, 22] },
      { key: 'heart-rate', label: '心率', unit: 'bpm', tone: 'from-danger to-#ff9b8f', values: [118, 134, 142, 151, 146, 139, 128] },
      { key: 'power', label: '功率', unit: 'w', tone: 'from-warning to-#ffd27a', values: [126, 174, 201, 228, 216, 192, 148] },
      { key: 'elevation', label: '海拔', unit: 'm', tone: 'from-ink to-brand-600', values: [502, 516, 528, 541, 548, 533, 521] },
      { key: 'calories', label: '卡路里', unit: 'kcal', tone: 'from-success to-#92e6b2', values: [82, 168, 254, 338, 426, 518, 621] },
    ],
    splits: [
      { label: '热身段', distance: '8.4km', duration: '22m', avgSpeed: '22.9km/h' },
      { label: '主训练段', distance: '21.7km', duration: '52m', avgSpeed: '25.0km/h' },
      { label: '放松段', distance: '12.5km', duration: '34m', avgSpeed: '22.1km/h' },
    ],
  },
  'ride-0713-endurance': {
    id: 'ride-0713-endurance',
    title: '南湖耐力骑',
    subtitle: '',
    date: '2026-07-13 07:10',
    routeName: '南湖公园环湖外圈',
    weather: '',
    bikeName: '',
    summary: '',
    heroMetrics: [
      { label: '骑行里程', value: '68.2km', tone: 'text-ink' },
      { label: '总时长', value: '2h 34m', tone: 'text-brand-700' },
      { label: '平均速度', value: '26.4km/h', tone: 'text-success' },
    ],
    secondaryMetrics: [
      { label: '爬升', value: '412m' },
      { label: '平均踏频', value: '90rpm' },
      { label: '平均心率', value: '149bpm' },
      { label: '消耗热量', value: '988kcal' },
      { label: '平均功率', value: '214w', tone: 'text-warning' },
      { label: '最大速度', value: '42.1km/h', tone: 'text-brand-700' },
    ],
    charts: [
      { key: 'speed', label: '速度', unit: 'km/h', tone: 'from-brand-700 to-brand-400', values: [24, 27, 29, 31, 30, 28, 26] },
      { key: 'heart-rate', label: '心率', unit: 'bpm', tone: 'from-danger to-#ff9b8f', values: [128, 138, 149, 155, 152, 146, 137] },
      { key: 'power', label: '功率', unit: 'w', tone: 'from-warning to-#ffd27a', values: [152, 188, 214, 246, 236, 205, 181] },
      { key: 'elevation', label: '海拔', unit: 'm', tone: 'from-ink to-brand-600', values: [488, 504, 536, 561, 572, 548, 521] },
      { key: 'calories', label: '卡路里', unit: 'kcal', tone: 'from-success to-#92e6b2', values: [126, 254, 412, 638, 774, 892, 988] },
    ],
    splits: [
      { label: '前 20km', distance: '20.0km', duration: '45m', avgSpeed: '26.6km/h' },
      { label: '中段', distance: '28.2km', duration: '64m', avgSpeed: '26.4km/h' },
      { label: '返程', distance: '20.0km', duration: '45m', avgSpeed: '26.2km/h' },
    ],
  },
}

export const liveRideMock: LiveRideData = {
  title: '实时骑行',
  subtitle: '',
  routeHint: '当前路线：锦城湖热身环线',
  modeLabel: '',
  elapsed: '00:00:00',
  distance: '0.0',
  currentSpeed: '0.0',
  avgSpeed: '0.0',
  cadence: '0',
  heartRate: '0',
  climbing: '0',
  statusNote: '',
  supportMetrics: [
    { label: '功率', value: '0', unit: 'w' },
    { label: '坡度', value: '0.0', unit: '%' },
    { label: '海拔', value: '0', unit: 'm' },
  ],
}

export const exportActionOptionsMock: DataActionOption[] = [
  {
    key: 'gpx',
    label: '导出 GPX',
    description: '用于地图工具或路线回放',
    icon: 'gpx',
  },
  {
    key: 'fit',
    label: '导出 FIT',
    description: '适配训练平台与码表生态',
    icon: 'fit',
  },
]

export const latestRideId = rideHistoryMock[0]?.id ?? 'ride-0715-recovery'
