<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import HomeBannerCarousel from '../components/home/HomeBannerCarousel.vue'
import ProductCategoryList from '../components/home/ProductCategoryList.vue'
import RecommendedProductList from '../components/home/RecommendedProductList.vue'
import { homeBanners, productCategories, recommendedProducts, tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const store = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(store)

const handleCategory = (key: string) => {
  void router.push(`/products/${key}`)
}

const handleProductDetail = (key: string) => {
  const target = recommendedProducts.find((item) => item.key === key)
  if (!target) {
    return
  }
  void router.push(`/products/${target.categoryKey}/${target.productKey}?from=home`)
}

const handleRecommendedList = () => {
  void router.push('/products/recommended/list')
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
    return
  }

  const label = tabItems.find((item) => item.key === key)?.label ?? '页面'
  store.showToast(`${label}模块将在下一阶段开发`)
}
</script>

<template>
  <AppShell>
    <div class="app-safe-top-page h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area">
        <HomeBannerCarousel :items="homeBanners" />

        <ProductCategoryList :items="productCategories" @select="handleCategory" />

        <RecommendedProductList
          :items="recommendedProducts"
          @detail="handleProductDetail"
          @more="handleRecommendedList"
        />
      </div>

      <BottomTabBar active-key="home" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
