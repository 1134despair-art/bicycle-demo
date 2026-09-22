<script setup lang="ts">
import { BellRing, BookOpen, ChevronRight, FileText, LogOut, Megaphone, ScanLine, Settings2, ShieldCheck, UserRound } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppDialog from '../components/feedback/AppDialog.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import { loadMyProfile, myMenuEntries, myStatsMock } from '../data/my'
import type { MyMenuEntryKey, MyProfile } from '../data/my'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const profile = ref<MyProfile>(loadMyProfile())
const avatarLoadFailed = ref(false)
const logoutDialogVisible = ref(false)

const iconMap = {
  profile: UserRound,
  'firmware-notifications': BellRing,
  'push-notifications': Megaphone,
  'anti-counterfeit': ScanLine,
  'privacy-agreement': FileText,
  'privacy-policy': ShieldCheck,
  settings: Settings2,
  tutorial: BookOpen,
} as const

const profileInitial = computed(() => profile.value.nickname.trim().charAt(0) || '我')

const refreshProfile = () => {
  profile.value = loadMyProfile()
  avatarLoadFailed.value = false
}

const navigateToTab = (key: string) => {
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
}

const handleTab = (key: string) => {
  if (key === 'profile') {
    return
  }

  navigateToTab(key)
}

const handleMenuSelect = (key: MyMenuEntryKey) => {
  if (key === 'profile') {
    void router.push('/my/profile')
    return
  }

  if (key === 'firmware-notifications') {
    void router.push({ path: '/my/notifications', query: { category: 'firmware' } })
    return
  }

  if (key === 'push-notifications') {
    void router.push({ path: '/my/notifications', query: { category: 'push' } })
    return
  }

  if (key === 'settings') {
    void router.push('/my/settings')
    return
  }

  if (key === 'anti-counterfeit') {
    void router.push('/my/anti-counterfeit')
    return
  }

  if (key === 'privacy-agreement') {
    void router.push('/my/privacy/agreement')
    return
  }

  if (key === 'privacy-policy') {
    void router.push('/my/privacy/policy')
    return
  }

  void router.push('/my/tutorials')
}

const handleLogoutConfirm = () => {
  logoutDialogVisible.value = false
  appStore.showToast('已退出登录')
  void router.push('/')
}

