import type { AntiCounterfeitRecord } from '../api/antiCounterfeit'

const productCodeRouteMap: Record<string, string> = {
  'BC-PRO': '/device/device-bike-computer-pro',
  BT01: '/device/device-trainer-bt01',
  E12: '/device/device-derailleur-e12',
  E11: '/device/device-derailleur-e11',
  S1: '/device/device-seatpost-s1',
  S2: '/device/device-seatpost-s2',
}

const deviceTypeRouteMap: Record<AntiCounterfeitRecord['deviceType'], string | null> = {
  computer: '/device/device-bike-computer-pro',
  trainer: '/device/device-trainer-bt01',
  derailleur: '/device/device-derailleur-e12',
  seatpost: '/device/device-seatpost-s1',
  unknown: null,
}

export const resolveAntiCounterfeitDevicePath = (record: AntiCounterfeitRecord) => {
  if (record.suggestedDeviceId) {
    return `/device/${record.suggestedDeviceId}`
  }

  const normalizedProductCode = record.productCode.trim().toUpperCase()
  if (normalizedProductCode && productCodeRouteMap[normalizedProductCode]) {
    return productCodeRouteMap[normalizedProductCode]
  }

  const normalizedSn = record.sn.trim().toUpperCase()
  if (normalizedSn.startsWith('BCP-')) {
    return '/device/device-bike-computer-pro'
  }
  if (normalizedSn.startsWith('TRA-')) {
    return '/device/device-trainer-bt01'
  }
  if (normalizedSn.startsWith('DER-')) {
    return normalizedSn.includes('E11') ? '/device/device-derailleur-e11' : '/device/device-derailleur-e12'
  }
  if (normalizedSn.startsWith('SEA-')) {
    return normalizedSn.includes('S2') ? '/device/device-seatpost-s2' : '/device/device-seatpost-s1'
  }

  return deviceTypeRouteMap[record.deviceType]
}
