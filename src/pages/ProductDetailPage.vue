<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import {
  getProductMatrixCategory,
  getProductMatrixItem,
  productMatrixCategories,
} from '../data/home'
import AppShell from '../layouts/AppShell.vue'

const route = useRoute()
const router = useRouter()

const categoryKey = computed(() =>
  typeof route.params.category === 'string' ? route.params.category : 'road',
)

const productKey = computed(() =>
  typeof route.params.product === 'string' ? route.params.product : '',
)

const source = computed(() =>
  typeof route.query.from === 'string' ? route.query.from : '',
)

const category = computed(() => getProductMatrixCategory(categoryKey.value) ?? productMatrixCategories[0])
const product = computed(() => getProductMatrixItem(categoryKey.value, productKey.value) ?? category.value.items[0])
type DisplayTechnicalFeature = {
  title: string
  description: string
  image?: string
}

const displayTechnicalFeatures = computed<DisplayTechnicalFeature[]>(() => {
  if (product.value.technicalFeatures?.length) {
    return product.value.technicalFeatures
  }

  return product.value.highlights.map((title) => ({
    title,
    description: '',
  }))
})

const handleBack = () => {
  if (source.value === 'home') {
    void router.push('/home')
    return
  }

  if (source.value === 'recommended-list') {
    void router.push('/products/recommended/list')
    return
  }

  void router.push(`/products/${category.value.key}`)
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <PageNavBar
        title="产品详情"
        @back="handleBack"
      />

      <section class="px-4 pt-2">
        <div class="app-card overflow-hidden">
          <div class="aspect-[4/3] overflow-hidden bg-soft">
            <img :src="product.image" :alt="product.name" class="h-full w-full object-cover" />
          </div>
        </div>
        <h1 class="px-1 pt-4 text-left text-[24px] font-700 leading-[1.35] text-ink">
          {{ product.name }}
        </h1>
      </section>

      <section class="px-4 pt-4">
        <div>
          <h2 class="text-[18px] font-700 text-ink">产品规格</h2>
          <div class="app-list-group mt-3">
            <div
              v-for="item in product.parameters"
              :key="item.label"
              class="flex items-center justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0"
            >
              <span class="text-[13px] text-muted">{{ item.label }}</span>
              <span class="text-right text-[14px] font-700 text-ink">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="displayTechnicalFeatures.length" class="px-4 pb-8 pt-4">
        <h2 class="mb-3 text-[18px] font-700 text-ink">技术特点</h2>
        <div class="space-y-3">
          <article
            v-for="item in displayTechnicalFeatures"
            :key="item.title"
            class="app-card overflow-hidden"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="h-36 w-full object-cover"
            />
            <div class="px-4 py-4">
              <h3 class="text-[15px] font-700 leading-[1.5] text-ink">{{ item.title }}</h3>
              <p v-if="item.description" class="mt-2 text-[13px] leading-[1.7] text-muted">{{ item.description }}</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  </AppShell>
</template>
