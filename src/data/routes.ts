import type { RideDetailData } from './data'

export type RouteSourceType = '地图规划' | '历史轨迹' | '文件导入'
export type RouteDifficulty = '轻松' | '中等' | '进阶'

export type RoutePlannerEntry = {
  key: 'map' | 'history' | 'import'
  label: string
  title: string
  description: string
}

export type RoutePoint = {
  label: string
  name: string
  note?: string
}

export type RouteElevationPoint = {
  distance: number
  altitude: number
}

export type SavedRouteItem = {
  id: string
  name: string
  source: RouteSourceType
  distance: string
  elevation: string
  difficulty: RouteDifficulty
  image: string
  description: string
  createdAt: string
  isFavorite: boolean
  deviceOnline: boolean
  startPoint: RoutePoint
  viaPoints: RoutePoint[]
  endPoint: RoutePoint
  elevationSeries: RouteElevationPoint[]
}

export type OfficialRouteItem = Omit<
  SavedRouteItem,
  'source' | 'createdAt' | 'isFavorite' | 'deviceOnline'
> & {
  officialTag: string
  region: string
  recommendedReason: string
}

export type RouteImportPreview = {
  fileName: string
  format: 'GPX' | 'FIT'
  distance: string
  elevation: string
  image: string
}

export const routePlannerEntries: RoutePlannerEntry[] = [
  {
    key: 'map',
    label: '地图规划',
    title: '地图规划',
    description: '选择起点、途经点和终点生成路线。',
  },
  {
    key: 'history',
    label: '历史轨迹',
    title: '历史生成',
    description: '将历史骑行记录快速沉淀为路线。',
  },
  {
    key: 'import',
    label: '文件导入',
    title: '导入 GPX/FIT',
    description: '导入现有路书文件继续复用。',
  },
]

const routeMapImage =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=clean%20mobile%20cycling%20route%20map%20preview%2C%20light%20gray%20roads%2C%20green%20park%20areas%2C%20blue%20water%2C%20dark%20route%20line%2C%20premium%20fitness%20app%20style&image_size=landscape_16_9'

export const officialRouteLibraryMock: OfficialRouteItem[] = [
  {
    id: 'official-route-001',
    name: '青龙湖官方热身线',
    distance: '32.6km',
    elevation: '218m',
    difficulty: '轻松',
    image: routeMapImage,
    description: '平路占比高，补给点清晰，适合作为城市耐力基础训练。',
    officialTag: '官方精选',
    region: '成都东部绿道',
    recommendedReason: '适合新手热身与日常恢复骑行。',
    startPoint: { label: '起点', name: '青龙湖湿地东门' },
    viaPoints: [
      { label: '途经点', name: '湖心栈桥', note: '拍照点' },
      { label: '途经点', name: '绿道补给站' },
    ],
    endPoint: { label: '终点', name: '青龙湖游客中心' },
    elevationSeries: [
      { distance: 0, altitude: 486 },
      { distance: 8, altitude: 494 },
      { distance: 16, altitude: 502 },
      { distance: 24, altitude: 496 },
      { distance: 32.6, altitude: 489 },
    ],
  },
  {
    id: 'official-route-002',
    name: '天府绿道官方进阶线',
    distance: '68.2km',
    elevation: '762m',
    difficulty: '中等',
    image: routeMapImage,
    description: '包含巡航与缓坡混合路段，适合周末中长距离专项拉练。',
    officialTag: '赛事推荐',
    region: '成都南部绿心',
    recommendedReason: '适合具备稳定巡航能力的进阶骑手。',
    startPoint: { label: '起点', name: '麓湖水城驿站' },
    viaPoints: [
      { label: '途经点', name: '鹿溪河绿道' },
      { label: '途经点', name: '科学城观景平台', note: '缓坡段' },
    ],
    endPoint: { label: '终点', name: '兴隆湖骑行广场' },
    elevationSeries: [
      { distance: 0, altitude: 484 },
      { distance: 18, altitude: 536 },
      { distance: 34, altitude: 578 },
      { distance: 52, altitude: 551 },
      { distance: 68.2, altitude: 497 },
    ],
  },
]

