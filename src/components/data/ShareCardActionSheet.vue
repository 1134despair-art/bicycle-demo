<script setup lang="ts">
import {
  Aperture,
  ArrowLeft,
  Check,
  Download,
  Ellipsis,
  ImagePlus,
  MessageCircle,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import DataLongPoster from './DataLongPoster.vue'

type ShareImageLayout = 'standard' | 'long'
type PosterTemplateId = 'velocity' | 'night' | 'fresh' | 'custom'
type ShareTarget = 'save' | 'wechat' | 'moments' | 'more'

type ShareImageOptions = {
  layout: ShareImageLayout
  templateId: PosterTemplateId
  background: File | null
  target: ShareTarget
}

type PosterTemplate = {
  key: Exclude<PosterTemplateId, 'custom'>
  name: string
  description: string
  themeClass: string
}

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  generate: [options: ShareImageOptions]
}>()

const systemPosterBackground = `${import.meta.env.BASE_URL}media/share/l-twoo-riding-poster.png`

const layoutOptions: Array<{ key: ShareImageLayout, label: string }> = [
  { key: 'standard', label: '运动海报' },
  { key: 'long', label: '数据长图' },
]

const posterTemplates: PosterTemplate[] = [
  {
    key: 'velocity',
    name: '经典居中',
    description: '三项数据聚焦',
    themeClass: 'poster-layout-centered',
  },
  {
    key: 'night',
    name: '底部数据',
    description: '突出骑行画面',
    themeClass: 'poster-layout-bottom',
  },
  {
    key: 'fresh',
    name: '侧栏数据',
    description: '留出画面主体',
    themeClass: 'poster-layout-side',
  },
]

const posterMetrics = [
  { key: 'distance', label: '里程', value: '6.65', unit: 'km' },
  { key: 'duration', label: '骑行时长', value: '00:55:54', unit: '' },
  { key: 'climbing', label: '爬升', value: '21', unit: 'm' },
]

const shareActions = [
  { key: 'save' as const, label: '保存', icon: Download, tone: 'share-action-neutral' },
  { key: 'wechat' as const, label: '微信', icon: MessageCircle, tone: 'share-action-wechat' },
  { key: 'moments' as const, label: '朋友圈', icon: Aperture, tone: 'share-action-moments' },
  { key: 'more' as const, label: '更多', icon: Ellipsis, tone: 'share-action-neutral' },
]

const selectedLayout = ref<ShareImageLayout>('standard')
const selectedTemplateId = ref<PosterTemplateId>('velocity')
const backgroundFile = ref<File | null>(null)
const backgroundPreviewUrl = ref('')
const previewVisible = ref(false)
const isSaving = ref(false)

const selectedSystemTemplateId = computed<Exclude<PosterTemplateId, 'custom'>>(() => {
  return selectedTemplateId.value === 'custom' ? 'velocity' : selectedTemplateId.value
})

const selectedTemplate = computed(() => {
  return posterTemplates.find((item) => item.key === selectedSystemTemplateId.value) ?? posterTemplates[0]
})

const selectedTemplateName = computed(() => {
  if (selectedLayout.value === 'long') {
    return '综合骑行报告'
  }

  return selectedTemplateId.value === 'custom' ? '自定义背景' : selectedTemplate.value.name
})

const posterBackgroundUrl = computed(() => {
  return selectedTemplateId.value === 'custom' && backgroundPreviewUrl.value
    ? backgroundPreviewUrl.value
    : systemPosterBackground
})

const releaseBackgroundPreview = () => {
  if (backgroundPreviewUrl.value) {
    URL.revokeObjectURL(backgroundPreviewUrl.value)
    backgroundPreviewUrl.value = ''
  }
}

const handleBackgroundUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }

  releaseBackgroundPreview()
  backgroundFile.value = file
  backgroundPreviewUrl.value = URL.createObjectURL(file)
  selectedTemplateId.value = 'custom'
  input.value = ''
}

const handleRemoveBackground = () => {
  releaseBackgroundPreview()
  backgroundFile.value = null
  selectedTemplateId.value = 'velocity'
}

