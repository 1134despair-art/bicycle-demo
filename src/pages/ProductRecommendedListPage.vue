<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import { recommendedProducts } from '../data/home'
import AppShell from '../layouts/AppShell.vue'

const router = useRouter()

const handleOpenDetail = (categoryKey: string, productKey: string) => {
  void router.push(`/products/${categoryKey}/${productKey}?from=recommended-list`)
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <PageNavBar
        title="产品列表"
        @back="router.push('/home')"
      />

      <section class="px-4 pb-8 pt-2">
        <div class="space-y-3">
          <button
            v-for="item in recommendedProducts"
            :key="item.key"
            class="app-card-elevated w-full cursor-pointer overflow-hidden text-left outline-none transition hover:border-brand-200 active:scale-[0.995] focus-visible:ring-2 focus-visible:ring-brand-500"
            type="button"
            @click="handleOpenDetail(item.categoryKey, item.productKey)"
          >
            <img :src="item.image" :alt="item.name" class="h-44 w-full object-cover" />
            <div class="px-4 py-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="text-[11px] font-700 text-brand-700">{{ item.category }}</p>
                  <h2 class="mt-1 text-[18px] font-700 tracking-[-0.03em] text-ink">{{ item.name }}</h2>
                  <p class="mt-2 text-[13px] font-600 text-ink">{{ item.specs }}</p>
                  <p class="mt-2 text-[13px] leading-[1.6] text-muted">{{ item.description }}</p>
                </div>
                <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-#f5f6f8 px-3 py-2 text-[12px] font-700 text-ink">
                  <span>详情</span>
                  <ChevronRight :size="14" :stroke-width="2.2" />
                </span>
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  </AppShell>
</template>
