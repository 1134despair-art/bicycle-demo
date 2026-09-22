<script setup lang="ts">
import { BellDot, ChevronRight } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import { loadMyNotifications, markMyNotificationAsRead } from '../data/my'
import type { MyNotification, MyNotificationCategory } from '../data/my'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'
import { useDeviceStore } from '../stores/device'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const deviceStore = useDeviceStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const notifications = ref<MyNotification[]>([])

const notificationCategory = computed<MyNotificationCategory | 'all'>(() => {
  const category = route.query.category
  return category === 'firmware' || category === 'push' ? category : 'all'
})
const visibleNotifications = computed(() => notificationCategory.value === 'all'
  ? notifications.value
  : notifications.value.filter((item) => item.category === notificationCategory.value))
const unreadCount = computed(() => visibleNotifications.value.filter((item) => !item.read).length)
const pageTitle = computed(() => notificationCategory.value === 'firmware'
  ? '固件升级消息提醒'
  : notificationCategory.value === 'push'
    ? '后台推送消息'
    : '消息通知')
const pageDescription = computed(() => notificationCategory.value === 'firmware'
  ? '设备新版本、升级结果和异常状态会在这里提醒。'
  : notificationCategory.value === 'push'
    ? '活动、服务及运营后台推送的消息会在这里展示。'
    : '固件更新与后台推送消息统一在这里查看。')

const routeExists = (path: string) => router.resolve(path).matched.length > 0

const refreshNotifications = () => {
  notifications.value = loadMyNotifications()
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  if (routeExists('/my')) {
    void router.push('/my')
    return
  }

  void router.push('/home')
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

  if (routeExists('/my')) {
    void router.push('/my')
    return
  }

  appStore.showToast('个人中心路由待接入，页面文件已创建')
}

const openNotification = (item: MyNotification) => {
  const readNotification = markMyNotificationAsRead(item.id)
  notifications.value = notifications.value.map((notification) =>
    notification.id === item.id ? { ...notification, read: true } : notification,
  )

  if (readNotification?.target?.type === 'device-firmware') {
    const targetDevice = deviceStore.getDeviceById(readNotification.target.deviceId)

    if (targetDevice) {
      void router.push({
        path: `/device/${targetDevice.id}/firmware`,
        query: { source: 'notification' },
      })
      return
    }

    appStore.showToast('对应设备暂不可用，已为你打开消息详情')
  }

  const targetPath = `/my/notifications/${item.id}`

  if (!routeExists(targetPath)) {
    appStore.showToast('消息详情路由待接入，页面文件已创建')
    return
  }

  void router.push(targetPath)
}

onMounted(refreshNotifications)
onActivated(refreshNotifications)
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] flex flex-col homepage-surface">
      <IosStatusBar />

      <div class="flex-1 px-4 pb-5">
        <PageNavBar class="-mx-4" :title="pageTitle" @back="goBack" />

        <section class="pt-5">
          <div class="app-card px-5 py-5">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h2 class="text-[24px] font-700 tracking-[-0.05em] text-ink">
                  {{ visibleNotifications.length }} 条通知
                </h2>
                <p class="mt-2 text-[12px] leading-[1.8] text-[#6F7C77]">
                  {{ pageDescription }}
                </p>
              </div>

              <div class="shrink-0 rounded-[6px] bg-brand-50 px-4 py-3 text-center ring-1 ring-brand-100">
                <p class="text-[11px] font-600 tracking-[0.06em] text-[#7A8782]">未读</p>
                <p class="mt-1 text-[20px] font-700 tracking-[-0.05em] text-brand-700">
                  {{ unreadCount }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="pt-4">
          <div v-if="visibleNotifications.length" class="space-y-3">
            <button
              v-for="item in visibleNotifications"
              :key="item.id"
              class="app-card w-full px-4 py-4 text-left outline-none transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="openNotification(item)"
            >
              <div class="flex items-start gap-3">
                <div
                  class="mt-0.5 h-11 w-11 shrink-0 flex items-center justify-center rounded-[6px] ring-1"
                  :class="item.read ? 'bg-[#f5f7fa] text-muted ring-black/5' : 'bg-brand-50 text-brand-700 ring-brand-100'"
                >
                  <BellDot :size="18" :stroke-width="2.1" />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-[14px] font-700 tracking-[-0.02em] text-ink">
                        {{ item.title }}
                      </p>
                      <p class="mt-2 text-[12px] leading-[1.8] text-[#6F7C77]">
                        {{ item.summary }}
                      </p>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                      <span
                        class="rounded-full px-2.5 py-1 text-[11px] font-700"
                        :class="item.read ? 'bg-[#f3f5f7] text-muted' : 'bg-brand-50 text-brand-700'"
                      >
                        {{ item.read ? '已读' : '未读' }}
                      </span>
                      <div class="h-8 w-8 flex items-center justify-center rounded-full bg-[#F7F8FA] text-[#9AA3AF] ring-1 ring-[#E7E9EC]">
                        <ChevronRight :size="16" :stroke-width="2.2" />
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 flex items-center justify-between gap-3">
                    <p class="text-[12px] leading-5 text-[#7A8782]">{{ item.time }}</p>
                    <span
                      v-if="!item.read"
                      class="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-[11px] font-700 text-brand-700"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      待查看
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div
            v-else
            class="app-card px-5 py-10 text-center"
          >
            <div class="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-[#f5f7fa] text-muted ring-1 ring-black/5">
              <BellDot :size="20" :stroke-width="2.1" />
            </div>
            <h3 class="mt-4 text-[15px] font-700 text-ink">暂无{{ pageTitle }}</h3>
            <p class="mt-2 text-[12px] leading-6 text-muted">
              当前没有新的{{ pageTitle }}。
            </p>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