const handleClose = () => {
  previewVisible.value = false
  emit('close')
}

const handleGenerate = () => {
  if (selectedLayout.value === 'long') {
    selectedTemplateId.value = 'velocity'
  }
  previewVisible.value = true
}

const handleReset = () => {
  selectedTemplateId.value = 'velocity'
  if (selectedLayout.value === 'standard') {
    handleRemoveBackground()
  }
}

const getShareOptions = (target: ShareTarget): ShareImageOptions => ({
  layout: selectedLayout.value,
  templateId: selectedTemplateId.value,
  background: selectedTemplateId.value === 'custom' ? backgroundFile.value : null,
  target,
})

const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error(`Unable to load poster asset: ${src}`))
  image.src = src
})

const drawImageCover = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) => {
  drawImageCoverAt(context, image, 0, 0, width, height)
}

const drawImageCoverAt = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawnWidth = image.naturalWidth * scale
  const drawnHeight = image.naturalHeight * scale
  context.drawImage(image, x + (width - drawnWidth) / 2, y + (height - drawnHeight) / 2, drawnWidth, drawnHeight)
}

const drawMetric = (
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  align: CanvasTextAlign,
  valueSize: number,
) => {
  context.textAlign = align
  context.font = '500 34px "Segoe UI", "Microsoft YaHei", sans-serif'
  context.fillStyle = 'rgba(255, 255, 255, 0.86)'
  context.fillText(label, x, y)
  context.font = `800 ${valueSize}px "Segoe UI", "Microsoft YaHei", sans-serif`
  context.fillStyle = '#ffffff'
  context.fillText(value, x, y + valueSize + 18)
}

const drawPosterData = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const layout = selectedSystemTemplateId.value
  context.save()
  context.shadowColor = 'rgba(0, 0, 0, 0.45)'
  context.shadowBlur = 14
  context.shadowOffsetY = 3

  if (layout === 'night') {
    const shade = context.createLinearGradient(0, height * 0.56, 0, height)
    shade.addColorStop(0, 'rgba(0, 0, 0, 0)')
    shade.addColorStop(1, 'rgba(0, 0, 0, 0.78)')
    context.shadowColor = 'transparent'
    context.fillStyle = shade
    context.fillRect(0, 0, width, height)
    context.shadowColor = 'rgba(0, 0, 0, 0.4)'

    const positions = [width * 0.18, width * 0.5, width * 0.82]
    drawMetric(context, '里程', '6.65 km', positions[0], height - 170, 'center', 48)
    drawMetric(context, '骑行时长', '00:55:54', positions[1], height - 170, 'center', 43)
    drawMetric(context, '爬升', '21 m', positions[2], height - 170, 'center', 48)
    context.restore()
    return
  }

  if (layout === 'fresh') {
    const shade = context.createLinearGradient(0, 0, width * 0.7, 0)
    shade.addColorStop(0, 'rgba(0, 0, 0, 0.52)')
    shade.addColorStop(1, 'rgba(0, 0, 0, 0)')
    context.shadowColor = 'transparent'
    context.fillStyle = shade
    context.fillRect(0, 0, width, height)
    context.shadowColor = 'rgba(0, 0, 0, 0.4)'

    drawMetric(context, '里程', '6.65 km', width * 0.09, height * 0.26, 'left', 72)
    drawMetric(context, '骑行时长', '00:55:54', width * 0.09, height * 0.42, 'left', 68)
    drawMetric(context, '爬升', '21 m', width * 0.09, height * 0.58, 'left', 72)
    context.restore()
    return
  }

  const shade = context.createLinearGradient(0, 0, 0, height * 0.58)
  shade.addColorStop(0, 'rgba(0, 0, 0, 0.26)')
  shade.addColorStop(1, 'rgba(0, 0, 0, 0)')
  context.shadowColor = 'transparent'
  context.fillStyle = shade
  context.fillRect(0, 0, width, height * 0.62)
  context.shadowColor = 'rgba(0, 0, 0, 0.45)'

  drawMetric(context, '里程', '6.65 km', width / 2, height * 0.19, 'center', 76)
  drawMetric(context, '骑行时长', '00:55:54', width / 2, height * 0.34, 'center', 72)
  drawMetric(context, '爬升', '21 m', width / 2, height * 0.49, 'center', 76)
  context.restore()
}

