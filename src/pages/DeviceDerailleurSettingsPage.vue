<script setup lang="ts">
import { BookOpen, Check, ChevronRight, Download, HeartPulse, Lock, Shield, SlidersHorizontal } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppDialog from '../components/feedback/AppDialog.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { primaryDeviceId } from '../data/device'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const deviceId = computed(() => (typeof route.params.deviceId === 'string' ? route.params.deviceId : primaryDeviceId))
const device = computed(() => deviceStore.getDeviceById(deviceId.value))

const speedLevel = ref<'10' | '11' | '12'>('12')
const frontOneKeyEnabled = ref(true)
const gearProtectEnabled = ref(true)
const autoHalfShiftEnabled = ref(false)
const continuousShiftLevel = ref<'high' | 'medium' | 'low'>('high')
const resetDialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const emergencyKitVisible = ref(false)
const emergencyKitStage = ref<'confirm' | 'restoring'>('confirm')
const emergencyModelConfirmed = ref(false)
const emergencyModelOptions = [
  { code: '2401', port: '2401-TypeC' },
  { code: '2402', port: '2402-TypeC' },
  { code: '2403', port: '2403-TypeC' },
  { code: '2404', port: '2404-TypeC' },
  { code: '2405', port: '2405-TypeC' },
  { code: '2406', port: '2406-TypeC' },
] as const
const selectedEmergencyModelCode = ref<(typeof emergencyModelOptions)[number]['code'] | ''>('')
const passwordDraft = ref('')
type DerailleurFirmwareComponent = 'front' | 'rear' | 'controller'
const componentFirmwareEntries: Array<{
  key: DerailleurFirmwareComponent
  label: string
  currentVersion: string
}> = [
  { key: 'front', label: '前拨固件升级', currentVersion: 'v1.7.8' },
  { key: 'rear', label: '后拨固件升级', currentVersion: 'v1.9.3' },
  { key: 'controller', label: '控制器固件升级', currentVersion: 'v2.0.4' },
]
const pdfPreviewUrl = 'https://mozilla.github.io/pdf.js/web/viewer.html?file=https%3A%2F%2Fwww.w3.org%2FWAI%2FER%2Ftests%2Fxhtml%2Ftestfiles%2Fresources%2Fpdf%2Fdummy.pdf'
const selectedEmergencyModel = computed(() =>
  emergencyModelOptions.find((item) => item.code === selectedEmergencyModelCode.value) ?? null,
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

  if (key === 'profile') {
    void router.push('/my')
    return
  }

  appStore.showToast('我的模块将在下一阶段开发')
}

const toggleSwitch = (key: 'front' | 'protect' | 'auto-half') => {
  if (key === 'front') {
    frontOneKeyEnabled.value = !frontOneKeyEnabled.value
    appStore.showToast(`前拨一键换挡已${frontOneKeyEnabled.value ? '开启' : '关闭'}`)
    return
  }

  if (key === 'protect') {
    gearProtectEnabled.value = !gearProtectEnabled.value
    appStore.showToast(`档位保护已${gearProtectEnabled.value ? '开启' : '关闭'}`)
    return
  }

  autoHalfShiftEnabled.value = !autoHalfShiftEnabled.value
  appStore.showToast(`自动半档已${autoHalfShiftEnabled.value ? '开启' : '关闭'}`)
}

const selectSpeedLevel = (value: '10' | '11' | '12') => {
  speedLevel.value = value
  appStore.showToast(`速别已切换为 ${value} 速`)
}

const selectContinuousShiftLevel = (value: 'high' | 'medium' | 'low') => {
  continuousShiftLevel.value = value
  appStore.showToast(`连续变档参数已切换为${value === 'high' ? '高' : value === 'medium' ? '中' : '低'}`)
}

const openPasswordDialog = () => {
  passwordDraft.value = ''
  passwordDialogVisible.value = true
}

const sanitizePasswordDraft = () => {
  passwordDraft.value = passwordDraft.value.replace(/\D/g, '').slice(0, 3)
}

const confirmPasswordChange = () => {
  sanitizePasswordDraft()

  if (passwordDraft.value.length !== 3) {
    appStore.showToast('请输入3位密码')
    return
  }

  passwordDialogVisible.value = false
  appStore.showToast(`设备密码已设置为 ${passwordDraft.value}`)
}

const openManualPdf = () => {
  window.open(pdfPreviewUrl, '_blank', 'noopener,noreferrer')
  appStore.showToast('已打开说明书 PDF 预览')
}

const openComponentFirmware = (component: DerailleurFirmwareComponent) => {
  void router.push({
    path: `/device/${deviceId.value}/firmware`,
    query: { component },
  })
}

