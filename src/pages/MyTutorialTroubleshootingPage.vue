<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown, Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import { tutorialTroubleshootingFaqs } from '../data/my'
import AppShell from '../layouts/AppShell.vue'

const router = useRouter()

const searchDraft = ref('')
const keyword = ref('')
const expandedKeys = ref<string[]>(['piston-no-rebound', 'weak-braking-force'])

const filteredFaqs = computed(() => {
  const query = keyword.value.trim()

  if (!query) {
    return tutorialTroubleshootingFaqs
  }

  return tutorialTroubleshootingFaqs.filter((item) =>
    item.title.includes(query) || item.steps.some((step) => step.includes(query)),
  )
})

const isExpanded = (key: string) => expandedKeys.value.includes(key)

const toggleFaq = (key: string) => {
  if (isExpanded(key)) {
    expandedKeys.value = expandedKeys.value.filter((item) => item !== key)
    return
  }

  expandedKeys.value = [...expandedKeys.value, key]
}

const handleSearch = () => {
  keyword.value = searchDraft.value.trim()

  if (!keyword.value) {
    expandedKeys.value = ['piston-no-rebound', 'weak-braking-force']
    return
  }

  expandedKeys.value = filteredFaqs.value.map((item) => item.key)
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  void router.push('/my/tutorials')
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />

      <div class="px-4 pb-6">
        <PageNavBar class="-mx-4" title="故障排查" @back="goBack" />

        <section class="pt-4">
          <div class="app-card px-5 py-5">
            <h2 class="text-[21px] font-700 tracking-[-0.05em] text-ink">
              常见问题 FAQ
            </h2>
            <p class="mt-2 text-[12px] leading-[1.8] text-[#6F7C77]">
              支持按关键字检索常见故障与处理建议，便于用户快速定位问题。
            </p>

            <form
              class="mt-4 flex items-center gap-3 rounded-lg bg-soft p-2 ring-1 ring-line"
              @submit.prevent="handleSearch"
            >
              <div class="min-w-0 flex flex-1 items-center gap-2 px-2">
                <Search :size="18" :stroke-width="2.2" class="shrink-0 text-[#93A19B]" />
                <input
                  v-model="searchDraft"
                  class="h-10 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-[#97A49F]"
                  placeholder="请输入关键字"
                  type="text"
                >
              </div>

              <button
                class="h-11 shrink-0 rounded-lg bg-brand-500 px-5 text-[14px] font-700 text-white transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
                type="submit"
              >
                搜索
              </button>
            </form>
          </div>
        </section>

        <section class="pt-4">
          <div v-if="filteredFaqs.length" class="space-y-3">
            <div
              v-for="(faq, index) in filteredFaqs"
              :key="faq.key"
              class="app-list-group"
            >
              <button
                class="flex w-full items-start justify-between gap-3 px-4 py-4 text-left outline-none transition hover:bg-[#fafcfa] focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
                @click="toggleFaq(faq.key)"
              >
                <div class="min-w-0 flex-1">
                  <h3 class="text-[15px] font-700 leading-[1.45] tracking-[-0.02em] text-ink">
                    {{ index + 1 }}. {{ faq.title }}
                  </h3>
                </div>

                <div
                  class="mt-0.5 h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-[#F6F8F7] text-[#8DA09A] ring-1 ring-[#E4EBE6] transition"
                  :class="isExpanded(faq.key) ? 'rotate-180 bg-brand-50 text-brand-700 ring-brand-100' : ''"
                >
                  <ChevronDown :size="16" :stroke-width="2.4" />
                </div>
              </button>

              <div
                v-if="isExpanded(faq.key)"
                class="border-t border-black/6 bg-[#f7f9f8] px-4 py-4"
              >
                <div
                  v-for="(step, stepIndex) in faq.steps"
                  :key="`${faq.key}-${stepIndex}`"
                  class="flex items-start gap-3 py-1.5"
                >
                  <div class="mt-0.5 h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-white text-[11px] font-700 text-brand-700 ring-1 ring-brand-100">
                    {{ stepIndex + 1 }}
                  </div>
                  <p class="text-[13px] leading-[1.72] text-[#51605A]">
                    {{ step }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="app-card px-5 py-8 text-center"
          >
            <p class="text-[15px] font-700 text-ink">未找到相关问题</p>
            <p class="mt-2 text-[13px] leading-[1.7] text-muted">请尝试更换关键词，或清空搜索后查看全部 FAQ。</p>
          </div>
        </section>
      </div>
    </div>
  </AppShell>
</template>