const setCanvasFont = (
  context: CanvasRenderingContext2D,
  size: number,
  weight = 600,
) => {
  context.font = `${weight} ${size}px "Segoe UI", "Microsoft YaHei", sans-serif`
}

const drawLongSectionTitle = (
  context: CanvasRenderingContext2D,
  title: string,
  y: number,
) => {
  context.fillStyle = '#ff7f00'
  context.fillRect(68, y - 32, 10, 58)
  context.fillStyle = '#20252b'
  setCanvasFont(context, 48, 750)
  context.textAlign = 'left'
  context.fillText(title, 98, y + 12)
}

const drawLongProgressRing = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  progress: number,
  distance: string,
  label: string,
  ratio: string,
) => {
  const start = -Math.PI / 2
  context.lineWidth = 20
  context.lineCap = 'round'
  context.strokeStyle = '#edf0f2'
  context.beginPath()
  context.arc(x, y, 94, 0, Math.PI * 2)
  context.stroke()
  context.strokeStyle = color
  context.beginPath()
  context.arc(x, y, 94, start, start + Math.PI * 2 * progress)
  context.stroke()

  context.textAlign = 'center'
  context.fillStyle = '#3d454d'
  setCanvasFont(context, 34, 750)
  context.fillText(distance, x, y + 10)
  context.fillStyle = color
  setCanvasFont(context, 28, 750)
  context.fillText(label, x, y + 145)
  context.fillStyle = '#8b9299'
  setCanvasFont(context, 24, 600)
  context.fillText(ratio, x, y + 188)
}

