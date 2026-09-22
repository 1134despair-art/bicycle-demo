<script setup lang="ts">
const mediaBaseUrl = `${import.meta.env.BASE_URL}media/app/`

const overviewMetrics = [
  { label: '里程', value: '6.65', unit: 'km' },
  { label: '平均速度', value: '7.14', unit: 'km/h' },
  { label: '爬升', value: '21', unit: 'm' },
  { label: '骑行时长', value: '00:55:54', unit: '' },
  { label: '消耗', value: '286', unit: 'kcal' },
  { label: '最高速度', value: '28.6', unit: 'km/h' },
]

const climbingSegments = [
  { label: '上坡', distance: '1.24km', ratio: '18.6%', color: '#ff6b4a', progress: '18.6%' },
  { label: '平路', distance: '4.10km', ratio: '61.7%', color: '#179bd7', progress: '61.7%' },
  { label: '下坡', distance: '1.31km', ratio: '19.7%', color: '#5cad28', progress: '19.7%' },
]
</script>

<template>
  <article class="data-long-poster" aria-label="L-TWOO 骑行数据长图">
    <section class="long-map-section">
      <img :src="`${mediaBaseUrl}route-map.png`" alt="本次骑行路线" />
      <div class="long-map-wash" />
      <div class="long-map-heading">
        <span>2026.08.03</span>
        <strong>成都 · 骑行</strong>
      </div>
      <div class="long-map-distance">
        <small>本次骑行</small>
        <strong>6.65 <em>km</em></strong>
      </div>
    </section>

    <section class="long-rider-strip">
      <img :src="`${mediaBaseUrl}avatar-demo.png`" alt="骑行者头像" class="long-avatar" />
      <div class="long-rider-copy">
        <strong>L-TWOO Rider</strong>
        <span>傍晚骑行 · 记录于 18:42</span>
      </div>
      <span class="long-logo-chip">
        <strong class="long-logo-wordmark">L-TWOO</strong>
      </span>
    </section>

    <section class="long-overview-grid" aria-label="骑行概览">
      <div v-for="metric in overviewMetrics" :key="metric.label" class="long-overview-item">
        <small>{{ metric.label }}</small>
        <strong>{{ metric.value }}<em v-if="metric.unit"> {{ metric.unit }}</em></strong>
      </div>
    </section>

    <section class="long-report-section">
      <header class="long-section-heading">
        <span />
        <strong>速度与海拔</strong>
      </header>
      <div class="long-chart-summary">
        <div><strong>612</strong><span>最高海拔 (m)</span></div>
        <div><strong>28.6</strong><span>最高速度 (km/h)</span></div>
      </div>
      <div class="long-chart-wrap">
        <img :src="`${mediaBaseUrl}ride-chart.png`" alt="速度与海拔变化曲线" />
      </div>
      <div class="long-chart-legend">
        <span><i class="legend-elevation" />海拔</span>
        <span><i class="legend-speed" />速度</span>
      </div>
    </section>

    <section class="long-report-section long-climbing-section">
      <header class="long-section-heading">
        <span />
        <strong>爬坡分析</strong>
      </header>
      <div class="long-climbing-grid">
        <div v-for="segment in climbingSegments" :key="segment.label" class="long-climbing-item">
          <div
            class="long-progress-ring"
            :style="{
              '--ring-color': segment.color,
              '--ring-progress': segment.progress,
            }"
          >
            <strong>{{ segment.distance }}</strong>
          </div>
          <span :style="{ color: segment.color }">{{ segment.label }}</span>
          <small>{{ segment.ratio }}</small>
        </div>
      </div>
    </section>

    <footer class="long-poster-footer">
      <strong class="long-logo-wordmark">L-TWOO</strong>
      <span>Keep riding. Keep exploring.</span>
    </footer>
  </article>
</template>

<style scoped>
.data-long-poster {
  width: 100%;
  overflow: hidden;
  background: #ffffff;
  color: #20252b;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
  letter-spacing: 0;
}

.long-map-section {
  position: relative;
  height: 260px;
  overflow: hidden;
  background: #edf4f1;
}

