<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import RouteSaveForm from '../components/route/RouteSaveForm.vue'
import RouteSaveSummaryCard from '../components/route/RouteSaveSummaryCard.vue'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const store = useAppStore()
const { routeDraft, toastMessage, toastVisible } = storeToRefs(store)

const name = ref('')
const description = ref('')
const focusedField = ref<'name' | 'description' | null>(null)
const blurRequestKey = ref(0)
const selectNameOnEntry = ref(false)
const isHydratingDraft = ref(false)
const isImportedRoute = computed(() => routeDraft.value?.source === '文件导入')

const shouldSelectDraftNameOnEntry = (draftName: string) => /未命名|草稿/.test(draftName.trim())

const hydrateFromDraft = (draft: typeof routeDraft.value) => {
  isHydratingDraft.value = true
  name.value = draft?.name ?? ''
  description.value = draft?.description ?? ''
  focusedField.value = null
  selectNameOnEntry.value = Boolean(draft?.name && shouldSelectDraftNameOnEntry(draft.name))

  void nextTick(() => {
    isHydratingDraft.value = false
  })
}

watch(
  () => routeDraft.value?.id ?? null,
  () => {
    hydrateFromDraft(routeDraft.value)
  },
  { immediate: true },
)

watch([name, description], ([nextName, nextDescription]) => {
  if (isHydratingDraft.value) {
    return
  }

  const draft = routeDraft.value
  if (!draft) {
    return
  }

  if (
    draft.name === nextName
    && draft.description === nextDescription
  ) {
    return
  }

  store.updateRouteDraftMeta({
    name: nextName,
    description: nextDescription,
  })
})

const canSubmit = computed(() => Boolean(routeDraft.value && name.value.trim()))

const handleFocusChange = (field: 'name' | 'description' | null) => {
  if (isImportedRoute.value) {
    focusedField.value = null
    return
  }

  focusedField.value = field
}

const handleCollapseEditing = () => {
  focusedField.value = null
  blurRequestKey.value += 1
}

const handleSave = () => {
  const nextDescription = isImportedRoute.value
    ? routeDraft.value?.description ?? ''
    : description.value.trim()
  const result = store.saveDraftRoute({
    name: name.value.trim(),
    description: nextDescription,
  })

  if (!result) {
    store.showToast('当前没有可保存的路线草稿')
    return
  }

  void router.push(`/routes/${result.id}`)
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] homepage-surface">
      <IosStatusBar />
      <PageNavBar title="保存路线" @back="router.back()" />

      <template v-if="routeDraft">
        <section v-show="isImportedRoute || !focusedField" class="px-4 pt-2">
          <RouteSaveSummaryCard :route="routeDraft" />
        </section>

        <section class="px-4" :class="!isImportedRoute && focusedField ? 'pt-2 pb-6' : 'pt-4 pb-6'">
          <div
            v-if="!isImportedRoute && focusedField"
            class="mb-3 flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3 text-[11px] text-brand-600"
          >
            <span>{{ focusedField === 'name' ? '正在编辑路线名称' : '正在补充路线描述' }}</span>
            <button class="font-700" type="button" @click="handleCollapseEditing">收起</button>
          </div>

          <RouteSaveForm
            v-model:description="description"
            v-model:name="name"
            :blur-request-key="blurRequestKey"
            :can-submit="canSubmit"
            :compact="Boolean(!isImportedRoute && focusedField)"
            :name-only="isImportedRoute"
            :select-name-on-entry="selectNameOnEntry"
            @submit="handleSave"
            @focus-change="handleFocusChange"
          />
        </section>
      </template>

      <section v-else class="px-4 pt-2">
        <div class="app-card px-4 py-5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-muted">路线草稿</p>
          <h2 class="mt-2 text-[20px] font-700 text-ink">当前没有待保存的路线</h2>
          <p class="mt-2 text-[12px] leading-[1.7] text-muted">
            请先从地图规划、历史轨迹生成或文件导入入口创建草稿，再回到这里完成命名与保存。
          </p>

          <div class="mt-5 grid grid-cols-2 gap-3">
            <button
              class="min-h-11 rounded-lg bg-#f5f6f8 text-[13px] font-700 text-ink"
              type="button"
              @click="router.push('/routes')"
            >
              返回路线中心
            </button>
            <button
              class="min-h-11 rounded-lg bg-brand-500 text-[13px] font-700 text-white transition hover:bg-brand-600"
              type="button"
              @click="router.push('/routes/create/map')"
            >
              去地图规划
            </button>
          </div>
        </div>
      </section>
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