const openEmergencyKit = () => {
  emergencyKitStage.value = 'confirm'
  emergencyModelConfirmed.value = false
  selectedEmergencyModelCode.value = ''
  emergencyKitVisible.value = true
}

const closeEmergencyKit = () => {
  if (emergencyKitStage.value === 'restoring') {
    return
  }

  emergencyKitVisible.value = false
}

const confirmEmergencyRecovery = () => {
  if (!selectedEmergencyModel.value) {
    appStore.showToast('请先选择设备型号')
    return
  }

  if (!emergencyModelConfirmed.value) {
    appStore.showToast('请先确认设备型号后再恢复固件')
    return
  }

  emergencyKitStage.value = 'restoring'

  window.setTimeout(() => {
    emergencyKitVisible.value = false
    emergencyKitStage.value = 'confirm'
    emergencyModelConfirmed.value = false
    selectedEmergencyModelCode.value = ''
    appStore.showToast('固件恢复完成，设备已恢复正常')
  }, 2400)
}

const confirmRestoreFactory = () => {
  resetDialogVisible.value = false
  appStore.showToast('电子变速器已恢复出厂设置')
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />
      <PageNavBar title="设备设置" @back="router.back()" />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <div class="pt-4">
          <section class="app-list-group">
            <div>
              <button
                class="app-list-row w-full justify-between text-left"
                type="button"
                @click="openPasswordDialog"
              >
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-600">
                    <Lock :size="16" :stroke-width="2.2" />
                  </div>
                  <span class="text-[13px] font-700 text-ink">修改设备密码</span>
                </div>
                <ChevronRight :size="16" :stroke-width="2.2" class="text-muted" />
              </button>

              <div class="app-list-row">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 flex items-center justify-center rounded-[6px] bg-[#EAF9F0] text-[#16A34A]">
                      <SlidersHorizontal :size="16" :stroke-width="2.2" />
                    </div>
                    <span class="text-[13px] font-700 text-ink">速别设置</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-for="item in ['10', '11', '12'] as Array<'10' | '11' | '12'>"
                      :key="item"
                      class="min-h-11 min-w-11 rounded-lg px-3 text-[12px] font-700 transition"
                      :class="speedLevel === item ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-black/5'"
                      type="button"
                      @click="selectSpeedLevel(item)"
                    >
                      {{ item }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="app-list-row">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 flex items-center justify-center rounded-[6px] bg-[#F2E9FF] text-[#7C3AED]">
                      <SlidersHorizontal :size="16" :stroke-width="2.2" />
                    </div>
                    <span class="text-[13px] font-700 text-ink">换挡次数统计</span>
                  </div>
                  <span class="text-[12px] font-700 text-muted">{{ device?.usage ?? '1256次' }}</span>
                </div>
              </div>

              <div class="border-b border-line px-4 py-3">
                <p class="text-[13px] font-700 text-ink">部件固件升级</p>
                <p class="mt-1 text-[11px] leading-[1.6] text-muted">前拨、后拨和控制器可分别检测并升级</p>
              </div>

              <button
                v-for="entry in componentFirmwareEntries"
                :key="entry.key"
                class="app-list-row min-h-[68px] w-full justify-between gap-3 text-left transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
                @click="openComponentFirmware(entry.key)"
              >
                <div class="min-w-0 flex items-center gap-3">
                  <div class="h-9 w-9 shrink-0 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-700">
                    <Download :size="16" :stroke-width="2.2" />
                  </div>
                  <div class="min-w-0">
                    <span class="block truncate text-[13px] font-700 text-ink">{{ entry.label }}</span>
                    <span class="mt-1 block text-[11px] text-muted">当前版本 {{ entry.currentVersion }}</span>
                  </div>
                </div>
                <ChevronRight :size="16" :stroke-width="2.2" class="shrink-0 text-muted" />
              </button>

              <button
                class="app-list-row min-h-[68px] w-full justify-between text-left"
                type="button"
                @click="openManualPdf"
              >
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 flex items-center justify-center rounded-[6px] bg-[#FFF3E3] text-[#D97706]">
                    <BookOpen :size="16" :stroke-width="2.2" />
                  </div>
                  <span class="text-[13px] font-700 text-ink">说明书</span>
                </div>
                <ChevronRight :size="16" :stroke-width="2.2" class="text-muted" />
              </button>

              <button
                class="app-list-row min-h-[68px] w-full justify-between text-left"
                type="button"
                @click="resetDialogVisible = true"
              >
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 flex items-center justify-center rounded-[6px] bg-[#FFECEC] text-[#D84C4C]">
                    <Shield :size="16" :stroke-width="2.2" />
                  </div>
                  <span class="text-[13px] font-700 text-ink">恢复出厂设置</span>
                </div>
                <ChevronRight :size="16" :stroke-width="2.2" class="text-muted" />
              </button>

              <div class="app-list-row">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-[13px] font-700 text-ink">前拨一键换挡开关</span>
                  <button
                    class="relative h-11 w-14"
                    type="button"
                    role="switch"
                    :aria-checked="frontOneKeyEnabled"
                    aria-label="前拨一键换挡"
                    @click="toggleSwitch('front')"
                  >
                    <span
                      class="absolute inset-x-0 top-2 h-7 rounded-full transition"
                      :class="frontOneKeyEnabled ? 'bg-brand-500' : 'bg-[#D8DDE6]'"
                    >
                      <span class="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.16)] transition" :class="frontOneKeyEnabled ? 'left-8 -translate-x-full' : 'left-1'" />
                    </span>
                  </button>
                </div>
              </div>

              <div class="app-list-row">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-[13px] font-700 text-ink">档位保护开关</span>
                  <button
                    class="relative h-11 w-14"
                    type="button"
                    role="switch"
                    :aria-checked="gearProtectEnabled"
                    aria-label="档位保护"
                    @click="toggleSwitch('protect')"
                  >
                    <span
                      class="absolute inset-x-0 top-2 h-7 rounded-full transition"
                      :class="gearProtectEnabled ? 'bg-brand-500' : 'bg-[#D8DDE6]'"
                    >
                      <span class="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.16)] transition" :class="gearProtectEnabled ? 'left-8 -translate-x-full' : 'left-1'" />
                    </span>
                  </button>
                </div>
              </div>

              <div class="app-list-row">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-[13px] font-700 text-ink">连续变档参数</span>
                  <div class="flex items-center gap-2">
                    <button
                      class="min-h-11 min-w-11 rounded-lg px-3 text-[12px] font-700 transition"
                      :class="continuousShiftLevel === 'high' ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-black/5'"
                      type="button"
                      @click="selectContinuousShiftLevel('high')"
                    >
                      高
                    </button>
                    <button
                      class="min-h-11 min-w-11 rounded-lg px-3 text-[12px] font-700 transition"
                      :class="continuousShiftLevel === 'medium' ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-black/5'"
                      type="button"
                      @click="selectContinuousShiftLevel('medium')"
                    >
                      中
                    </button>
                    <button
                      class="min-h-11 min-w-11 rounded-lg px-3 text-[12px] font-700 transition"
                      :class="continuousShiftLevel === 'low' ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-black/5'"
                      type="button"
                      @click="selectContinuousShiftLevel('low')"
                    >
                      低
                    </button>
                  </div>
                </div>
              </div>

              <div class="app-list-row">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-[13px] font-700 text-ink">自动半档开关</span>
                  <button
                    class="relative h-11 w-14"
                    type="button"
                    role="switch"
                    :aria-checked="autoHalfShiftEnabled"
                    aria-label="自动半档"
                    @click="toggleSwitch('auto-half')"
                  >
                    <span
                      class="absolute inset-x-0 top-2 h-7 rounded-full transition"
                      :class="autoHalfShiftEnabled ? 'bg-brand-500' : 'bg-[#D8DDE6]'"
                    >
                      <span class="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.16)] transition" :class="autoHalfShiftEnabled ? 'left-8 -translate-x-full' : 'left-1'" />
                    </span>
                  </button>
                </div>
              </div>

              <button
                class="app-list-row min-h-[68px] w-full justify-between text-left"
                type="button"
                @click="openEmergencyKit"
              >
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 flex items-center justify-center rounded-[6px] bg-[#ECEFF4] text-[#6B7280]">
                    <HeartPulse :size="16" :stroke-width="2.2" />
                  </div>
                  <span class="text-[13px] font-700 text-ink">急救箱</span>
                </div>
                <ChevronRight :size="16" :stroke-width="2.2" class="text-muted" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <teleport to="body">
      <div
        v-if="passwordDialogVisible"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/28 px-4 pb-8 pt-20 md:items-center"
      >
        <div class="app-dialog-surface app-sheet w-full max-w-88 p-5">
          <h3 class="text-[16px] font-700 text-ink">设置设备密码</h3>
          <input
            v-model="passwordDraft"
            class="app-control mt-4 h-13 w-full border border-[#D8DEE7] px-4 text-center text-[15px] font-700 text-ink outline-none focus:ring-2 focus:ring-brand-500"
            maxlength="3"
            placeholder="输入3位密码"
            type="text"
            @input="sanitizePasswordDraft"
          />
          <div class="mt-5 grid grid-cols-2 gap-3">
            <button
              class="min-h-11 rounded-lg bg-soft text-[14px] font-700 text-ink outline-none transition hover:bg-#ecefed focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="passwordDialogVisible = false"
            >
              取消
            </button>
            <button
              class="min-h-11 rounded-lg bg-brand-500 text-[14px] font-700 text-white outline-none transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="confirmPasswordChange"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div
        v-if="emergencyKitVisible"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/28 px-4 pb-8 pt-20 md:items-center"
      >
        <div class="app-dialog-surface app-sheet w-full max-w-88 p-5">
          <div class="min-w-0">
            <p class="text-[12px] font-600 text-muted">{{ device?.name ?? '电子变速器' }}</p>
            <h3 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">急救箱</h3>
          </div>

          <div class="app-card-soft mt-5 px-4 py-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[14px] font-700 text-ink">固件恢复</p>
                <p class="mt-1 text-[12px] leading-[1.6] text-muted">用于设备异常时重新安装恢复固件。</p>
              </div>
              <div class="rounded-full bg-white px-3 py-1 text-[12px] font-700 text-ink ring-1 ring-black/5">设备管理</div>
            </div>
          </div>

          <div v-if="emergencyKitStage === 'confirm'" class="mt-5">
            <p class="text-[13px] font-700 text-ink">选择型号</p>
            <div class="mt-3 max-h-55 space-y-3 overflow-y-auto app-scroll-area pr-1">
              <button
                v-for="item in emergencyModelOptions"
                :key="item.code"
                class="w-full rounded-lg px-4 py-3 text-left transition"
                :class="selectedEmergencyModelCode === item.code
                  ? 'bg-brand-500 text-white shadow-[0_10px_20px_rgba(255,127,0,0.18)]'
                  : 'bg-soft text-ink ring-1 ring-black/4 hover:bg-#eef1f0'"
                type="button"
                @click="selectedEmergencyModelCode = item.code"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-[18px] font-700 tracking-[0.06em]">{{ item.code }}</p>
                    <p
                      class="mt-1 text-[11px]"
                      :class="selectedEmergencyModelCode === item.code ? 'text-white/82' : 'text-muted'"
                    >
                      {{ item.port }}
                    </p>
                  </div>
                  <div
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition"
                    :class="selectedEmergencyModelCode === item.code
                      ? 'border-white/30 bg-white/16 text-white'
                      : 'border-black/10 bg-white text-transparent'"
                  >
                    <Check :size="15" :stroke-width="2.8" />
                  </div>
                </div>
              </button>
            </div>

            <div class="app-card-soft mt-4 px-4 py-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[13px] font-700 text-ink">已确认设备型号</p>
                  <p class="mt-1 text-[12px] leading-[1.6] text-muted">确认后将进入固件恢复流程，请保持设备供电稳定。</p>
                </div>
                <button
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition"
                  :class="emergencyModelConfirmed ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/15 bg-white text-transparent'"
                  type="button"
                  @click="emergencyModelConfirmed = !emergencyModelConfirmed"
                >
                  <Check :size="14" :stroke-width="2.8" />
                </button>
              </div>
            </div>

            <p class="mt-4 text-[13px] leading-[1.75] text-muted">
              提示：使用此功能前，需确认设备已无法正常使用，并且你已知晓设备型号。设备型号请联系产品所购买的门店查询。
            </p>
          </div>

          <div v-else class="app-card-soft mt-5 px-4 py-6 text-center">
            <div class="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#D8DEE7] border-t-brand-600" />
            <p class="mt-4 text-[16px] font-700 text-ink">固件恢复中</p>
            <p class="mt-2 text-[12px] leading-[1.7] text-muted">
              正在为
              <span class="font-700 text-ink">{{ selectedEmergencyModel?.code ?? '已选型号' }}</span>
              写入恢复固件，请勿断开连接。
            </p>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              class="min-h-11 rounded-lg bg-soft text-[14px] font-700 text-ink outline-none transition hover:bg-#ecefed focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="emergencyKitStage === 'restoring'"
              type="button"
              @click="closeEmergencyKit"
            >
              取消
            </button>
            <button
              class="min-h-11 rounded-lg bg-brand-500 text-[14px] font-700 text-white outline-none transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="emergencyKitStage === 'restoring'"
              type="button"
              @click="confirmEmergencyRecovery"
            >
              开始恢复
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <AppDialog
      description="恢复后将清空当前电子变速器的调试与参数设置。"
      title="是否恢复出厂设置？"
      :visible="resetDialogVisible"
      @cancel="resetDialogVisible = false"
      @confirm="confirmRestoreFactory"
    />
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
