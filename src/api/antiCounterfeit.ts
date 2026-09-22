import { primaryDeviceId } from '../data/device'

export type AntiCounterfeitStatus = 'genuine' | 'suspicious' | 'not-found'
export type AntiCounterfeitDeviceType = 'computer' | 'trainer' | 'derailleur' | 'seatpost' | 'unknown'

export type AntiCounterfeitRecord = {
  codeQueried: string
  sn: string
  productName: string
  productModel: string
  productCode: string
  deviceType: AntiCounterfeitDeviceType
  authenticityStatus: AntiCounterfeitStatus
  queryTime: string
  activationTime: string
  region: string
  storeName: string
  salesType: string
  activationState: string
  message: string
  manufacturer: string
  source: 'api' | 'mock'
  suggestedDeviceId?: string
}

type ApiPayload = Record<string, unknown>

const API_BASE_URL = import.meta.env.VITE_ANTI_COUNTERFEIT_API_BASE_URL?.trim() ?? ''
const API_TOKEN = import.meta.env.VITE_ANTI_COUNTERFEIT_API_TOKEN?.trim() ?? ''

export const antiCounterfeitSampleCodes = [
  'BCP-2026-00092',
  'DER-2025-10218',
  'SEA-2025-00071',
  'TRA-2024-00092',
  'DER-2025-99999',
] as const

const antiCounterfeitMockMap: Record<string, Omit<AntiCounterfeitRecord, 'codeQueried' | 'queryTime' | 'source'>> = {
  'BCP-2026-00092': {
    sn: 'BCP-2026-00092',
    productName: '蓝图智能码表 Pro',
    productModel: 'BCP Pro',
    productCode: 'BC-PRO',
    deviceType: 'computer',
    authenticityStatus: 'genuine',
    activationTime: '2026-07-07 13:43',
    region: '四川省',
    storeName: '测试-test',
    salesType: 'OE整车',
    activationState: '已激活',
    message: '该产品已通过防伪校验，可正常绑定与使用。',
    manufacturer: '蓝图骑行',
    suggestedDeviceId: primaryDeviceId,
  },
  'TRA-2024-00092': {
    sn: 'TRA-2024-00092',
    productName: '骑行台 BT01',
    productModel: 'BT01',
    productCode: 'BT01',
    deviceType: 'trainer',
    authenticityStatus: 'genuine',
    activationTime: '2026-06-18 10:26',
    region: '浙江省',
    storeName: '蓝图体验店-杭州',
    salesType: '直营门店',
    activationState: '已激活',
    message: '该骑行台为正品设备，支持继续进入设备页查看。',
    manufacturer: '蓝图骑行',
    suggestedDeviceId: 'device-trainer-bt01',
  },
  'DER-2025-10218': {
    sn: 'DER-2025-10218',
    productName: '电子变速器 E12',
    productModel: 'E12',
    productCode: 'E12',
    deviceType: 'derailleur',
    authenticityStatus: 'genuine',
    activationTime: '2026-05-20 09:18',
    region: '广东省',
    storeName: '深圳南山合作门店',
    salesType: '经销门店',
    activationState: '已激活',
    message: '该电子变速器已通过防伪校验，可继续查看设备详情。',
    manufacturer: '蓝图骑行',
    suggestedDeviceId: 'device-derailleur-e12',
  },
  'SEA-2025-00071': {
    sn: 'SEA-2025-00071',
    productName: '电子升降坐管 S1',
    productModel: 'S1',
    productCode: 'S1',
    deviceType: 'seatpost',
    authenticityStatus: 'genuine',
    activationTime: '2026-04-15 15:06',
    region: '江苏省',
    storeName: '蓝图合作门店-苏州',
    salesType: '售后更换',
    activationState: '已激活',
    message: '该电子升降坐管校验通过，设备来源可信。',
    manufacturer: '蓝图骑行',
    suggestedDeviceId: 'device-seatpost-s1',
  },
  'DER-2025-99999': {
    sn: 'DER-2025-99999',
    productName: '电子变速器 E12',
    productModel: 'E12',
    productCode: 'E12',
    deviceType: 'derailleur',
    authenticityStatus: 'suspicious',
    activationTime: '2026-07-02 16:20',
    region: '未知',
    storeName: '未识别门店',
    salesType: '异常来源',
    activationState: '异常激活',
    message: '该 SN 码存在异常查询记录，请联系门店或售后进一步核验。',
    manufacturer: '蓝图骑行',
    suggestedDeviceId: 'device-derailleur-e12',
  },
}