export const routeLibraryMock: SavedRouteItem[] = [
  {
    id: 'route-001',
    name: '锦城湖晨骑环线',
    source: '地图规划',
    distance: '38.4km',
    elevation: '286m',
    difficulty: '轻松',
    image: routeMapImage,
    description: '适合晨骑热身与节奏恢复的城市绿道路线。',
    createdAt: '2026-07-16 07:20',
    isFavorite: true,
    deviceOnline: true,
    startPoint: { label: '起点', name: '锦城湖东门' },
    viaPoints: [
      { label: '途经点', name: '南湖桥', note: '补给点' },
      { label: '途经点', name: '绕城绿道入口' },
    ],
    endPoint: { label: '终点', name: '锦城湖西门' },
    elevationSeries: [
      { distance: 0, altitude: 488 },
      { distance: 8, altitude: 512 },
      { distance: 16, altitude: 501 },
      { distance: 26, altitude: 528 },
      { distance: 38.4, altitude: 490 },
    ],
  },
  {
    id: 'route-002',
    name: '龙泉山进阶爬坡',
    source: '文件导入',
    distance: '62.8km',
    elevation: '914m',
    difficulty: '进阶',
    image: routeMapImage,
    description: '适合周末爬坡训练与耐力进阶使用。',
    createdAt: '2026-07-14 06:45',
    isFavorite: false,
    deviceOnline: false,
    startPoint: { label: '起点', name: '十陵地铁站' },
    viaPoints: [
      { label: '途经点', name: '龙泉山观景台', note: '补水休整' },
      { label: '途经点', name: '山脊爬坡段' },
    ],
    endPoint: { label: '终点', name: '洛带古镇' },
    elevationSeries: [
      { distance: 0, altitude: 472 },
      { distance: 14, altitude: 596 },
      { distance: 28, altitude: 721 },
      { distance: 46, altitude: 688 },
      { distance: 62.8, altitude: 544 },
    ],
  },
  {
    id: 'route-003',
    name: '南湖耐力巡航',
    source: '历史轨迹',
    distance: '54.1km',
    elevation: '428m',
    difficulty: '中等',
    image: routeMapImage,
    description: '城市外环耐力路线，适合长距离巡航训练。',
    createdAt: '2026-07-12 18:30',
    isFavorite: true,
    deviceOnline: true,
    startPoint: { label: '起点', name: '南湖公园北门' },
    viaPoints: [
      { label: '途经点', name: '怡心湖连通道' },
      { label: '途经点', name: '江安河绿道', note: '顺风巡航路段' },
    ],
    endPoint: { label: '终点', name: '麓湖生态城' },
    elevationSeries: [
      { distance: 0, altitude: 483 },
      { distance: 12, altitude: 498 },
      { distance: 24, altitude: 506 },
      { distance: 38, altitude: 492 },
      { distance: 54.1, altitude: 487 },
    ],
  },
]

export const routeImportPreviewMock: RouteImportPreview = {
  fileName: 'longquan-climb.gpx',
  format: 'GPX',
  distance: '62.8km',
  elevation: '914m',
  image: routeMapImage,
}

const pickDifficulty = (distanceText: string): RouteDifficulty => {
  const distance = Number.parseFloat(distanceText)
  if (Number.isNaN(distance) || distance < 40) {
    return '轻松'
  }
  if (distance < 70) {
    return '中等'
  }
  return '进阶'
}

export const createSavedRouteFromRide = (detail: RideDetailData): SavedRouteItem => {
  const distance = detail.heroMetrics[0]?.value ?? '0km'
  const elevation = detail.secondaryMetrics.find((item) => item.label === '爬升')?.value ?? '0m'
  const routeName = detail.routeName || detail.title || '新建路线'

  return {
    id: `route-${Date.now()}`,
    name: routeName,
    source: '历史轨迹',
    distance,
    elevation,
    difficulty: pickDifficulty(distance),
    image: routeMapImage,
    description: '由骑行详情一键保存，已可在路线页继续查看与下发。',
    createdAt: '刚刚创建',
    isFavorite: false,
    deviceOnline: true,
    startPoint: { label: '起点', name: '本次骑行起点' },
    viaPoints: [{ label: '途经点', name: '历史轨迹自动生成', note: detail.date }],
    endPoint: { label: '终点', name: routeName },
    elevationSeries: [
      { distance: 0, altitude: 485 },
      { distance: 10, altitude: 512 },
      { distance: 20, altitude: 534 },
      { distance: 30, altitude: 506 },
      { distance: Number.parseFloat(distance) || 40, altitude: 492 },
    ],
  }
}

export const createSavedRouteFromOfficial = (route: OfficialRouteItem): SavedRouteItem => {
  return {
    id: `route-${Date.now()}`,
    name: route.name,
    source: '地图规划',
    distance: route.distance,
    elevation: route.elevation,
    difficulty: route.difficulty,
    image: route.image,
    description: route.recommendedReason || route.description,
    createdAt: '刚刚保存',
    isFavorite: false,
    deviceOnline: true,
    startPoint: route.startPoint,
    viaPoints: route.viaPoints,
    endPoint: route.endPoint,
    elevationSeries: route.elevationSeries,
  }
}
