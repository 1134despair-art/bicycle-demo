<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { productMatrixCategories } from '../data/home'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const selectedFilterKey = ref('')

const currentCategory = computed(() => {
  const key = typeof route.params.category === 'string' ? route.params.category : 'road'
  return productMatrixCategories.find((item) => item.key === key) ?? productMatrixCategories[0]
})

const filterOptions = computed(() => {
  const optionMap: Record<string, Array<{ key: string; label: string; sublabel: string; targetKeys: string[] }>> = {
    road: [
      {
        key: 'erx',
        label: 'eRX',
        sublabel: '10-12S',
        targetKeys: [
          'road-erx-left-shifter',
          'road-erx-right-shifter',
          'road-erx-front-derailleur',
          'road-erx-rear-derailleur',
          'road-erx-charger',
          'road-erx-battery',
        ],
      },
      {
        key: 'er9',
        label: 'eR9',
        sublabel: '10-12S',
        targetKeys: ['road-er9-groupset', 'road-bike-frame'],
      },
      {
        key: 'rx',
        label: 'RX',
        sublabel: '12S',
        targetKeys: ['road-wheelset', 'road-rx-flat-shifter'],
      },
      {
        key: 'r9',
        label: 'R9',
        sublabel: '11S',
        targetKeys: ['road-brake', 'road-r9-front-derailleur'],
      },
      {
        key: 'r7',
        label: 'R7',
        sublabel: '10S',
        targetKeys: ['road-r7-crankset', 'road-r7-cable'],
      },
    ],
    gravel: [
      {
        key: 'terra',
        label: 'Terra',
        sublabel: 'Gravel',
        targetKeys: ['gravel-bike', 'gravel-frame', 'gravel-fork'],
      },
      {
        key: 'grx',
        label: 'GRX',
        sublabel: '1x12S',
        targetKeys: ['gravel-groupset', 'gravel-grx-shifter', 'gravel-grx-rear-derailleur'],
      },
      {
        key: 'allroad',
        label: 'Allroad',
        sublabel: 'Tubeless',
        targetKeys: ['gravel-wheelset', 'gravel-tire', 'gravel-handlebar'],
      },
      {
        key: 'bikepack',
        label: 'Pack',
        sublabel: 'Adventure',
        targetKeys: ['gravel-bag', 'gravel-handlebar-bag', 'gravel-frame-bag'],
      },
    ],
    mtb: [
      {
        key: 'trail',
        label: 'Trail',
        sublabel: '29er',
        targetKeys: ['mtb-bike', 'mtb-frame', 'mtb-wheelset'],
      },
      {
        key: 'fork',
        label: 'Fork',
        sublabel: '120mm',
        targetKeys: ['mtb-fork', 'mtb-fork-pro', 'mtb-shock'],
      },
      {
        key: 'drive',
        label: 'Drive',
        sublabel: '12S',
        targetKeys: ['mtb-drivetrain', 'mtb-rear-derailleur', 'mtb-cassette'],
      },
      {
        key: 'dropper',
        label: 'Dropper',
        sublabel: '150mm',
        targetKeys: ['mtb-dropper', 'mtb-dropper-remote', 'mtb-seatpost-clamp'],
      },
    ],
    other: [
      {
        key: 'computer',
        label: '码表',
        sublabel: 'GNSS',
        targetKeys: ['other-computer', 'other-computer-mini', 'other-computer-mount'],
      },
      {
        key: 'hr',
        label: '心率',
        sublabel: 'ANT+',
        targetKeys: ['other-heart-rate', 'other-heart-rate-strap'],
      },
      {
        key: 'cadence',
        label: '踏频',
        sublabel: 'Sensor',
        targetKeys: ['other-cadence', 'other-speed-sensor'],
      },
      {
        key: 'power',
        label: '功率',
        sublabel: 'Meter',
        targetKeys: ['other-power-meter', 'other-power-pedal', 'other-power-spider'],
      },
    ],
  }

  return optionMap[currentCategory.value.key] ?? []
})

const filteredItems = computed(() =>
  currentCategory.value.items.filter((item) => {
    const activeOption = filterOptions.value.find((option) => option.key === selectedFilterKey.value)
    if (!activeOption) {
      return true
    }

    return activeOption.targetKeys.includes(item.key)
  }),
)

watch(
  () => currentCategory.value.key,
  () => {
    selectedFilterKey.value = filterOptions.value[0]?.key ?? ''
  },
  { immediate: true },
)

const handleOpenDetail = (productKey: string) => {
  void router.push(`/products/${currentCategory.value.key}/${productKey}`)
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />
      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area">
        <PageNavBar title="产品列表" @back="router.push('/home')" />

        <section class="px-4 pt-2">
          <div class="flex gap-2 overflow-x-auto app-scroll-area whitespace-nowrap pr-1">
              <button
                v-for="item in filterOptions"
                :key="item.key"
                class="min-w-16 shrink-0 rounded-lg border px-4 py-3 text-left transition"
                :class="selectedFilterKey === item.key ? 'border-brand-500 bg-brand-500 text-white shadow-[0_8px_18px_rgba(255,127,0,0.18)]' : 'border-line bg-white text-ink'"
                type="button"
                @click="selectedFilterKey = item.key"
              >
                <p class="text-[14px] font-800 leading-none">{{ item.label }}</p>
                <p
                  class="mt-2 text-[12px] leading-none"
                  :class="selectedFilterKey === item.key ? 'text-white/84' : 'text-muted'"
                >
                  {{ item.sublabel }}
                </p>
              </button>
          </div>
        </section>

        <section class="px-4 pb-6 pt-4">
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="item in filteredItems"
              :key="item.key"
              class="cursor-pointer overflow-hidden rounded-lg border border-line bg-white text-left shadow-card transition hover:border-brand-100 active:scale-[0.995]"
              type="button"
              @click="handleOpenDetail(item.key)"
            >
              <img :src="item.image" :alt="item.name" class="h-38 w-full object-cover" />
              <div class="px-3 py-3">
                <p class="line-clamp-2 text-[14px] font-700 leading-[1.4] text-ink">{{ item.name }}</p>
                <p class="mt-2 text-[12px] leading-[1.45] text-muted">{{ item.specs }}</p>
                <div class="mt-3 flex items-center justify-end text-[12px] font-700 text-brand-500">
                  <span>查看详情</span>
                  <ChevronRight :size="14" :stroke-width="2.2" />
                </div>
              </div>
            </button>
          </div>
        </section>

        <AppToast :message="store.toastMessage" :visible="store.toastVisible" />
      </div>
    </div>
  </AppShell>
</template>
