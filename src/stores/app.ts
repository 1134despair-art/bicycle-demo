import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import type { RideDetailData } from '../data/data'
import type { OfficialRouteItem, SavedRouteItem } from '../data/routes'
import { createSavedRouteFromOfficial, routeLibraryMock } from '../data/routes'

const SAVED_ROUTES_STORAGE_KEY = 'bicycle-demo:saved-routes'
const ROUTE_DRAFT_STORAGE_KEY = 'bicycle-demo:route-draft'

const cloneSavedRoute = (route: SavedRouteItem): SavedRouteItem => ({
  ...route,
  startPoint: { ...route.startPoint },
  viaPoints: route.viaPoints.map((point) => ({ ...point })),
  endPoint: { ...route.endPoint },
  elevationSeries: route.elevationSeries.map((point) => ({ ...point })),
})

type RouteBusinessComparable = Pick<
  SavedRouteItem,
  'name' | 'distance' | 'elevation' | 'startPoint' | 'viaPoints' | 'endPoint'
>

const createRouteBusinessKey = (route: RouteBusinessComparable) => {
  const serializePoint = (point: SavedRouteItem['startPoint']) =>
    [point.label, point.name, point.note ?? ''].join('|')

  return [
    route.name.trim(),
    route.distance.trim(),
    route.elevation.trim(),
    serializePoint(route.startPoint),
    route.viaPoints.map(serializePoint).join('::'),
    serializePoint(route.endPoint),
  ].join('##')
}

const createDefaultSavedRoutes = () => routeLibraryMock.map(cloneSavedRoute)

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const isRoutePoint = (value: unknown): value is SavedRouteItem['startPoint'] => {
  if (!value || typeof value !== 'object') {
    return false
  }

  return typeof (value as SavedRouteItem['startPoint']).label === 'string'
    && typeof (value as SavedRouteItem['startPoint']).name === 'string'
    && (
      typeof (value as SavedRouteItem['startPoint']).note === 'undefined'
      || typeof (value as SavedRouteItem['startPoint']).note === 'string'
    )
}

const isElevationPoint = (value: unknown): value is SavedRouteItem['elevationSeries'][number] => {
  if (!value || typeof value !== 'object') {
    return false
  }

  return typeof (value as SavedRouteItem['elevationSeries'][number]).distance === 'number'
    && typeof (value as SavedRouteItem['elevationSeries'][number]).altitude === 'number'
}

const isSavedRouteItem = (value: unknown): value is SavedRouteItem => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const route = value as SavedRouteItem

  return typeof route.id === 'string'
    && typeof route.name === 'string'
    && typeof route.source === 'string'
    && typeof route.distance === 'string'
    && typeof route.elevation === 'string'
    && typeof route.difficulty === 'string'
    && typeof route.image === 'string'
    && typeof route.description === 'string'
    && typeof route.createdAt === 'string'
    && typeof route.isFavorite === 'boolean'
    && typeof route.deviceOnline === 'boolean'
    && isRoutePoint(route.startPoint)
    && Array.isArray(route.viaPoints)
    && route.viaPoints.every(isRoutePoint)
    && isRoutePoint(route.endPoint)
    && Array.isArray(route.elevationSeries)
    && route.elevationSeries.every(isElevationPoint)
}

const readSavedRoutes = () => {
  if (!canUseStorage()) {
    return createDefaultSavedRoutes()
  }

  try {
    const rawValue = window.localStorage.getItem(SAVED_ROUTES_STORAGE_KEY)
    if (!rawValue) {
      return createDefaultSavedRoutes()
    }

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue) || !parsedValue.every(isSavedRouteItem)) {
      return createDefaultSavedRoutes()
    }

    return parsedValue.map(cloneSavedRoute)
  }
  catch {
    return createDefaultSavedRoutes()
  }
}

const readRouteDraft = () => {
  if (!canUseStorage()) {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(ROUTE_DRAFT_STORAGE_KEY)
    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue)
    return isSavedRouteItem(parsedValue) ? cloneSavedRoute(parsedValue) : null
  }
  catch {
    return null
  }
}

const persistSavedRoutes = (routes: SavedRouteItem[]) => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(SAVED_ROUTES_STORAGE_KEY, JSON.stringify(routes))
}

