<script setup lang="ts">
import { FileText, ShieldCheck } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BottomTabBar from '../components/common/BottomTabBar.vue'
import IosStatusBar from '../components/common/IosStatusBar.vue'
import PageNavBar from '../components/common/PageNavBar.vue'
import { tabItems } from '../data/home'
import AppShell from '../layouts/AppShell.vue'

type PrivacyDocumentType = 'agreement' | 'policy'

const route = useRoute()
const router = useRouter()

const documentType = computed<PrivacyDocumentType>(() =>
  route.params.documentType === 'policy' ? 'policy' : 'agreement',
)

const documentMeta = computed(() => documentType.value === 'agreement'
  ? {
      title: '隐私协议',
      summary: '本协议说明平台在提供骑行记录、设备管理与账号服务时如何处理个人信息。',
      updatedAt: '更新日期：2026年7月27日',
      icon: FileText,
      sections: [
        {
          title: '一、适用范围',
          content: '本协议适用于你使用账号登录、骑行数据记录、路线管理、设备连接及售后服务等功能时产生的个人信息处理活动。',
        },
        {
          title: '二、信息处理',
          content: '我们仅在实现具体功能所必需的范围内处理账号资料、设备标识、骑行记录和你主动提交的信息，并按照明确目的提供对应服务。',
        },
        {
          title: '三、你的权利',
          content: '你可以依法访问、更正或删除个人信息，也可以撤回相关授权。部分授权关闭后，对应功能可能无法继续使用。',
        },
        {
          title: '四、联系我们',
          content: '如对本协议或个人信息处理存在疑问，可通过应用内客服与我们联系，我们会在合理期限内处理。',
        },
      ],
    }
  : {
      title: '隐私政策',
      summary: '本政策说明个人信息的收集范围、使用方式、存储期限与安全保护措施。',
      updatedAt: '生效日期：2026年7月27日',
      icon: ShieldCheck,
      sections: [
        {
          title: '一、信息收集',
          content: '根据你使用的功能，我们可能收集账号信息、设备连接信息、骑行与路线数据、应用运行日志以及你主动授权的位置信息。',
        },
        {
          title: '二、信息使用',
          content: '相关信息用于完成设备绑定、骑行统计、路线记录、固件升级提醒、后台消息推送及故障诊断，不用于与这些目的无关的场景。',
        },
        {
          title: '三、存储与保护',
          content: '我们依据法律要求和业务必要期限保存信息，并采用访问控制、加密传输和安全审计等措施降低信息泄露、篡改或丢失风险。',
        },
        {
          title: '四、共享与更新',
          content: '除依法提供或取得你的明确授权外，我们不会向无关第三方共享个人信息。政策发生重要变化时会通过应用内消息提醒。',
        },
      ],
    })

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

  void router.push('/my')
}
</script>

<template>
  <AppShell>
    <div class="h-[844px] flex flex-col overflow-hidden homepage-surface">
      <IosStatusBar />

      <div class="min-h-0 flex-1 overflow-y-auto app-scroll-area px-4 pb-5">
        <PageNavBar class="-mx-4" :title="documentMeta.title" @back="router.back()" />

        <section class="pt-2">
          <div class="app-card px-5 py-5">
            <div class="flex items-start gap-4">
              <div class="h-13 w-13 shrink-0 flex items-center justify-center rounded-[6px] bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <component :is="documentMeta.icon" :size="21" :stroke-width="2.1" />
              </div>
              <div class="min-w-0">
                <h1 class="text-[20px] font-700 text-ink">{{ documentMeta.title }}</h1>
                <p class="mt-2 text-[12px] leading-[1.7] text-[#6F7C77]">{{ documentMeta.summary }}</p>
                <p class="mt-3 text-[11px] text-muted">{{ documentMeta.updatedAt }}</p>
              </div>
            </div>
          </div>

          <article class="app-list-group mt-4 px-5 py-1">
            <section
              v-for="section in documentMeta.sections"
              :key="section.title"
              class="border-b border-black/6 py-5 last:border-b-0"
            >
              <h2 class="text-[14px] font-700 text-ink">{{ section.title }}</h2>
              <p class="mt-2 text-[12px] leading-[1.9] text-[#64716D]">{{ section.content }}</p>
            </section>
          </article>
        </section>
      </div>

      <BottomTabBar active-key="profile" :items="tabItems" @select="handleTab" />
    </div>
  </AppShell>
</template>