const drawDataLongPoster = async (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const [routeMap, chart, avatar] = await Promise.all([
    loadImage(`${import.meta.env.BASE_URL}media/app/route-map.png`),
    loadImage(`${import.meta.env.BASE_URL}media/app/ride-chart.png`),
    loadImage(`${import.meta.env.BASE_URL}media/app/avatar-demo.png`),
  ])

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)

  drawImageCoverAt(context, routeMap, 0, 0, width, 720)
  const mapWash = context.createLinearGradient(0, 0, 0, 720)
  mapWash.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
  mapWash.addColorStop(0.6, 'rgba(255, 255, 255, 0)')
  mapWash.addColorStop(1, 'rgba(30, 42, 48, 0.15)')
  context.fillStyle = mapWash
  context.fillRect(0, 0, width, 720)

  context.textAlign = 'left'
  context.fillStyle = '#34414c'
  setCanvasFont(context, 28, 650)
  context.fillText('2026.08.03', 64, 76)
  setCanvasFont(context, 46, 750)
  context.fillText('成都 · 骑行', 64, 132)

  context.fillStyle = '#ff7f00'
  context.fillRect(width - 282, 56, 218, 72)
  context.textAlign = 'center'
  context.fillStyle = '#ffffff'
  context.font = 'italic 900 42px "Segoe UI", Arial, sans-serif'
  context.fillText('L-TWOO', width - 173, 106)
  context.textAlign = 'left'

  context.fillStyle = 'rgba(255, 255, 255, 0.9)'
  context.fillRect(width - 390, 534, 326, 132)
  context.fillStyle = '#7a8189'
  setCanvasFont(context, 25, 600)
  context.fillText('本次骑行', width - 358, 578)
  context.fillStyle = '#ff7f00'
  setCanvasFont(context, 66, 800)
  context.fillText('6.65 km', width - 358, 644)

  context.fillStyle = '#ffffff'
  context.fillRect(0, 720, width, 180)
  context.save()
  context.beginPath()
  context.arc(116, 810, 55, 0, Math.PI * 2)
  context.clip()
  drawImageCoverAt(context, avatar, 61, 755, 110, 110)
  context.restore()
  context.fillStyle = '#20252b'
  setCanvasFont(context, 38, 750)
  context.fillText('L-TWOO Rider', 198, 800)
  context.fillStyle = '#7a8189'
  setCanvasFont(context, 26, 550)
  context.fillText('傍晚骑行 · 记录于 18:42', 198, 848)
  context.strokeStyle = '#eceef0'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(64, 898)
  context.lineTo(width - 64, 898)
  context.stroke()

  const overview = [
    ['里程', '6.65', 'km'],
    ['平均速度', '7.14', 'km/h'],
    ['爬升', '21', 'm'],
    ['骑行时长', '00:55:54', ''],
    ['消耗', '286', 'kcal'],
    ['最高速度', '28.6', 'km/h'],
  ]
  const cellWidth = width / 2
  const overviewTop = 920
  const cellHeight = 170
  overview.forEach(([label, value, unit], index) => {
    const column = index % 2
    const row = Math.floor(index / 2)
    const x = column * cellWidth + 68
    const y = overviewTop + row * cellHeight
    context.fillStyle = '#8b9299'
    setCanvasFont(context, 26, 550)
    context.fillText(label, x, y + 38)
    context.fillStyle = '#313942'
    setCanvasFont(context, value === '00:55:54' ? 55 : 68, 800)
    context.fillText(`${value}${unit ? ` ${unit}` : ''}`, x, y + 116)
    context.strokeStyle = '#eceef0'
    context.beginPath()
    context.moveTo(column * cellWidth + 64, y + cellHeight - 10)
    context.lineTo((column + 1) * cellWidth - 64, y + cellHeight - 10)
    context.stroke()
  })

  drawLongSectionTitle(context, '速度与海拔', 1515)
  context.fillStyle = '#313942'
  setCanvasFont(context, 64, 800)
  context.fillText('612', 70, 1645)
  context.fillText('28.6', 570, 1645)
  context.fillStyle = '#8b9299'
  setCanvasFont(context, 25, 550)
  context.fillText('最高海拔 (m)', 70, 1690)
  context.fillText('最高速度 (km/h)', 570, 1690)
  context.drawImage(chart, 60, 1740, width - 120, 410)
  context.fillStyle = '#ff7f00'
  context.fillRect(746, 2175, 40, 8)
  context.fillStyle = '#7a8189'
  setCanvasFont(context, 22, 600)
  context.fillText('海拔', 798, 2185)
  context.fillStyle = '#2f80ed'
  context.fillRect(902, 2175, 40, 8)
  context.fillStyle = '#7a8189'
  context.fillText('速度', 954, 2185)

  context.strokeStyle = '#eceef0'
  context.beginPath()
  context.moveTo(64, 2230)
  context.lineTo(width - 64, 2230)
  context.stroke()
  drawLongSectionTitle(context, '爬坡分析', 2300)
  drawLongProgressRing(context, 210, 2540, '#ff6b4a', 0.186, '1.24km', '上坡', '18.6%')
  drawLongProgressRing(context, 540, 2540, '#179bd7', 0.617, '4.10km', '平路', '61.7%')
  drawLongProgressRing(context, 870, 2540, '#5cad28', 0.197, '1.31km', '下坡', '19.7%')

  context.fillStyle = '#ff7f00'
  context.fillRect(0, 2820, width, height - 2820)
  context.textAlign = 'center'
  context.fillStyle = '#ffffff'
  context.font = 'italic 900 78px "Segoe UI", Arial, sans-serif'
  context.fillText('L-TWOO', width / 2, 2918)
  context.fillStyle = 'rgba(255, 255, 255, 0.78)'
  setCanvasFont(context, 24, 600)
  context.fillText('Keep riding. Keep exploring.', width / 2, 2970)
}

