<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, EllipsisVertical, ExternalLink, RefreshCw, Share2, X } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import { tutorialExternalPages } from '../data/my'
import AppShell from '../layouts/AppShell.vue'

const route = useRoute()
const router = useRouter()

const videoKey = computed(() =>
  typeof route.params.videoKey === 'string' ? route.params.videoKey : '',
)

const externalPage = computed(() => tutorialExternalPages[videoKey.value] ?? null)

const goBack = () => {
  void router.back()
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] bg-white text-ink">
      <IosStatusBar class="bg-white" />

      <div class="app-page-nav border-b border-black/5 bg-white px-4 pb-3 pt-2">
        <div class="flex items-center justify-between gap-3">
          <button class="h-11 w-11 flex items-center justify-center rounded-full bg-[#f5f7f8] text-ink ring-1 ring-black/5" type="button" @click="goBack">
            <X :size="20" :stroke-width="2.2" />
          </button>
          <div class="min-w-0 flex-1 text-center text-[18px] font-700">{{ externalPage?.sourceLabel ?? 'bilibili.com' }}</div>
          <button class="h-11 w-11 flex items-center justify-center rounded-full bg-[#f5f7f8] text-ink ring-1 ring-black/5" type="button">
            <EllipsisVertical :size="20" :stroke-width="2.2" />
          </button>
        </div>
      </div>

      <div v-if="externalPage" class="pb-6">
        <div class="border-b border-black/5 bg-white px-4 py-3">
          <div class="flex items-center gap-3">
            <img :src="externalPage.brandIcon" :alt="externalPage.appName" class="app-media h-12 w-12 object-cover" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-[16px] font-700 text-ink">{{ externalPage.appName }}</p>
              <p class="mt-1 truncate text-[12px] text-[#7f8a85]">你感兴趣的视频都在 B 站</p>
            </div>
            <button class="rounded-full bg-[#ff6ba7] px-5 py-2 text-[14px] font-700 text-white" type="button">
              {{ externalPage.openLabel }}
            </button>
          </div>
        </div>

        <div class="bg-[#f7f7f8] px-4 pb-34 pt-4">
          <div class="app-card overflow-hidden">
            <img :src="externalPage.heroCover" :alt="externalPage.heroTitle" class="h-46 w-full object-cover" />
            <div class="px-4 py-4">
              <p class="text-[18px] font-700 leading-[1.4] text-ink">{{ externalPage.heroTitle }}</p>
              <p class="mt-1 text-[13px] text-[#7f8a85]">{{ externalPage.heroSubtitle }}</p>
              <button class="mt-4 rounded-lg bg-[#ffeff4] px-4 py-2 text-[13px] font-700 text-[#ff5a95]" type="button">
                立即播放
              </button>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between">
            <p class="text-[15px] font-700 text-ink">100+ 个相关视频</p>
            <button class="text-[13px] font-600 text-[#6f7a75]" type="button">更多</button>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-3">
            <article
              v-for="item in externalPage.relatedVideos"
              :key="item.key"
              class="overflow-hidden rounded-lg bg-white ring-1 ring-line"
            >
              <img :src="item.cover" :alt="item.title" class="h-24 w-full object-cover" />
              <div class="px-3 py-3">
                <p class="line-clamp-2 text-[13px] font-600 leading-[1.45] text-ink">{{ item.title }}</p>
                <p class="mt-2 text-[11px] text-[#8A948F]">{{ item.duration }}</p>
              </div>
            </article>
          </div>
        </div>

        <div class="fixed inset-x-0 bottom-0 px-4 pb-4">
          <div class="app-sheet rounded-[16px] p-4 ring-1 ring-black/6">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-[13px] text-[#6f7a75]">浏览方式 <span class="text-[#9da7a2]">（推荐使用）</span></p>
            </div>

            <div class="flex items-center gap-3">
              <img :src="externalPage.brandIcon" :alt="externalPage.appName" class="app-media h-12 w-12 object-cover" />
              <div class="min-w-0 flex-1">
                <p class="text-[16px] font-700 text-ink">{{ externalPage.appName }}</p>
                <p class="mt-1 text-[12px] text-[#7f8a85]">你感兴趣的视频都在 B 站</p>
              </div>
              <button class="rounded-full bg-[#ff6ba7] px-5 py-2 text-[14px] font-700 text-white" type="button">
                打开
              </button>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <button class="h-11 w-11 flex items-center justify-center rounded-full bg-[#f5f7f8] text-[#7f8a85]" type="button">
                <ChevronLeft :size="18" :stroke-width="2.2" />
              </button>
              <div class="flex items-center gap-3">
                <button class="h-11 w-11 flex items-center justify-center rounded-full bg-[#f5f7f8] text-ink" type="button">
                  <Share2 :size="18" :stroke-width="2.2" />
                </button>
                <button class="h-11 w-11 flex items-center justify-center rounded-full bg-[#f5f7f8] text-ink" type="button">
                  <RefreshCw :size="18" :stroke-width="2.2" />
                </button>
                <button class="h-11 w-11 flex items-center justify-center rounded-full bg-[#f5f7f8] text-ink" type="button">
                  <ExternalLink :size="18" :stroke-width="2.2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>