const createQueryTime = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const normalizeStatus = (value: unknown): AntiCounterfeitStatus => {
  if (typeof value === 'string') {
    const normalized = value.toLowerCase()
    if (['genuine', 'authentic', 'valid', 'success', '正品'].includes(normalized)) {
      return 'genuine'
    }
    if (['suspicious', 'risk', 'warning', '异常'].includes(normalized)) {
      return 'suspicious'
    }
  }
  return 'not-found'
}

const normalizeDeviceType = (value: unknown): AntiCounterfeitDeviceType => {
  if (typeof value !== 'string') {
    return 'unknown'
  }

  const normalized = value.toLowerCase()
  if (normalized.includes('computer') || normalized.includes('bike-computer') || normalized.includes('码表')) {
    return 'computer'
  }
  if (normalized.includes('trainer') || normalized.includes('骑行台')) {
    return 'trainer'
  }
  if (normalized.includes('derailleur') || normalized.includes('变速')) {
    return 'derailleur'
  }
  if (normalized.includes('seatpost') || normalized.includes('坐管')) {
    return 'seatpost'
  }
  return 'unknown'
}

const normalizeRecord = (payload: ApiPayload, code: string): AntiCounterfeitRecord => {
  const sn = String(payload.sn ?? payload.serialNumber ?? payload.snCode ?? code).trim()
  const productCode = String(payload.productCode ?? payload.modelCode ?? payload.goodsCode ?? '').trim()
  return {
    codeQueried: code,
    sn,
    productName: String(payload.productName ?? payload.name ?? payload.product_title ?? '未识别产品'),
    productModel: String(payload.productModel ?? payload.model ?? payload.product_code ?? '--'),
    productCode: productCode || '--',
    deviceType: normalizeDeviceType(payload.deviceType ?? payload.category ?? payload.device_name ?? payload.productType),
    authenticityStatus: normalizeStatus(payload.authenticityStatus ?? payload.status ?? payload.verifyStatus),
    queryTime: String(payload.queryTime ?? payload.checkedAt ?? createQueryTime()),
    activationTime: String(payload.activationTime ?? payload.activatedAt ?? payload.activeTime ?? '--'),
    region: String(payload.region ?? payload.area ?? payload.province ?? '--'),
    storeName: String(payload.storeName ?? payload.sellerStore ?? payload.shopName ?? '--'),
    salesType: String(payload.salesType ?? payload.saleType ?? payload.channelType ?? '--'),
    activationState: String(payload.activationState ?? payload.activeStatus ?? payload.activationStatus ?? '--'),
    message: String(payload.message ?? payload.tip ?? payload.description ?? '已完成防伪查询'),
    manufacturer: String(payload.manufacturer ?? payload.brand ?? '甲方品牌'),
    source: 'api',
    suggestedDeviceId: typeof payload.suggestedDeviceId === 'string' ? payload.suggestedDeviceId : undefined,
  }
}

const buildMockRecord = (code: string): AntiCounterfeitRecord => {
  const normalizedCode = code.trim().toUpperCase()
  const matched = antiCounterfeitMockMap[normalizedCode]
  if (!matched) {
    return {
      codeQueried: normalizedCode,
      sn: normalizedCode,
      productName: '未查到对应产品',
      productModel: '--',
      productCode: '--',
      deviceType: 'unknown',
      authenticityStatus: 'not-found',
      queryTime: createQueryTime(),
      activationTime: '--',
      region: '--',
      storeName: '--',
      salesType: '--',
      activationState: '未激活',
      message: '未查询到该 SN 码的防伪信息，请核对后重新扫码或联系门店。',
      manufacturer: '蓝图骑行',
      source: 'mock',
    }
  }

  return {
    ...matched,
    codeQueried: normalizedCode,
    queryTime: createQueryTime(),
    source: 'mock',
  }
}

export const queryAntiCounterfeitByCode = async (code: string): Promise<AntiCounterfeitRecord> => {
  const normalizedCode = code.trim().toUpperCase()
  if (!normalizedCode) {
    throw new Error('防伪码不能为空')
  }

  if (!API_BASE_URL) {
    return buildMockRecord(normalizedCode)
  }

  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/anti-counterfeit/query?code=${encodeURIComponent(normalizedCode)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      },
    })

    if (!response.ok) {
      throw new Error(`API 响应异常：${response.status}`)
    }

    const payload = await response.json() as ApiPayload
    return normalizeRecord(payload, normalizedCode)
  }
  catch {
    // 演示环境没有甲方接口时，自动回退到本地 mock，保证扫码链路可继续联调。
    return buildMockRecord(normalizedCode)
  }
}