const downloadPoster = async () => {
  const width = selectedLayout.value === 'long' ? 1080 : 1023
  const height = selectedLayout.value === 'long' ? 3000 : 1537
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  if (selectedLayout.value === 'long') {
    await drawDataLongPoster(context, width, height)
  }
  else {
    const background = await loadImage(posterBackgroundUrl.value)
    drawImageCover(context, background, width, height)

    if (selectedTemplateId.value === 'custom') {
      context.textAlign = 'right'
      context.fillStyle = '#ffffff'
      context.font = 'italic 900 82px "Segoe UI", Arial, sans-serif'
      context.fillText('L-TWOO', width * 0.94, height * 0.08)
    }

    drawPosterData(context, width, height)
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) {
    return
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = selectedLayout.value === 'long'
    ? 'L-TWOO-ride-data-report.png'
    : 'L-TWOO-ride-poster.png'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const handleShareAction = async (target: ShareTarget) => {
  if (isSaving.value) {
    return
  }

  if (target === 'save') {
    isSaving.value = true
    try {
      await downloadPoster()
    }
    finally {
      isSaving.value = false
    }
  }

  emit('generate', getShareOptions(target))
}

watch(() => props.visible, (visible) => {
  if (!visible) {
    previewVisible.value = false
  }
})

watch(selectedLayout, (layout) => {
  if (layout === 'long') {
    selectedTemplateId.value = 'velocity'
  }
})

onBeforeUnmount(releaseBackgroundPreview)
</script>

<template>
  <teleport to="body">
    <div v-if="visible">
      <div v-if="previewVisible" class="share-preview fixed inset-0 z-70 flex flex-col bg-black text-white">
        <header class="mx-auto h-18 w-full max-w-110 flex shrink-0 items-end justify-between px-5 pb-3">
          <button
            class="share-preview-command"
            type="button"
            aria-label="返回海报编辑"
            title="返回"
            @click="previewVisible = false"
          >
            <ArrowLeft :size="26" :stroke-width="2.2" />
          </button>
          <button
            class="min-h-10 inline-flex items-center gap-1.5 px-1 text-[14px] font-600 text-white/88"
            type="button"
            @click="handleReset"
          >
            <RotateCcw :size="22" :stroke-width="2" />
            重置
          </button>
        </header>

        <div class="min-h-0 flex flex-1 flex-col overflow-y-auto px-4 pb-4">
          <DataLongPoster
            v-if="selectedLayout === 'long'"
            class="share-data-long-poster mx-auto shrink-0"
          />
          <article
            v-else
            class="share-poster relative mx-auto shrink-0 overflow-hidden rounded-lg bg-[#151515]"
            :class="selectedTemplate.themeClass"
          >
            <img :src="posterBackgroundUrl" alt="L-TWOO 骑行分享海报" class="poster-background" />
            <span
              v-if="selectedTemplateId === 'custom'"
              class="poster-logo"
            >L-TWOO</span>
            <span class="poster-shade" />
            <span class="poster-metrics" aria-label="骑行数据">
              <span
                v-for="metric in posterMetrics"
                :key="metric.key"
                class="poster-metric"
                :class="`poster-metric-${metric.key}`"
              >
                <small>{{ metric.label }}</small>
                <strong>{{ metric.value }}<em v-if="metric.unit"> {{ metric.unit }}</em></strong>
              </span>
            </span>
          </article>

          <div v-if="selectedLayout === 'standard'" class="mx-auto mt-4 flex shrink-0 items-center justify-center gap-3">
            <button
              v-for="template in posterTemplates"
              :key="template.key"
              class="preview-thumbnail relative h-16 w-12 overflow-hidden rounded-lg border-2 bg-[#171717]"
              :class="selectedSystemTemplateId === template.key ? 'border-white' : 'border-transparent'"
              type="button"
              :aria-label="`切换为${template.name}`"
              :aria-pressed="selectedSystemTemplateId === template.key"
              @click="selectedTemplateId = template.key"
            >
              <img :src="systemPosterBackground" alt="" class="h-full w-full object-cover" />
              <span class="absolute inset-0 bg-black/8" />
            </button>
          </div>

          <div class="mx-auto mt-4 w-full max-w-110 shrink-0 border-t border-white/12 pt-4">
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="action in shareActions"
                :key="action.key"
                class="min-w-0 flex flex-col items-center gap-2 text-[12px] text-white/72 disabled:opacity-50"
                type="button"
                :disabled="isSaving"
                @click="handleShareAction(action.key)"
              >
                <span class="share-action-icon" :class="action.tone">
                  <component :is="action.icon" :size="22" :stroke-width="2.1" />
                </span>
                <span>{{ action.key === 'save' && isSaving ? '保存中' : action.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="fixed inset-0 z-60 bg-black/24" @click="handleClose">
        <div class="absolute inset-x-0 bottom-0 px-4 pb-4 pt-6" @click.stop>
          <div class="app-dialog-surface mx-auto max-h-[calc(100dvh-16px)] max-w-90 overflow-y-auto rounded-2xl border border-line bg-white p-4 shadow-phone">
            <div class="mb-3 flex justify-center">
              <div class="h-1.5 w-14 rounded-full bg-#d8dde2" />
            </div>

            <div class="px-1">
              <h3 class="text-[20px] font-700 text-ink">分享骑行记录</h3>
              <p class="mt-1 text-[12px] leading-[1.5] text-muted">选择海报排版，生成可保存和分享的骑行图片。</p>
            </div>

            <section class="mt-4">
              <p class="mb-2 text-[12px] font-700 text-ink">图片版式</p>
              <div class="grid grid-cols-2 rounded-lg bg-soft p-1">
                <button
                  v-for="option in layoutOptions"
                  :key="option.key"
                  class="min-h-10 rounded-lg px-3 text-[13px] font-700 transition"
                  :class="selectedLayout === option.key
                    ? 'bg-brand-500 text-white'
                    : 'text-muted hover:text-ink'"
                  type="button"
                  @click="selectedLayout = option.key"
                >
                  {{ option.label }}
                </button>
              </div>
            </section>

            <section class="mt-4 border-t border-line pt-4">
              <div class="mb-2 flex items-center justify-between gap-3">
                <p class="text-[12px] font-700 text-ink">{{ selectedLayout === 'long' ? '长图预览' : '海报预选' }}</p>
                <p class="text-[10px] text-muted">当前：{{ selectedTemplateName }}</p>
              </div>

              <button
                v-if="selectedLayout === 'long'"
                class="data-long-choice w-full flex cursor-pointer items-center gap-4 rounded-lg border-2 border-brand-500 bg-brand-50 p-3 text-left"
                type="button"
                aria-label="选择综合骑行报告"
                aria-pressed="true"
              >
                <span class="data-long-choice-shell shrink-0 overflow-hidden bg-white shadow-card">
                  <DataLongPoster class="data-long-choice-poster" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="inline-flex items-center gap-1.5 text-[13px] font-700 text-ink">
                    <span class="h-4 w-4 flex items-center justify-center rounded-full bg-brand-500 text-white">
                      <Check :size="10" :stroke-width="3" />
                    </span>
                    综合骑行报告
                  </span>
                  <span class="mt-2 block text-[10px] leading-[1.6] text-muted">路线地图、骑行概览、速度与海拔、爬坡分析</span>
                  <span class="mt-3 block text-[10px] font-700 text-brand-600">纵向数据长图</span>
                </span>
              </button>

              <div v-else class="grid grid-cols-3 gap-2">
                <button
                  v-for="template in posterTemplates"
                  :key="template.key"
                  class="min-w-0 cursor-pointer text-left outline-none"
                  type="button"
                  :aria-label="`选择${template.name}海报`"
                  :aria-pressed="selectedTemplateId === template.key"
                  @click="selectedTemplateId = template.key"
                >
                  <span
                    class="poster-card relative block overflow-hidden rounded-[6px] border-2 bg-[#151515] transition"
                    :class="[
                      selectedTemplateId === template.key ? 'border-brand-500 shadow-card' : 'border-line',
                      template.themeClass,
                    ]"
                  >
                    <img :src="systemPosterBackground" alt="" class="poster-background" />
                    <span class="poster-shade" />
                    <span
                      v-if="selectedTemplateId === template.key"
                      class="absolute left-1.5 top-1.5 z-3 h-4 w-4 flex items-center justify-center rounded-full bg-brand-500 text-white"
                    >
                      <Check :size="10" :stroke-width="3" />
                    </span>
                    <span class="poster-metrics">
                      <span
                        v-for="metric in posterMetrics"
                        :key="metric.key"
                        class="poster-metric"
                        :class="`poster-metric-${metric.key}`"
                      >
                        <small>{{ metric.label }}</small>
                        <strong>{{ metric.value }}<em v-if="metric.unit"> {{ metric.unit }}</em></strong>
                      </span>
                    </span>
                  </span>
                  <span class="mt-1.5 block truncate text-[11px] font-700 text-ink">{{ template.name }}</span>
                  <span class="mt-0.5 block truncate text-[9px] text-muted">{{ template.description }}</span>
                </button>
              </div>
            </section>

            <section v-if="selectedLayout === 'standard'" class="mt-4 border-t border-line pt-4">
              <div class="mb-2">
                <p class="text-[12px] font-700 text-ink">自定义背景图</p>
                <p class="mt-1 text-[10px] text-muted">支持从相册选择 JPG、PNG、WebP 图片</p>
              </div>

              <div
                v-if="backgroundFile"
                class="flex items-center gap-3 rounded-lg border p-2.5 transition"
                :class="selectedTemplateId === 'custom' ? 'border-brand-500 bg-brand-50' : 'border-line bg-soft'"
              >
                <button
                  class="relative h-16 w-12 shrink-0 overflow-hidden rounded-[6px] bg-ink"
                  type="button"
                  aria-label="选择自定义背景图"
                  @click="selectedTemplateId = 'custom'"
                >
                  <img :src="backgroundPreviewUrl" :alt="backgroundFile.name" class="h-full w-full object-cover" />
                  <span v-if="selectedTemplateId === 'custom'" class="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
                    <Check :size="18" :stroke-width="3" />
                  </span>
                </button>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[12px] font-700 text-ink">{{ backgroundFile.name }}</p>
                  <div class="mt-2 flex items-center gap-3">
                    <button class="text-[11px] font-700 text-brand-500" type="button" @click="selectedTemplateId = 'custom'">使用此背景</button>
                    <label class="inline-flex cursor-pointer items-center gap-1 text-[11px] font-700 text-muted">
                      <Upload :size="12" :stroke-width="2.1" />
                      更换
                      <input class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" @change="handleBackgroundUpload" />
                    </label>
                  </div>
                </div>
                <button
                  class="app-icon-button h-10 w-10 shrink-0 bg-white text-muted hover:text-danger"
                  type="button"
                  aria-label="删除自定义背景图"
                  title="删除自定义背景图"
                  @click="handleRemoveBackground"
                >
                  <Trash2 :size="16" :stroke-width="2.1" />
                </button>
              </div>

              <label
                v-else
                class="min-h-18 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-brand-300 bg-brand-50 px-4 text-center transition hover:bg-brand-100"
              >
                <Upload :size="18" :stroke-width="2.1" class="text-brand-500" />
                <span class="text-[12px] font-700 text-brand-500">从相册选择背景图</span>
                <input class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" @change="handleBackgroundUpload" />
              </label>
            </section>

            <button
              class="app-primary-button mt-4 min-h-12 w-full inline-flex items-center justify-center gap-2 text-[14px]"
              type="button"
              @click="handleGenerate"
            >
              <ImagePlus :size="18" :stroke-width="2.1" />
              {{ selectedLayout === 'long' ? '生成数据长图' : '生成分享图片' }}
            </button>

            <button
              class="mt-3 min-h-11 w-full rounded-lg border border-line bg-white text-[14px] font-700 text-ink transition hover:bg-soft"
              type="button"
              @click="handleClose"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.poster-card,
.share-poster {
  aspect-ratio: 2 / 3;
}

.poster-background,
.poster-shade,
.poster-metrics {
  position: absolute;
  inset: 0;
}

.poster-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-logo {
  position: absolute;
  z-index: 2;
  top: 4.5%;
  right: 5.5%;
  color: #ffffff;
  font-size: 22px;
  font-style: italic;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
  transform: skewX(-9deg);
}

.poster-shade {
  z-index: 1;
  pointer-events: none;
}

.poster-metrics {
  z-index: 2;
  display: flex;
  color: #ffffff;
  pointer-events: none;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.48);
}

.poster-metric small,
.poster-metric strong {
  display: block;
  letter-spacing: 0;
}

.poster-metric small {
  color: rgba(255, 255, 255, 0.86);
  font-weight: 500;
}

.poster-metric strong {
  font-variant-numeric: tabular-nums;
  line-height: 1.05;
}

.poster-metric em {
  font-style: normal;
  font-weight: 700;
}

.poster-layout-centered .poster-shade {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.27) 0%, rgba(0, 0, 0, 0) 58%);
}

