<script setup lang="ts">
import { ChartColumnBig, Cpu, House, Map, UserRound } from 'lucide-vue-next'

defineProps<{
  items: Array<{ key: string; label: string; icon: string }>
  activeKey: string
}>()

const emit = defineEmits<{
  select: [key: string]
}>()

const iconMap = {
  home: House,
  data: ChartColumnBig,
  route: Map,
  device: Cpu,
  profile: UserRound,
}

const solidIconPathMap = {
  home: 'M6 21q-.825 0-1.412-.587Q4 19.825 4 19v-9.15L10.7 4q.275-.25.625-.375T12 3.5q.35 0 .675.125T13.3 4L20 9.85V19q0 .825-.587 1.413Q18.825 21 18 21h-4v-7h-4v7z',
  data: 'M5 21q-.825 0-1.412-.587Q3 19.825 3 19v-6q0-.825.588-1.412Q4.175 11 5 11t1.413.588Q7 12.175 7 13v6q0 .825-.587 1.413Q5.825 21 5 21m7 0q-.825 0-1.412-.587Q10 19.825 10 19V5q0-.825.588-1.412Q11.175 3 12 3t1.413.588Q14 4.175 14 5v14q0 .825-.587 1.413Q12.825 21 12 21m7 0q-.825 0-1.412-.587Q17 19.825 17 19v-9q0-.825.588-1.412Q18.175 8 19 8t1.413.588Q21 9.175 21 10v9q0 .825-.587 1.413Q19.825 21 19 21',
  route: 'M15 21l-6-2.1-4.65 1.8q-.5.2-.925-.112Q3 20.275 3 19.75V5.5q0-.325.188-.575t.487-.375L9 2.75l6 2.1 4.65-1.8q.5-.2.925.113Q21 3.475 21 4v14.25q0 .325-.187.575t-.488.375zM14 18.55V6.6l-4-1.4v11.95zm2 0 3-1V5.4l-3 1.2zM5 18.35l3-1.2V5.2L5 6.2z',
  device: 'M7 21v-2H5q-.825 0-1.412-.587Q3 17.825 3 17v-2H1v-2h2v-2H1V9h2V7q0-.825.588-1.412Q4.175 5 5 5h2V3h2v2h2V3h2v2h2V3h2v2h2q.825 0 1.413.588Q21 6.175 21 7v2h2v2h-2v2h2v2h-2v2q0 .825-.587 1.413Q19.825 19 19 19h-2v2h-2v-2h-2v2h-2v-2H9v2zm-2-4h14V7H5zm3-2h8V9H8z',
  profile: 'M12 12q-1.65 0-2.825-1.175Q8 9.65 8 8t1.175-2.825Q10.35 4 12 4t2.825 1.175Q16 6.35 16 8t-1.175 2.825Q13.65 12 12 12m-8 8v-2.8q0-.85.438-1.562Q4.875 14.925 5.6 14.5q1.55-.9 3.15-1.35T12 12.7q1.65 0 3.25.45t3.15 1.35q.725.425 1.163 1.138Q20 16.35 20 17.2V20z',
}
</script>

<template>
  <nav class="glass-tab-bar z-30 mt-auto w-full shrink-0 px-2 pt-1">
    <div class="flex items-center justify-around gap-1">
      <button
        v-for="item in items"
        :key="item.key"
        class="tab-button relative min-h-14 min-w-13 flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-1 transition-all duration-200"
        :class="activeKey === item.key ? 'is-active' : ''"
        type="button"
        :aria-current="activeKey === item.key ? 'page' : undefined"
        @click="emit('select', item.key)"
      >
        <svg
          v-if="activeKey === item.key"
          class="tab-icon tab-icon-active size-5 shrink-0 text-brand-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path :d="solidIconPathMap[item.icon as keyof typeof solidIconPathMap]" />
        </svg>
        <component
          v-else
          :is="iconMap[item.icon as keyof typeof iconMap]"
          :size="20"
          fill="none"
          :stroke-width="2.1"
          class="tab-icon size-5 shrink-0 text-[#858A90]"
        />
        <span
          class="tab-label text-[10px]"
          :class="activeKey === item.key ? 'font-700 text-brand-500' : 'font-500 text-[#767C82]'"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.glass-tab-bar {
  position: sticky;
  bottom: 0;
  isolation: isolate;
  padding-bottom: calc(8px + var(--app-safe-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.86);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.72) 0%,
    rgba(255, 255, 255, 0.9) 55%,
    rgba(255, 255, 255, 0.94) 100%
  );
  box-shadow:
    0 -12px 30px rgba(29, 29, 31, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}

.glass-tab-bar::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.98) 18%,
    rgba(255, 255, 255, 0.98) 82%,
    transparent
  );
  content: '';
  pointer-events: none;
}

.tab-button {
  z-index: 1;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.48);
}

.tab-button.is-active {
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 4px 14px rgba(255, 127, 0, 0.08);
}

.tab-icon {
  transform-origin: center bottom;
}

.tab-button.is-active .tab-icon-active {
  animation: tab-icon-activate 260ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}

.tab-button.is-active .tab-label {
  animation: tab-label-activate 220ms ease-out both;
}

@keyframes tab-icon-activate {
  0% {
    opacity: 0.55;
    transform: translateY(1px) scale(0.88);
  }

  58% {
    opacity: 1;
    transform: translateY(-2px) scale(1.12);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes tab-label-activate {
  from {
    opacity: 0.55;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tab-button,
  .tab-button.is-active .tab-icon-active,
  .tab-button.is-active .tab-label {
    animation: none;
    transition-duration: 0.01ms;
  }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-tab-bar {
    background: rgba(255, 255, 255, 0.96);
  }
}
</style>
