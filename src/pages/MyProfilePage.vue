<script setup lang="ts">
import { Check, ChevronRight } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import AppToast from '../components/feedback/AppToast.vue'
import { tabItems } from '../data/home'
import { loadMyProfile, myAvatarOptions, saveMyProfile } from '../data/my'
import type { MyGender, MyProfile } from '../data/my'
import AppShell from '../layouts/AppShell.vue'
import { useAppStore } from '../stores/app'

const router = useRouter()
const appStore = useAppStore()
const { toastMessage, toastVisible } = storeToRefs(appStore)

const createDraft = (): MyProfile => ({
  ...loadMyProfile(),
})

const draft = ref<MyProfile>(createDraft())
const avatarPanelVisible = ref(false)
const avatarLoadFailed = ref(false)
const isEditing = ref(false)

const genderOptions: MyGender[] = ['男', '女', '保密']

const profileInitial = computed(() => draft.value.nickname.trim().charAt(0) || '我')
const routeExists = (path: string) => router.resolve(path).matched.length > 0

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  if (routeExists('/my')) {
    void router.push('/my')
    return
  }

  void router.push('/home')
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

  if (routeExists('/my')) {
    void router.push('/my')
    return
  }

  appStore.showToast('个人中心路由待接入，页面文件已创建')
}

const selectAvatar = (image: string) => {
  if (!isEditing.value) {
    return
  }
  draft.value.avatar = image
  avatarLoadFailed.value = false
  avatarPanelVisible.value = false
}

const startEditing = () => {
  draft.value = createDraft()
  isEditing.value = true
}

const cancelEditing = () => {
  draft.value = createDraft()
  isEditing.value = false
  avatarPanelVisible.value = false
  avatarLoadFailed.value = false
}

const saveDraft = () => {
  if (!isEditing.value) {
    return
  }
  saveMyProfile(draft.value)
  isEditing.value = false
  avatarPanelVisible.value = false
  appStore.showToast('个人资料已保存')

  if (routeExists('/my')) {
    void router.push('/my')
  }
}
</script>

