<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  name: string
  description: string
  canSubmit: boolean
  disabled?: boolean
  autofocus?: boolean
  compact?: boolean
  nameOnly?: boolean
  blurRequestKey?: number
  selectNameOnEntry?: boolean
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:description': [value: string]
  'focus-change': [field: 'name' | 'description' | null]
  submit: []
}>()

const activeField = ref<'name' | 'description' | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const nameInputRef = ref<HTMLInputElement | null>(null)
const shouldSelectNameOnNextFocus = ref(Boolean(props.selectNameOnEntry))

watch(() => props.selectNameOnEntry, (value) => {
  if (value) {
    shouldSelectNameOnNextFocus.value = true
  }
})

watch(() => props.blurRequestKey, () => {
  const rootElement = sectionRef.value
  const activeElement = document.activeElement

  if (
    !rootElement
    || !activeElement
    || !(activeElement instanceof HTMLElement)
    || !rootElement.contains(activeElement)
  ) {
    activeField.value = null
    emit('focus-change', null)
    return
  }

  activeElement.blur()
  activeField.value = null
  emit('focus-change', null)
})

const handleFieldFocus = (field: 'name' | 'description') => {
  activeField.value = field
  emit('focus-change', field)

  if (field === 'name' && shouldSelectNameOnNextFocus.value) {
    shouldSelectNameOnNextFocus.value = false
    void nextTick(() => {
      nameInputRef.value?.select()
    })
  }
}

const handleFieldBlur = () => {
  activeField.value = null
  emit('focus-change', null)
}

onMounted(() => {
  if (!props.autofocus || props.disabled) {
    return
  }

  void nextTick(() => {
    nameInputRef.value?.focus()
    nameInputRef.value?.select()
  })
})
</script>

<template>
  <section
    ref="sectionRef"
    class="app-card transition-all duration-200"
    :class="compact ? 'px-4 py-3' : 'px-4 py-4'"
  >
    <div>
      <p class="text-[11px] uppercase tracking-[0.12em] text-muted">保存信息</p>
      <h3 class="mt-2 text-[17px] font-700 tracking-[-0.03em] text-ink">
        {{ nameOnly ? '确认路线名称' : '补充路线名称与说明' }}
      </h3>
      <p class="mt-2 text-[12px] leading-[1.7] text-muted">
        {{ nameOnly ? '路线信息已从文件中识别，请确认路线名称后保存。' : '聚焦输入时会自动收起上方摘要，方便连续编辑并保持按钮可见。' }}
      </p>
    </div>

    <div class="mt-4 space-y-4">
      <label class="block">
        <span class="flex items-center justify-between gap-3 text-[12px] font-700 text-muted">
          <span>路线名称</span>
          <span :class="activeField === 'name' ? 'text-brand-500' : 'text-muted/80'">{{ name.length }}/24</span>
        </span>
        <input
          ref="nameInputRef"
          :disabled="disabled"
          :value="name"
          class="mt-2 h-12 w-full rounded-lg border border-transparent px-4 text-[14px] text-ink outline-none transition-all placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
          :class="activeField === 'name' ? 'border-brand-500/30 bg-brand-50 shadow-[0_0_0_4px_rgba(255,127,0,0.08)]' : 'bg-#f5f6f8'"
          maxlength="24"
          placeholder="例如：锦城湖节奏训练"
          type="text"
          @blur="handleFieldBlur"
          @focus="handleFieldFocus('name')"
          @input="emit('update:name', ($event.target as HTMLInputElement).value)"
        >
      </label>

      <div v-if="nameOnly">
        <p class="text-[12px] font-700 text-muted">路线描述</p>
        <p class="mt-2 min-h-28 rounded-lg bg-#f5f6f8 px-4 py-3 text-[14px] leading-[1.7] text-ink">
          {{ description || '暂无路线描述' }}
        </p>
      </div>

      <label v-else class="block">
        <span class="flex items-center justify-between gap-3 text-[12px] font-700 text-muted">
          <span>路线描述</span>
          <span :class="activeField === 'description' ? 'text-brand-500' : 'text-muted/80'">{{ description.length }}/140</span>
        </span>
        <textarea
          :disabled="disabled"
          :value="description"
          class="mt-2 h-28 w-full resize-none rounded-lg border border-transparent px-4 py-3 text-[14px] leading-[1.7] text-ink outline-none transition-all placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
          :class="activeField === 'description' ? 'border-brand-500/30 bg-brand-50 shadow-[0_0_0_4px_rgba(255,127,0,0.08)]' : 'bg-#f5f6f8'"
          maxlength="140"
          placeholder="说明路线适用场景、补给点或节奏建议"
          @blur="handleFieldBlur"
          @focus="handleFieldFocus('description')"
          @input="emit('update:description', ($event.target as HTMLTextAreaElement).value)"
        />
      </label>

    </div>

    <button
      class="mt-5 min-h-12 w-full rounded-lg bg-brand-500 text-[14px] font-700 text-white shadow-[0_8px_20px_rgba(255,127,0,0.2)] transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-45"
      :disabled="disabled || !canSubmit"
      type="button"
      @click="emit('submit')"
    >
      保存到路线库
    </button>
  </section>
</template>