.poster-layout-centered .poster-metrics {
  top: 15%;
  bottom: auto;
  left: 50%;
  width: 86%;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  transform: translateX(-50%);
}

.poster-layout-bottom .poster-shade {
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.8) 100%);
}

.poster-layout-bottom .poster-metrics {
  top: auto;
  right: 5%;
  bottom: 4.5%;
  left: 5%;
  display: grid;
  grid-template-columns: 0.9fr 1.25fr 0.8fr;
  gap: 4px;
  align-items: end;
  text-align: center;
}

.poster-layout-side .poster-shade {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.53) 0%, rgba(0, 0, 0, 0) 72%);
}

.poster-layout-side .poster-metrics {
  top: 22%;
  right: auto;
  bottom: auto;
  left: 8%;
  flex-direction: column;
  gap: 18px;
  text-align: left;
}

.poster-card .poster-metrics {
  gap: 4px;
}

.poster-card .poster-metric small {
  font-size: 4px;
}

.poster-card .poster-metric strong {
  margin-top: 1px;
  font-size: 8px;
  font-weight: 800;
}

.poster-card .poster-metric em {
  font-size: 4px;
}

.poster-card.poster-layout-centered .poster-metrics {
  top: 16%;
}

.poster-card.poster-layout-bottom .poster-metrics {
  gap: 1px;
}

