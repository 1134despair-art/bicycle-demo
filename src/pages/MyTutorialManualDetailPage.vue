<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import { tutorialManualPages } from '../data/my'
import AppShell from '../layouts/AppShell.vue'

const route = useRoute()
const router = useRouter()

const manualKey = computed(() =>
  typeof route.params.manualKey === 'string' ? route.params.manualKey : '',
)

const manualPage = computed(() => tutorialManualPages[manualKey.value] ?? null)

const goBack = () => {
  void router.push('/my/tutorials/list/manual')
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <div class="px-4 pb-6">
        <PageNavBar class="-mx-4" :title="manualPage?.title ?? '手册'" @back="goBack" />

        <div
          v-if="manualPage"
          class="app-card mt-4 overflow-hidden p-3"
        >
          <img
            :src="manualPage.image"
            :alt="manualPage.title"
            class="app-media w-full object-cover"
          />
        </div>
      </div>
    </div>
  </AppShell>
</template>