onMounted(refreshProfile)
onActivated(refreshProfile)
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area">
        <PageNavBar :show-back="false" title="我的" />

        <div class="px-4 pb-5">
        <section class="pt-1">
          <div class="app-card px-5 pb-5 pt-4">
            <div class="profile-header flex items-start justify-between gap-4">
              <div class="profile-identity min-w-0 flex items-center gap-4">
                <div class="app-media h-22 w-22 shrink-0 border border-line">
                  <img
                    v-if="!avatarLoadFailed"
                    :src="profile.avatar"
                    :alt="profile.nickname"
                    class="h-full w-full object-cover"
                    @error="avatarLoadFailed = true"
                  />
                  <div
                    v-else
                    class="h-full w-full flex items-center justify-center bg-soft text-[30px] font-700 text-ink"
                  >
                    {{ profileInitial }}
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <h2 class="profile-name truncate text-[24px] font-700 text-ink">
                    {{ profile.nickname }}
                  </h2>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <span class="rounded-full bg-white/90 px-3 py-1 text-[11px] font-700 text-[#565A5F] ring-1 ring-black/4">
                      总骑行次数 {{ myStatsMock.monthlyRideCount }}
                    </span>
                    <span class="rounded-full bg-white/90 px-3 py-1 text-[11px] font-700 text-[#565A5F] ring-1 ring-black/4">
                      骑行天数 26天
                    </span>
                  </div>
                </div>
              </div>

              <button
                class="min-h-11 shrink-0 rounded-lg border border-line bg-white px-4 text-[12px] font-700 text-ink transition hover:bg-soft"
                type="button"
                @click="handleMenuSelect('profile')"
              >
                编辑
              </button>
            </div>

            <div class="mt-5 border-t border-line pt-5 text-ink">
              <div class="profile-distance-row flex items-end justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-[12px] font-600 text-muted">
                    总骑行里程
                  </p>
                  <p class="profile-total-mileage app-metric-value mt-3 text-[32px] font-700 leading-none text-brand-500">
                    {{ profile.totalMileage }}
                  </p>
                </div>
                <div class="rounded-full bg-white px-3 py-1.5 text-[11px] font-700 text-brand-700 ring-1 ring-brand-100">
                  本赛季持续提升
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="pt-4">
          <div class="app-metric-panel grid grid-cols-2 gap-px bg-line">
            <div class="app-metric-cell min-h-24 bg-white">
              <p class="text-[11px] leading-5 text-muted">本周骑行次数</p>
              <p class="app-metric-value mt-3 text-[22px] font-700 text-ink">
                {{ myStatsMock.weeklyRideCount }}
              </p>
            </div>
            <div class="app-metric-cell min-h-24 bg-white">
              <p class="text-[11px] leading-5 text-muted">本周骑行里程</p>
              <p class="app-metric-value mt-3 text-[22px] font-700 text-ink">
                {{ myStatsMock.weeklyRideDistance }}
              </p>
            </div>
            <div class="app-metric-cell min-h-24 bg-white">
              <p class="text-[11px] leading-5 text-muted">本月骑行次数</p>
              <p class="app-metric-value mt-3 text-[22px] font-700 text-ink">
                {{ myStatsMock.monthlyRideCount }}
              </p>
            </div>
            <div class="app-metric-cell min-h-24 bg-white">
              <p class="text-[11px] leading-5 text-muted">本月骑行里程</p>
              <p class="app-metric-value mt-3 text-[22px] font-700 text-ink">
                {{ myStatsMock.monthlyRideDistance }}
              </p>
            </div>
          </div>
        </section>

        <section class="pt-4">
          <div class="app-list-group">
            <button
              v-for="item in myMenuEntries"
              :key="item.key"
              class="w-full flex items-center gap-4 border-b border-[#ECEEF0] px-5 py-4 text-left outline-none transition last:border-b-0 hover:bg-[#FAFAFA] focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="handleMenuSelect(item.key)"
            >
              <div class="h-11 w-11 shrink-0 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-500">
                <component :is="iconMap[item.key]" :size="18" :stroke-width="2.2" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[14px] font-700 text-ink">{{ item.title }}</p>
                <p class="mt-1 text-[12px] leading-[1.6] text-muted">{{ item.description }}</p>
              </div>
              <div class="h-9 w-9 flex shrink-0 items-center justify-center text-[#92989E]">
                <ChevronRight :size="18" :stroke-width="2.2" />
              </div>
            </button>
          </div>
        </section>

        <section class="pt-4">
          <button
            class="app-control w-full flex items-center justify-center gap-2 border border-danger/20 bg-[#FFF5F4] px-4 py-4 text-[14px] font-700 text-danger transition hover:bg-[#FFF0EE]"
            type="button"
            @click="logoutDialogVisible = true"
          >
            <LogOut :size="18" :stroke-width="2.2" />
            退出登录
          </button>
        </section>
        </div>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>

    <AppDialog
      :visible="logoutDialogVisible"
      title="确认退出登录？"
      description="退出后将回到登录入口，当前 Demo 数据不会被清除。"
      @cancel="logoutDialogVisible = false"
      @confirm="handleLogoutConfirm"
    />
    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>

<style scoped>
@media (max-width: 340px) {
  .profile-header {
    gap: 12px;
  }

  .profile-identity {
    gap: 10px;
  }

  .profile-name {
    font-size: 20px;
  }

  .profile-distance-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .profile-total-mileage {
    font-size: 28px;
  }
}
</style>