.long-map-section > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.long-map-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent 38%, rgba(24, 34, 42, 0.12));
}

.long-map-heading {
  position: absolute;
  top: 18px;
  left: 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #34414c;
}

.long-map-heading span {
  font-size: 9px;
  font-weight: 600;
}

.long-map-heading strong {
  font-size: 15px;
}

.long-map-distance {
  position: absolute;
  right: 16px;
  bottom: 15px;
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 8px 18px rgba(28, 49, 58, 0.1);
  backdrop-filter: blur(8px);
}

.long-map-distance small,
.long-map-distance strong {
  display: block;
}

.long-map-distance small {
  color: #77818a;
  font-size: 8px;
}

.long-map-distance strong {
  margin-top: 1px;
  color: #ff7f00;
  font-size: 23px;
  font-variant-numeric: tabular-nums;
}

.long-map-distance em {
  font-size: 11px;
  font-style: normal;
}

.long-rider-strip {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #eceef0;
}

.long-avatar {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border-radius: 50%;
  object-fit: cover;
}

.long-rider-copy {
  min-width: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}

.long-rider-copy strong {
  font-size: 13px;
}

.long-rider-copy span {
  color: #7a8189;
  font-size: 9px;
}

.long-logo-chip {
  width: 66px;
  height: 27px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 5px;
  background: #ff7f00;
}

.long-logo-wordmark {
  display: inline-block;
  color: #ffffff;
  font-size: 16px;
  font-style: italic;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
  transform: skewX(-9deg);
}

.long-overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 12px 16px 18px;
}

.long-overview-item {
  min-width: 0;
  padding: 12px 6px 11px;
  border-bottom: 1px solid #eceef0;
}

.long-overview-item:nth-child(odd) {
  border-right: 1px solid #eceef0;
}

.long-overview-item:nth-child(even) {
  padding-left: 17px;
}

.long-overview-item small,
.long-overview-item strong {
  display: block;
}

.long-overview-item small {
  color: #8b9299;
  font-size: 9px;
}

.long-overview-item strong {
  margin-top: 4px;
  color: #313942;
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.long-overview-item em {
  color: #818890;
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
}

.long-report-section {
  padding: 16px 16px 18px;
}

.long-section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.long-section-heading > span {
  width: 4px;
  height: 22px;
  background: #ff7f00;
}

.long-section-heading strong {
  font-size: 18px;
}

.long-chart-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.long-chart-summary > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.long-chart-summary strong {
  color: #313942;
  font-size: 26px;
  line-height: 1;
}

.long-chart-summary span {
  color: #8b9299;
  font-size: 9px;
}

.long-chart-wrap {
  height: 150px;
  margin-top: 8px;
  overflow: hidden;
}

.long-chart-wrap img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.long-chart-legend {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 4px;
  color: #7a8189;
  font-size: 8px;
}

.long-chart-legend span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.long-chart-legend i {
  width: 14px;
  height: 3px;
  display: inline-block;
}

.legend-elevation {
  background: #ff7f00;
}

.legend-speed {
  background: #2f80ed;
}

.long-climbing-section {
  border-top: 1px solid #eceef0;
}

.long-climbing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 18px;
  text-align: center;
}

.long-climbing-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.long-progress-ring {
  --ring-color: #ff7f00;
  --ring-progress: 50%;
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: conic-gradient(var(--ring-color) var(--ring-progress), #edf0f2 0);
}

.long-progress-ring::before {
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  background: #ffffff;
  content: '';
}

.long-progress-ring strong {
  position: relative;
  z-index: 1;
  color: #3d454d;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.long-climbing-item > span {
  margin-top: 7px;
  font-size: 10px;
  font-weight: 700;
}

.long-climbing-item > small {
  margin-top: 2px;
  color: #8b9299;
  font-size: 9px;
}

.long-poster-footer {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  background: #ff7f00;
  color: rgba(255, 255, 255, 0.76);
  font-size: 8px;
}

.long-poster-footer .long-logo-wordmark {
  font-size: 30px;
}
</style>