<template>
  <AppShell>
    <div class="min-h-[844px] flex flex-col homepage-surface">
      <IosStatusBar />

      <div class="flex-1 px-4 pb-5">
        <PageNavBar class="-mx-4" title="个人资料" @back="goBack" />

        <section class="pt-4">
          <div class="app-card px-5 py-5">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="h-18 w-18 shrink-0 overflow-hidden rounded-full bg-[#eef3f7] ring-1 ring-black/5">
                  <img
                    v-if="!avatarLoadFailed"
                    :src="draft.avatar"
                    :alt="draft.nickname"
                    class="h-full w-full object-cover"
                    @error="avatarLoadFailed = true"
                  />
                  <div
                    v-else
                    class="h-full w-full flex items-center justify-center bg-[linear-gradient(180deg,#f4f7fa_0%,#e8edf2_100%)] text-[26px] font-700 text-ink"
                  >
                    {{ profileInitial }}
                  </div>
                </div>
                <div>
                  <p class="text-[14px] font-700 text-ink">头像</p>
                  <p class="mt-1 text-[12px] leading-5 text-muted">
                    点击更换本地预设头像，保存后统一生效
                  </p>
                </div>
              </div>

              <button
                class="inline-flex items-center gap-1 rounded-full bg-[#f4f6f8] px-4 py-2 text-[12px] font-700 text-ink ring-1 ring-black/5 outline-none transition hover:bg-[#eceff2] focus-visible:ring-2 focus-visible:ring-brand-500"
                type="button"
                :disabled="!isEditing"
                @click="avatarPanelVisible = !avatarPanelVisible"
              >
                更换
                <ChevronRight :size="16" :stroke-width="2.1" />
              </button>
            </div>

            <div v-if="avatarPanelVisible" class="mt-5 grid grid-cols-3 gap-3">
              <button
                v-for="item in myAvatarOptions"
                :key="item.key"
                class="rounded-lg bg-soft p-3 text-left ring-1 outline-none transition hover:bg-white focus-visible:ring-2 focus-visible:ring-brand-500"
                :class="draft.avatar === item.image ? 'ring-brand-500 shadow-[0_10px_22px_rgba(255,127,0,0.12)]' : 'ring-black/5'"
                type="button"
                @click="selectAvatar(item.image)"
              >
                <div class="relative overflow-hidden rounded-[6px]">
                  <img :src="item.image" :alt="item.label" class="h-18 w-full object-cover" />
                  <div
                    v-if="draft.avatar === item.image"
                    class="absolute right-2 top-2 h-6 w-6 flex items-center justify-center rounded-full bg-white text-brand-700 shadow-[0_6px_14px_rgba(34,40,38,0.12)]"
                  >
                    <Check :size="14" :stroke-width="2.5" />
                  </div>
                </div>
                <p class="mt-2 truncate text-[11px] font-700 text-ink">{{ item.label }}</p>
              </button>
            </div>
          </div>
        </section>

        <section class="pt-4">
          <div class="space-y-3">
            <div class="app-card px-4 py-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <label class="block text-[12px] font-700 text-ink" for="account">登录账号</label>
                  <p class="mt-1 text-[11px] leading-5 text-muted">
                    用于登录 APP，可为手机号、微信号、Apple 或 Google 账号
                  </p>
                </div>
                <span class="shrink-0 rounded-full bg-[#eef4f2] px-3 py-1 text-[11px] font-700 text-brand-700 ring-1 ring-brand-100/80">
                  {{ draft.accountType }}
                </span>
              </div>
              <input
                id="account"
                v-model="draft.account"
                class="mt-3 h-12 w-full rounded-lg border-none bg-soft px-4 text-[14px] text-ink outline-none ring-1 ring-line"
                placeholder="登录账号"
                readonly
                type="text"
              />
            </div>

            <div class="app-card px-4 py-4">
              <label class="block text-[12px] font-700 text-ink" for="nickname">用户昵称</label>
              <input
                id="nickname"
                v-model="draft.nickname"
                class="mt-3 h-12 w-full rounded-lg border-none px-4 text-[14px] text-ink outline-none ring-1 ring-line transition focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-soft disabled:text-muted"
                :disabled="!isEditing"
                :class="isEditing ? 'bg-[#f5f7f9]' : 'bg-[#f1f4f3]'"
                maxlength="20"
                placeholder="请输入昵称"
                type="text"
              />
            </div>

            <div class="app-card px-4 py-4">
              <label class="block text-[12px] font-700 text-ink" for="phone">电话</label>
              <input
                id="phone"
                v-model="draft.phone"
                class="mt-3 h-12 w-full rounded-lg border-none px-4 text-[14px] text-ink outline-none ring-1 ring-line transition focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-soft disabled:text-muted"
                :disabled="!isEditing"
                :class="isEditing ? 'bg-[#f5f7f9]' : 'bg-[#f1f4f3]'"
                inputmode="tel"
                maxlength="20"
                placeholder="请输入联系电话"
                type="tel"
              />
            </div>

            <div class="app-card px-4 py-4">
              <p class="text-[12px] font-700 text-ink">性别</p>
              <div class="mt-3 grid grid-cols-3 gap-3">
                <button
                  v-for="item in genderOptions"
                  :key="item"
                  class="h-12 rounded-lg text-[13px] font-700 outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed"
                  :class="draft.gender === item
                    ? (isEditing ? 'bg-brand-500 text-white shadow-[0_12px_24px_rgba(255,127,0,0.2)]' : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100/80')
                    : (isEditing ? 'bg-[#f5f7f9] text-ink ring-1 ring-black/5' : 'bg-[#f1f4f3] text-muted ring-1 ring-black/5')"
                  :disabled="!isEditing"
                  type="button"
                  @click="draft.gender = item"
                >
                  {{ item }}
                </button>
              </div>
            </div>

            <div class="app-card px-4 py-4">
              <div class="grid grid-cols-1 gap-3">
                <label class="block" for="height">
                  <span class="text-[12px] font-700 text-ink">身高</span>
                  <div class="mt-3 flex items-center rounded-lg bg-soft px-4 ring-1 ring-line">
                    <input
                      id="height"
                      v-model="draft.height"
                      class="h-12 flex-1 border-none bg-transparent text-[14px] text-ink outline-none disabled:cursor-not-allowed disabled:text-muted"
                      :disabled="!isEditing"
                      inputmode="decimal"
                      placeholder="请输入身高"
                      type="text"
                    />
                    <span class="text-[12px] font-600 text-muted">cm</span>
                  </div>
                </label>

                <label class="block" for="weight">
                  <span class="text-[12px] font-700 text-ink">体重</span>
                  <div class="mt-3 flex items-center rounded-lg bg-soft px-4 ring-1 ring-line">
                    <input
                      id="weight"
                      v-model="draft.weight"
                      class="h-12 flex-1 border-none bg-transparent text-[14px] text-ink outline-none disabled:cursor-not-allowed disabled:text-muted"
                      :disabled="!isEditing"
                      inputmode="decimal"
                      placeholder="请输入体重"
                      type="text"
                    />
                    <span class="text-[12px] font-600 text-muted">kg</span>
                  </div>
                </label>

                <label class="block" for="bikeWeight">
                  <span class="text-[12px] font-700 text-ink">车重</span>
                  <div class="mt-3 flex items-center rounded-lg bg-soft px-4 ring-1 ring-line">
                    <input
                      id="bikeWeight"
                      v-model="draft.bikeWeight"
                      class="h-12 flex-1 border-none bg-transparent text-[14px] text-ink outline-none disabled:cursor-not-allowed disabled:text-muted"
                      :disabled="!isEditing"
                      inputmode="decimal"
                      placeholder="请输入车重"
                      type="text"
                    />
                    <span class="text-[12px] font-600 text-muted">kg</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </section>

        <section class="pb-2 pt-5">
          <div class="grid grid-cols-2 gap-3">
            <button
              class="rounded-lg px-4 py-4 text-[14px] font-700 outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500"
              :class="isEditing
                ? 'bg-white text-ink ring-1 ring-black/8 shadow-[0_10px_20px_rgba(34,40,38,0.05)] hover:bg-[#f7f9f8]'
                : 'bg-brand-50 text-brand-800 ring-1 ring-brand-200/90 shadow-[0_10px_20px_rgba(255,127,0,0.08)] hover:bg-brand-100'"
              type="button"
              @click="isEditing ? cancelEditing() : startEditing()"
            >
              {{ isEditing ? '取消' : '编辑' }}
            </button>
            <button
              class="rounded-lg px-4 py-4 text-[14px] font-700 text-white outline-none transition hover:bg-brand-800 focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:bg-[#d7dfdb] disabled:text-[#7f8a85] disabled:shadow-none disabled:ring-1 disabled:ring-[#c9d3ce]"
              :disabled="!isEditing"
              :class="isEditing ? 'bg-brand-700' : ''"
              type="button"
              @click="saveDraft"
            >
              保存
            </button>
          </div>
        </section>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>

    <AppToast :message="toastMessage" :visible="toastVisible" />
  </AppShell>
</template>
