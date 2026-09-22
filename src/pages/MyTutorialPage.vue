<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  BookOpen,
  CircleAlert,
  CirclePlay,
  Ellipsis,
  Gauge,
  HandMetal,
  MoveRight,
  MoveUpRight,
  PanelsTopLeft,
  RadioTower,
} from 'lucide-vue-next'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import { tabItems } from '../data/home'
import { myTutorialSections, type TutorialItem } from '../data/my'
import AppShell from '../layouts/AppShell.vue'

const router = useRouter()

const iconMap = {
  手: HandMetal,
  前: MoveUpRight,
  后: MoveRight,
  夹: Gauge,
  更: Ellipsis,
  控: RadioTower,
  指: PanelsTopLeft,
  册: BookOpen,
  障: CircleAlert,
  播: CirclePlay,
} as const

const getTutorialIcon = (icon: string) => iconMap[icon as keyof typeof iconMap] ?? BookOpen

const goBack = () => {
  void router.push('/my')
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
  }
}

const openTutorialItem = (item: TutorialItem) => {
  if (item.targetType === 'troubleshooting-list') {
    void router.push('/my/tutorials/troubleshooting')
    return
  }

  void router.push(`/my/tutorials/list/${item.key}`)
}

const tutorialSections = computed(() => myTutorialSections)
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] flex flex-col homepage-surface">
      <IosStatusBar />

      <div class="flex-1 px-4 pb-5">
        <PageNavBar class="-mx-4" title="教程" @back="goBack" />

        <div class="mt-4 rounded-lg bg-soft px-4 py-3 text-center text-[11px] leading-[1.7] text-muted ring-1 ring-line">
          更多教程视频，可下载“咔哩咔哩”APP 搜索“蓝图变速”
        </div>

        <section
          v-for="section in tutorialSections"
          :key="section.key"
          class="app-list-group mt-4"
        >
          <div class="border-b border-black/5 px-5 py-4">
            <h2 class="text-[17px] font-700 tracking-[-0.02em] text-ink">{{ section.title }}</h2>
          </div>

          <div class="tutorial-entry-grid grid gap-y-3 px-4 py-4" :class="section.items.length >= 5 ? 'grid-cols-5' : 'grid-cols-4'">
            <button
              v-for="item in section.items"
              :key="item.key"
              class="flex flex-col items-center gap-2 rounded-lg px-1 py-2 text-center transition hover:bg-soft focus-visible:ring-2 focus-visible:ring-brand-500"
              type="button"
              @click="openTutorialItem(item)"
            >
              <div class="h-15 w-15 flex items-center justify-center rounded-[6px] bg-soft text-ink ring-1 ring-line">
                <component :is="getTutorialIcon(item.icon)" :size="31" :stroke-width="2.2" />
              </div>
              <span class="text-[12px] font-600 leading-[1.4] text-ink">{{ item.title }}</span>
            </button>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>
  </AppShell>
</template>

<style scoped>
@media (max-width: 340px) {
  .tutorial-entry-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
