<script setup>
import { computed } from 'vue'

const props = defineProps({ value: String })

const BG = {
  W: '#f8f6d8',
  U: '#c1d7e9',
  B: '#bab1ab',
  R: '#e49977',
  G: '#a3c095',
}
const INK = '#150b00'

const bg = computed(() => BG[props.value] ?? '#cac5c0')

const sunRays = Array.from({ length: 16 }, (_, i) => {
  const a = (i * Math.PI) / 8
  const long = i % 2 === 0
  const [r1, r2, w] = long ? [5.5, 12.5, 1.8] : [5.5, 9.5, 1.3]
  const [c, s] = [Math.cos(a), Math.sin(a)]
  const p = (x, y) => `${(16 + x).toFixed(2)},${(16 + y).toFixed(2)}`
  return [p(r1 * c - w * s, r1 * s + w * c), p(r2 * c, r2 * s), p(r1 * c + w * s, r1 * s - w * c)].join(' ')
})
</script>

<template>
  <svg class="mana-symbol" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="18" r="15" fill="#000" />
    <g transform="translate(1.5 0.5)">
      <circle cx="16" cy="16" r="15" :fill="bg" />

      <g v-if="value === 'W'" :fill="INK">
        <circle cx="16" cy="16" r="4.5" />
        <polygon v-for="(pts, i) in sunRays" :key="i" :points="pts" />
      </g>

      <g v-else-if="value === 'U'">
        <path :fill="INK" d="M16 4.5 C16 4.5 8 14.5 8 19.5 A8 8 0 0 0 24 19.5 C24 14.5 16 4.5 16 4.5 Z" />
        <path :stroke="bg" fill="none" stroke-width="1.6" stroke-linecap="round" d="M11.5 19.5 A4.5 4.5 0 0 0 15 24" />
      </g>

      <g v-else-if="value === 'B'">
        <ellipse cx="16" cy="13.5" rx="8.5" ry="8" :fill="INK" />
        <rect x="11" y="17" width="10" height="8" rx="1.5" :fill="INK" />
        <circle cx="12.6" cy="14" r="2.4" :fill="bg" />
        <circle cx="19.4" cy="14" r="2.4" :fill="bg" />
        <path d="M16 16.8 L14.8 19.2 H17.2 Z" :fill="bg" />
        <path d="M13.5 21.5 V25 M16 21.5 V25 M18.5 21.5 V25" :stroke="bg" stroke-width="0.9" />
      </g>

      <path
        v-else-if="value === 'R'"
        :fill="INK"
        d="M17.5 4.5 C18.5 9.5 24.5 12 24.5 19 A8.5 8.5 0 0 1 7.5 19 C7.5 14.5 10.5 12.5 11.5 8.5 C13.5 10.5 13.8 12.5 14.5 14 C16 11 16.5 8 17.5 4.5 Z M16 26 A4 4 0 0 0 20 22 C20 19.5 18 18 17.5 16 C16.5 18.5 14 19.5 12.5 19 C12 23 13.5 26 16 26 Z"
        fill-rule="evenodd"
      />

      <g v-else-if="value === 'G'" :fill="INK">
        <circle cx="16" cy="9.5" r="5" />
        <circle cx="10.5" cy="13.5" r="4.5" />
        <circle cx="21.5" cy="13.5" r="4.5" />
        <circle cx="16" cy="15" r="5" />
        <path d="M14.6 17 L13.6 23.5 L10.5 26 H21.5 L18.4 23.5 L17.4 17 Z" />
      </g>

      <circle v-else-if="value === 'C'" cx="16" cy="16" r="7" fill="none" :stroke="INK" stroke-width="2.6" />

      <text
        v-else
        x="16"
        y="16"
        text-anchor="middle"
        dominant-baseline="central"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="bold"
        :font-size="value.length > 1 ? 15 : 20"
        :fill="INK"
      >{{ value }}</text>
    </g>
  </svg>
</template>

<style scoped>
.mana-symbol {
  width: 21px;
  height: 21px;
  display: block;
}
</style>
