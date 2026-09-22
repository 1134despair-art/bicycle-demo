<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, CirclePlay } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import { tutorialListPages, type TutorialListPage, type TutorialManualItem, type TutorialVideoItem } from '../data/my'
import AppShell from '../layouts/AppShell.vue'

const route = useRoute()
const router = useRouter()

const listKey = computed(() =>
  typeof route.params.listKey === 'string' ? route.params.listKey : '',
)

const tutorialList = computed<TutorialListPage | null>(() => tutorialListPages[listKey.value] ?? null)

const goBack = () => {
  void router.push('/my/tutorials')
}

const openItem = (item: TutorialVideoItem | TutorialManualItem) => {
  if (tutorialList.value?.type === 'video') {
    void router.push(`/my/tutorials/video/${item.key}`)
    return
  }

  void router.push(`/my/tutorials/manual/${item.key}`)
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <div class="px-4 pb-6">
        <PageNavBar class="-mx-4" :title="tutorialList?.title ?? '教程'" @back="goBack" />

        <div
          v-if="tutorialList"
          class="app-list-group mt-4"
        >
          <button
            v-for="item in tutorialList.items"
            :key="item.key"
            class="flex w-full items-center gap-3 border-b border-black/5 px-4 py-4 text-left last:border-b-0"
            type="button"
            @click="openItem(item)"
          >
            <div class="min-w-0 flex-1">
              <p class="text-[15px] font-600 leading-[1.45] text-ink">{{ item.title }}</p>
            </div>

            <div
              v-if="tutorialList.type === 'video'"
              class="h-9 w-9 flex items-center justify-center rounded-full bg-[#0f1413] text-white"
            >
              <CirclePlay :size="18" :stroke-width="2.2" />
            </div>

            <div
              v-else
              class="h-9 w-9 flex items-center justify-center rounded-full bg-[#f4f7f5] text-[#8A948F] ring-1 ring-black/5"
            >
              <ChevronRight :size="18" :stroke-width="2.2" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </AppShell>
</template>
