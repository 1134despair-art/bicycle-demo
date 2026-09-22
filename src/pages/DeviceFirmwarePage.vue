<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { firmwareInfoMock, primaryDeviceId } from '../data/device'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const isUpdating = ref(false)
const updateProgress = ref(0)
const updateResult = ref<'idle' | 'success'>('idle')

const deviceId = computed(() => (typeof route.params.deviceId === 'string' ? route.params.deviceId : primaryDeviceId))
const device = computed(() => deviceStore.getDeviceById(deviceId.value))
type DerailleurComponentKey = 'front' | 'rear' | 'controller'
type FirmwareMeta = {
  currentVersion: string
  latestVersion: string
  changelog: string[]
}

const derailleurComponentCatalog: Record<DerailleurComponentKey, FirmwareMeta & { label: string }> = {
  front: {
    label: '前拨',
    currentVersion: 'v1.7.8',
    latestVersion: 'v1.8.1',
    changelog: [
      '优化前拨换挡响应速度',
      '提升链条负载较高时的换挡稳定性',
      '修复偶发的档位状态同步延迟',
    ],
  },
  rear: {
    label: '后拨',
    currentVersion: 'v1.9.3',
    latestVersion: 'v1.9.6',
    changelog: [
      '优化后拨连续换挡的执行精度',
      '提升复杂路况下的档位保持稳定性',
      '降低低电量状态下的通信延迟',
    ],
  },
  controller: {
    label: '控制器',
    currentVersion: 'v2.0.4',
    latestVersion: 'v2.0.7',
    changelog: [
      '优化按键指令识别速度',
      '提升左右控制器连接稳定性',
      '修复快速连续操作时的指令丢失问题',
    ],
  },
}
const componentKey = computed<DerailleurComponentKey | null>(() => {
  const component = route.query.component
  return component === 'front' || component === 'rear' || component === 'controller' ? component : null
})
const componentFirmware = computed(() => componentKey.value ? derailleurComponentCatalog[componentKey.value] : null)
const firmwareTargetLabel = computed(() => componentFirmware.value?.label ?? device.value?.name ?? '设备')
const pageTitle = computed(() => componentFirmware.value ? `${componentFirmware.value.label}固件升级` : '固件检测')
const firmwareCatalog: Record<string, { latestVersion: string, changelog: string[] }> = {
  'device-trainer-bt01': {
    latestVersion: 'v2.1.3',
    changelog: [
      '优化阻力模式下的功率响应稳定性',
      '修复高踏频场景下的路感模拟抖动',
      '提升固件升级过程中的蓝牙传输可靠性',
    ],
  },
  'device-trainer-bt02': {
    latestVersion: 'v1.8.6',
    changelog: ['当前版本已是最新版本'],
  },
}
const firmwareMeta = computed(() => {
  if (!device.value) {
    return null
  }

  if (componentFirmware.value) {
    return componentFirmware.value
  }

  if (device.value.id === primaryDeviceId) {
    return firmwareInfoMock
  }

  const catalog = firmwareCatalog[device.value.id]
  return {
    currentVersion: device.value.firmware,
    latestVersion: catalog?.latestVersion ?? device.value.firmware,
    changelog: catalog?.changelog ?? ['当前版本已是最新版本'],
  }
})

const canUpdate = computed(() => Boolean(
  firmwareMeta.value
  && firmwareMeta.value.currentVersion !== firmwareMeta.value.latestVersion,
))

const goBack = () => {
  if (route.query.source === 'notification') {
    void router.push({ path: '/my/notifications', query: { category: 'firmware' } })
    return
  }

  if (device.value) {
    void router.push(`/device/${device.value.id}`)
    return
  }

  void router.push('/device')
}

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

  appStore.showToast('我的模块将在下一阶段开发')
}

const handleUpdate = () => {
  if (!firmwareMeta.value || !device.value) {
    appStore.showToast('设备不存在，无法检查固件')
    return
  }

  if (!canUpdate.value) {
    appStore.showToast('当前已是最新版本')
    return
  }

  isUpdating.value = true
  updateResult.value = 'idle'
  updateProgress.value = 12
  appStore.showToast('固件升级已开始，请勿断开设备')

  window.setTimeout(() => {
    updateProgress.value = 68
  }, 500)

  window.setTimeout(() => {
    updateProgress.value = 100
    isUpdating.value = false
    updateResult.value = 'success'
    appStore.showToast(`${firmwareTargetLabel.value}固件已更新至 ${firmwareMeta.value?.latestVersion ?? ''}`)
  }, 1200)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <div>
          <PageNavBar class="-mx-4" :title="pageTitle" @back="goBack" />

          <section v-if="!device || !firmwareMeta" class="app-card mt-4 p-5 text-center">
            <h2 class="text-[17px] font-700 text-ink">设备不存在</h2>
            <p class="mt-2 text-[12px] leading-5 text-muted">该设备可能已解绑或已从设备列表移除。</p>
            <button class="app-primary-button mt-5 w-full px-4 text-[13px]" type="button" @click="router.push('/device')">
              返回设备列表
            </button>
          </section>

          <section v-else class="app-card mt-4 p-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-[15px] font-700 text-ink">{{ firmwareTargetLabel }}固件版本</h2>
              <span class="rounded-full bg-brand-500 px-3 py-1 text-[11px] font-700 text-white">{{ firmwareMeta.latestVersion }}</span>
            </div>

              <div class="mt-4 rounded-lg bg-soft px-4 py-3">
              <div class="flex items-center justify-between text-[12px]">
                <span class="text-muted">当前版本</span>
                <span class="font-700 text-ink">{{ firmwareMeta.currentVersion }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between text-[12px]">
                <span class="text-muted">最新版本</span>
                <span class="font-700 text-brand-700">{{ firmwareMeta.latestVersion }}</span>
              </div>
            </div>

            <p class="mt-4 text-[12px] text-muted">更新日志:</p>
            <ul class="mt-2 space-y-2 text-[12px] leading-[1.7] text-muted">
              <li
                v-for="item in firmwareMeta.changelog"
                :key="item"
                class="pl-3 relative"
              >
                <span class="absolute left-0 top-[8px] h-1 w-1 rounded-full bg-muted" />
                {{ item }}
              </li>
            </ul>
          </section>

          <div v-if="firmwareMeta && isUpdating" class="app-card mt-4 p-4">
            <div class="flex items-center justify-between text-[12px]">
              <span class="font-700 text-ink">升级进度</span>
              <span class="font-700 text-brand-700">{{ updateProgress }}%</span>
            </div>
            <div class="mt-3 h-2 overflow-hidden rounded-full bg-[#EEF2F6]">
              <div class="h-full rounded-full bg-brand-500 transition-all" :style="{ width: `${updateProgress}%` }" />
            </div>
          </div>

          <div v-else-if="firmwareMeta && updateResult === 'success'" class="app-card mt-4 p-4">
            <p class="text-[13px] font-700 text-[#15935F]">升级完成</p>
            <p class="mt-2 text-[12px] leading-[1.7] text-muted">{{ firmwareTargetLabel }}固件已升级到 {{ firmwareMeta.latestVersion }}，可返回详情页继续使用。</p>
          </div>

          <button
            v-if="device && firmwareMeta"
            class="app-primary-button mt-6 w-full px-4 text-[13px]"
            :class="canUpdate ? 'bg-brand-500' : 'bg-[#B9C3D5]'"
            type="button"
            @click="handleUpdate"
          >
            {{ canUpdate ? `升级${firmwareTargetLabel}固件` : '当前已是最新版本' }}
          </button>
        </div>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
