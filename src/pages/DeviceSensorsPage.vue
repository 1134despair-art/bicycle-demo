<script setup lang="ts">
import { Bike, Bluetooth, HeartPulse, Trash2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppDialog from '../components/feedback/AppDialog.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'

const router = useRouter()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)
const { connectedSensors } = storeToRefs(deviceStore)
const openSensorId = ref<string | null>(null)
const pendingUnbindSensorId = ref<string | null>(null)
const swipeStartX = ref(0)
const swipingSensorId = ref<string | null>(null)
const didSwipe = ref(false)

const pendingUnbindSensor = computed(() =>
  connectedSensors.value.find((item) => item.id === pendingUnbindSensorId.value) ?? null,
)

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

const getSensorIcon = (name: string) => {
  if (name.includes('心率')) {
    return HeartPulse
  }
  return name.includes('速度') ? Bike : Bluetooth
}

const handlePointerDown = (sensorId: string, event: PointerEvent) => {
  swipingSensorId.value = sensorId
  swipeStartX.value = event.clientX
}

const handlePointerUp = (sensorId: string, event: PointerEvent) => {
  if (swipingSensorId.value !== sensorId) {
    return
  }

  const distance = event.clientX - swipeStartX.value
  if (distance < -36) {
    didSwipe.value = true
    openSensorId.value = sensorId
  }
  else if (distance > 24) {
    didSwipe.value = true
    openSensorId.value = null
  }

  swipingSensorId.value = null
}

const handlePointerCancel = () => {
  swipingSensorId.value = null
}

const handleSensorRowClick = (sensorId: string) => {
  if (didSwipe.value) {
    didSwipe.value = false
    return
  }

  if (openSensorId.value === sensorId) {
    openSensorId.value = null
  }
}

const requestUnbind = (sensorId: string) => {
  pendingUnbindSensorId.value = sensorId
}

const confirmUnbind = () => {
  if (!pendingUnbindSensorId.value) {
    return
  }

  const sensorName = pendingUnbindSensor.value?.name ?? '传感器'
  const result = deviceStore.unbindSensor(pendingUnbindSensorId.value)
  pendingUnbindSensorId.value = null
  openSensorId.value = null
  appStore.showToast(result ? `已解绑 ${sensorName}` : '解绑失败，请稍后重试')
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <PageNavBar class="-mx-4" title="传感器" @back="router.back()" />

        <section class="app-card p-5">
          <div class="flex items-center justify-between">
            <h2 class="app-section-title">已连接传感器</h2>
            <span class="text-[12px] text-muted">{{ connectedSensors.length }} 台</span>
          </div>

          <div v-if="connectedSensors.length" class="mt-4 overflow-hidden rounded-lg border border-line bg-[#FFF5F4]">
            <div
              v-for="sensor in connectedSensors"
              :key="sensor.id"
              class="relative overflow-hidden border-b border-line last:border-b-0"
            >
              <button
                class="absolute inset-y-0 right-0 w-[92px] flex items-center justify-center gap-1.5 bg-[#E44747] text-[13px] font-700 text-white"
                type="button"
                :aria-label="`解绑 ${sensor.name}`"
                @click="requestUnbind(sensor.id)"
              >
                <Trash2 :size="16" :stroke-width="2.2" />
                解绑
              </button>

              <div
                class="app-list-row relative z-10 bg-white transition-transform duration-180"
                :style="{ transform: openSensorId === sensor.id ? 'translateX(-92px)' : 'translateX(0)' }"
                style="touch-action: pan-y"
                @click="handleSensorRowClick(sensor.id)"
                @pointerdown="handlePointerDown(sensor.id, $event)"
                @pointerup="handlePointerUp(sensor.id, $event)"
                @pointercancel="handlePointerCancel"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div class="h-9 w-9 shrink-0 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-700">
                    <component :is="getSensorIcon(sensor.name)" :size="16" :stroke-width="2.2" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-[13px] font-700 text-ink">{{ sensor.name }}</p>
                    <p class="mt-1 text-[12px] text-[#15935F]">{{ sensor.value }}</p>
                  </div>
                </div>
                <Bluetooth :size="16" :stroke-width="2.2" class="shrink-0 text-brand-700" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div v-else class="mt-4 rounded-lg bg-soft px-4 py-8 text-center ring-1 ring-line">
            <p class="text-[13px] font-700 text-ink">暂无已连接传感器</p>
            <p class="mt-2 text-[12px] leading-[1.6] text-muted">当前码表暂无可展示的传感器数据</p>
          </div>

        </section>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppDialog
      :description="`解绑后，${pendingUnbindSensor?.name ?? '该传感器'} 将从当前码表中移除。`"
      title="是否解除传感器绑定？"
      :visible="Boolean(pendingUnbindSensorId)"
      @cancel="pendingUnbindSensorId = null"
      @confirm="confirmUnbind"
    />
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
