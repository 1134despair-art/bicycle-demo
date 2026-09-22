<script setup lang="ts">
import { BadgeCheck, BellOff } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import { markMyNotificationAsRead } from '../data/my'
import type { MyNotification } from '../data/my'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const notification = ref<MyNotification | null>(null)

const notificationId = computed(() => {
  const routeValue = route.params.messageId ?? route.query.messageId
  return typeof routeValue === 'string' ? routeValue : ''
})

const routeExists = (path: string) => router.resolve(path).matched.length > 0

const syncNotification = () => {
  if (!notificationId.value) {
    notification.value = null
    return
  }

  notification.value = markMyNotificationAsRead(notificationId.value)
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  if (routeExists('/my/notifications')) {
    void router.push('/my/notifications')
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

onMounted(syncNotification)
onActivated(syncNotification)
watch(notificationId, () => {
  syncNotification()
})
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] flex flex-col homepage-surface">
      <IosStatusBar />

      <div class="flex-1 px-4 pb-5">
        <PageNavBar class="-mx-4" title="消息详情" @back="goBack" />

        <section v-if="notification" class="space-y-4 pt-4">
          <div class="app-card px-5 py-5">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-[11px] font-600 uppercase tracking-[0.14em] text-muted">
                  消息通知
                </p>
                <h2 class="mt-2 text-[20px] font-700 tracking-[-0.04em] text-ink">
                  {{ notification.title }}
                </h2>
              </div>

              <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ecfdf3] px-3 py-1 text-[11px] font-700 text-[#027a48]">
                <BadgeCheck :size="14" :stroke-width="2.2" />
                已读
              </span>
            </div>

            <div class="mt-5 rounded-lg bg-soft px-4 py-4 ring-1 ring-line">
              <p class="text-[11px] text-muted">发布时间</p>
              <p class="mt-2 text-[14px] font-700 text-ink">{{ notification.time }}</p>
            </div>
          </div>

          <div class="app-card px-5 py-5">
            <p class="text-[11px] font-600 uppercase tracking-[0.14em] text-muted">
              详细内容
            </p>
            <div class="mt-4 space-y-4 text-[14px] leading-8 text-ink">
              <p>{{ notification.summary }}</p>
              <p>{{ notification.content }}</p>
            </div>
          </div>
        </section>

        <section v-else class="pt-4">
          <div
            class="app-card px-5 py-10 text-center"
          >
            <div class="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-[#f5f7fa] text-muted ring-1 ring-black/5">
              <BellOff :size="20" :stroke-width="2.1" />
            </div>
            <h3 class="mt-4 text-[15px] font-700 text-ink">消息不存在</h3>
            <p class="mt-2 text-[12px] leading-6 text-muted">
              该消息可能已失效或当前路由参数未接入，可返回消息通知列表重新查看。
            </p>
            <button
              class="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-[13px] font-700 text-white outline-none transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="goBack"
            >
              返回通知列表
            </button>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