.poster-card.poster-layout-bottom .poster-metric strong {
  font-size: 6px;
}

.poster-card.poster-layout-bottom .poster-metric-duration strong {
  font-size: 5px;
}

.poster-card.poster-layout-side .poster-metrics {
  gap: 6px;
}

.share-preview-command {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.92);
}

.share-poster {
  width: min(72vw, 286px);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.42);
}


.share-data-long-poster {
  width: min(82vw, 320px);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.42);
}

.data-long-choice-shell {
  position: relative;
  width: 96px;
  height: 284px;
}

.data-long-choice-poster {
  position: absolute;
  top: 0;
  left: 6px;
  width: 320px !important;
  transform: scale(0.26);
  transform-origin: top left;
  pointer-events: none;
}

.share-poster .poster-metric small {
  font-size: 11px;
}

.share-poster .poster-metric strong {
  margin-top: 3px;
  font-size: 28px;
  font-weight: 800;
}

.share-poster .poster-metric em {
  font-size: 14px;
}

.share-poster.poster-layout-centered .poster-metric-duration strong,
.share-poster.poster-layout-side .poster-metric-duration strong {
  font-size: 25px;
}

.share-poster.poster-layout-bottom .poster-metric small {
  font-size: 8px;
}

.share-poster.poster-layout-bottom .poster-metric strong {
  font-size: 16px;
}

.share-poster.poster-layout-bottom .poster-metric-duration strong {
  font-size: 13px;
}

.share-poster.poster-layout-bottom .poster-metric em {
  font-size: 9px;
}

.preview-thumbnail {
  transition: border-color 160ms ease, transform 160ms ease;
}

.preview-thumbnail[aria-pressed='true'] {
  transform: translateY(-2px);
}

.share-action-icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  background: #1b1b1b;
  color: rgba(255, 255, 255, 0.9);
}

.share-action-wechat {
  color: #35c85a;
}

.share-action-moments {
  color: #72a7ff;
}

@media (max-height: 720px) {
  .share-poster {
    width: min(61vw, 238px);
  }

  .share-data-long-poster {
    width: min(78vw, 300px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-thumbnail {
    transition: none;
  }
}
</style>
