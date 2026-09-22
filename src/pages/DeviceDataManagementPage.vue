<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const managementMetrics = [
  { label: '骑行记录', value: '126', unit: '条' },
  { label: '同步成功率', value: '99.2', unit: '%' },
  { label: '剩余存储', value: '11.8', unit: 'GB' },
  { label: '最近同步', value: '2', unit: '分钟前' },
]

const syncRecords = [
  { title: '骑行记录同步', time: '今天 09:24', status: '成功', desc: '同步 3 条骑行记录到手机' },
  { title: '地图资源更新', time: '昨天 22:18', status: '成功', desc: '更新华东区域离线地图' },
  { title: '云端备份校验', time: '昨天 20:06', status: '完成', desc: '骑行数据与个人设置已备份' },
]

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
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-4">
        <PageNavBar class="-mx-4" title="数据管理" @back="router.back()" />

        <section class="app-card p-5">
          <div class="rounded-lg border border-brand-100 bg-brand-50 px-5 py-5 text-ink">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[11px] font-600 text-brand-500">DEVICE DATA HUB</p>
                <h2 class="mt-2 text-[20px] font-700">设备数据概况</h2>
                <p class="mt-2 text-[12px] leading-[1.7] text-muted">查看码表骑行数据、同步状态和本地存储情况</p>
              </div>
              <button
                class="min-h-10 rounded-lg bg-brand-500 px-4 text-[11px] font-700 text-white"
                type="button"
                @click="appStore.showToast('已开始手动同步设备数据')"
              >
                立即同步
              </button>
            </div>

            <div class="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span class="rounded-full border border-brand-100 bg-white px-3 py-1.5 text-brand-800">云端已连接</span>
              <span class="rounded-full border border-brand-100 bg-white px-3 py-1.5 text-brand-800">自动同步已开启</span>
              <span class="rounded-full border border-brand-100 bg-white px-3 py-1.5 text-brand-800">最近同步 2 分钟前</span>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <div
              v-for="item in managementMetrics"
              :key="item.label"
              class="rounded-lg bg-soft px-4 py-4 ring-1 ring-line"
            >
              <p class="text-[11px] text-muted">{{ item.label }}</p>
              <p class="mt-2 text-[22px] font-700 tracking-[-0.03em] text-ink">
                {{ item.value }}
                <span class="ml-1 text-[12px] font-500 text-muted">{{ item.unit }}</span>
              </p>
            </div>
          </div>
        </section>

        <section class="app-card mt-4 p-5">
          <div class="flex items-center justify-between gap-3">
            <h2 class="app-section-title">同步记录</h2>
            <span class="rounded-full bg-[#F5F6F8] px-3 py-1 text-[11px] text-[#626970]">最近 24 小时</span>
          </div>
          <div class="mt-4 space-y-3">
            <div
              v-for="record in syncRecords"
              :key="`${record.title}-${record.time}`"
              class="rounded-lg bg-soft px-4 py-4 ring-1 ring-line"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-[14px] font-700 text-ink">{{ record.title }}</p>
                  <p class="mt-1 text-[12px] text-muted">{{ record.desc }}</p>
                </div>
                <span class="rounded-full bg-[#EDF9F3] px-2.5 py-1 text-[11px] font-700 text-[#15935F]">{{ record.status }}</span>
              </div>
              <p class="mt-3 text-[12px] text-muted">{{ record.time }}</p>
            </div>
          </div>
        </section>

        <section class="app-card mt-4 p-5">
          <h2 class="app-section-title">数据操作</h2>
          <div class="mt-4 grid grid-cols-1 gap-3">
            <button class="w-full rounded-lg bg-soft px-4 py-4 text-left ring-1 ring-line" type="button" @click="appStore.showToast('已开始导出 FIT 文件')">
              <p class="text-[14px] font-700 text-ink">导出骑行记录</p>
              <p class="mt-1 text-[12px] text-muted">支持 FIT / GPX / CSV 三种格式</p>
            </button>
            <button class="w-full rounded-lg bg-soft px-4 py-4 text-left ring-1 ring-line" type="button" @click="appStore.showToast('已开始清理设备缓存')">
              <p class="text-[14px] font-700 text-ink">清理缓存</p>
              <p class="mt-1 text-[12px] text-muted">释放本地缓存空间，不删除骑行记录</p>
            </button>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="device" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