const persistRouteDraft = (route: SavedRouteItem | null) => {
  if (!canUseStorage()) {
    return
  }

  if (!route) {
    window.localStorage.removeItem(ROUTE_DRAFT_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(ROUTE_DRAFT_STORAGE_KEY, JSON.stringify(route))
}

export const useAppStore = defineStore('app', () => {
  const isOffline = ref(false)
  const isLoading = ref(false)
  const bikeComputerConnected = ref(true)
  const rideStatus = ref<'idle' | 'riding' | 'paused'>('idle')
  const demoMode = ref<'default' | 'empty' | 'offline'>('default')
  const toastMessage = ref('')
  const toastVisible = ref(false)
  const dialogVisible = ref(false)
  const liveRideResult = ref<RideDetailData | null>(null)
  const savedRoutes = ref<SavedRouteItem[]>(readSavedRoutes())
  const routeDraft = ref<SavedRouteItem | null>(readRouteDraft())

  watch(savedRoutes, (value) => {
    persistSavedRoutes(value)
  }, { deep: true })

  watch(routeDraft, (value) => {
    persistRouteDraft(value)
  }, { deep: true })

  const showToast = (message: string) => {
    const nextMessage = message.trim()
    const showToastState = showToast as typeof showToast & {
      hideTimer?: number
      revealTimer?: number
    }

    toastMessage.value = nextMessage
    toastVisible.value = false

    if (typeof window === 'undefined') {
      toastVisible.value = true
      return
    }

    window.clearTimeout(showToastState.hideTimer)
    window.clearTimeout(showToastState.revealTimer)

    showToastState.revealTimer = window.setTimeout(() => {
      toastVisible.value = true
      showToastState.hideTimer = window.setTimeout(() => {
        toastVisible.value = false
      }, 2600)
    }, 24)
  }

  const setDemoMode = (mode: 'default' | 'empty' | 'offline') => {
    demoMode.value = mode
    isOffline.value = mode === 'offline'
  }

  const hasRouteCard = computed(() => demoMode.value !== 'empty')

  const setLiveRideResult = (detail: RideDetailData) => {
    liveRideResult.value = detail
  }

  const clearLiveRideResult = () => {
    liveRideResult.value = null
  }

  const isRideInProgress = computed(() => rideStatus.value !== 'idle')

  const startRideSession = () => {
    rideStatus.value = 'riding'
  }

  const pauseRideSession = () => {
    rideStatus.value = 'paused'
  }

  const resumeRideSession = () => {
    rideStatus.value = 'riding'
  }

  const finishRideSession = () => {
    rideStatus.value = 'idle'
  }

  const prependSavedRoute = (route: SavedRouteItem) => {
    savedRoutes.value = [cloneSavedRoute(route), ...savedRoutes.value]
  }

  const setRouteDraft = (route: SavedRouteItem) => {
    routeDraft.value = cloneSavedRoute(route)
  }

  const updateRouteDraftMeta = (payload: {
    name: string
    description: string
  }) => {
    if (!routeDraft.value) {
      return
    }

    routeDraft.value = {
      ...cloneSavedRoute(routeDraft.value),
      name: payload.name,
      description: payload.description,
    }
  }

  const clearRouteDraft = () => {
    routeDraft.value = null
  }

  const toggleFavoriteRoute = (routeId: string) => {
    savedRoutes.value = savedRoutes.value.map((item) =>
      item.id === routeId ? { ...item, isFavorite: !item.isFavorite } : item,
    )
  }

  const removeSavedRoute = (routeId: string) => {
    savedRoutes.value = savedRoutes.value.filter((item) => item.id !== routeId)
  }

  const updateSavedRouteName = (routeId: string, name: string) => {
    const nextName = name.trim()
    if (!nextName) {
      return false
    }

    let hasUpdated = false
    savedRoutes.value = savedRoutes.value.map((item) => {
      if (item.id !== routeId) {
        return item
      }

      hasUpdated = true
      return {
        ...item,
        name: nextName,
      }
    })

    return hasUpdated
  }

  const hasSavedRouteByOfficialRoute = (route: OfficialRouteItem) => {
    const officialRouteKey = createRouteBusinessKey(route)
    return savedRoutes.value.some((item) => createRouteBusinessKey(item) === officialRouteKey)
  }

  const addOfficialRouteToSaved = (route: OfficialRouteItem) => {
    if (hasSavedRouteByOfficialRoute(route)) {
      showToast('该路线已在我的路线中')
      return false
    }

    const nextRoute = cloneSavedRoute(createSavedRouteFromOfficial(route))
    savedRoutes.value = [nextRoute, ...savedRoutes.value]
    showToast(`已加入我的路线：${route.name}`)
    return true
  }

  const saveDraftRoute = (payload: {
    name: string
    description: string
  }) => {
    if (!routeDraft.value) {
      return null
    }

    const nextRoute: SavedRouteItem = {
      ...cloneSavedRoute(routeDraft.value),
      id: `route-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      createdAt: '刚刚创建',
    }

    savedRoutes.value = [nextRoute, ...savedRoutes.value]
    routeDraft.value = null
    return nextRoute
  }

  return {
    clearLiveRideResult,
    clearRouteDraft,
    bikeComputerConnected,
    demoMode,
    dialogVisible,
    finishRideSession,
    hasRouteCard,
    hasSavedRouteByOfficialRoute,
    isLoading,
    isOffline,
    isRideInProgress,
    liveRideResult,
    pauseRideSession,
    addOfficialRouteToSaved,
    prependSavedRoute,
    removeSavedRoute,
    routeDraft,
    rideStatus,
    resumeRideSession,
    savedRoutes,
    saveDraftRoute,
    setDemoMode,
    setLiveRideResult,
    setRouteDraft,
    startRideSession,
    showToast,
    toastMessage,
    toastVisible,
    toggleFavoriteRoute,
    updateSavedRouteName,
    updateRouteDraftMeta,
  }
})
