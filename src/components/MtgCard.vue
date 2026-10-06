<script setup>
import { computed } from 'vue'
import ManaSymbol from './ManaSymbol.vue'
import { marbleDataUrl } from '../marble.js'

const props = defineProps({
  title: String,
  typeLine: String,
  description: String,
  manaCost: String,
  color: String,
  image: String,
  power: String,
  toughness: String,
})

const FRAMES = {
  white: { box: '#f8f6ee', accent: '#9c9580', base: [226, 223, 208], vein: [168, 158, 135] },
  blue: { box: '#e4f1f8', accent: '#2c6f93', base: [92, 176, 218], vein: [96, 62, 140] },
  black: { box: '#d9d4cf', accent: '#0d0c0c', base: [72, 68, 66], vein: [18, 16, 16] },
  red: { box: '#f8e2d8', accent: '#7a1f18', base: [214, 106, 82], vein: [122, 34, 26] },
  green: { box: '#e2efdf', accent: '#1d4d28', base: [86, 148, 84], vein: [28, 70, 36] },
  gold: { box: '#f7eed2', accent: '#7c5c1c', base: [214, 184, 96], vein: [140, 98, 38] },
  artifact: { box: '#ebe5dd', accent: '#463628', base: [134, 109, 90], vein: [71, 54, 45] },
  colorless: { box: '#ecebe8', accent: '#5c5853', base: [176, 170, 164], vein: [108, 102, 96] },
}

const frame = computed(() => FRAMES[props.color] ?? FRAMES.colorless)
const marble = computed(() => `url(${marbleDataUrl(frame.value, 347, 495)})`)

// Accepts "{2}{R}{R}" or "2RR"
const symbols = computed(() => {
  const tokens = []
  const re = /\{([^}]+)\}|(\d+|[WUBRGCX])/gi
  let m
  while ((m = re.exec(props.manaCost ?? ''))) {
    tokens.push((m[1] ?? m[2]).toUpperCase())
  }
  return tokens
})

const showPT = computed(() => props.power || props.toughness)
</script>

<template>
  <div
    class="card"
    :style="{ '--marble': marble, '--box': frame.box, '--accent': frame.accent }"
  >
    <div class="inner">
      <div class="bar title-bar">
        <span class="title">{{ title }}</span>
        <span class="mana">
          <ManaSymbol v-for="(s, i) in symbols" :key="i" :value="s" />
        </span>
      </div>

      <div class="art">
        <img v-if="image" :src="image" alt="" />
        <span v-else class="placeholder">Pick an image</span>
      </div>

      <div class="bar type-bar">{{ typeLine }}</div>

      <div class="text-box">
        <p v-for="(line, i) in (description ?? '').split('\n')" :key="i">{{ line }}</p>
      </div>

      <div v-if="showPT" class="pt">{{ power }}/{{ toughness }}</div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 375px;
  height: 523px;
  padding: 14px;
  box-sizing: border-box;
  background: #111;
  border-radius: 18px;
  font-family: Georgia, 'Times New Roman', serif;
  color: #111;
}

.inner {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  box-sizing: border-box;
  background: var(--marble) center / cover;
  border-radius: 6px;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 6px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85), 0 0 4px rgba(0, 0, 0, 0.5);
}

.title {
  font-size: 19px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mana {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  text-shadow: none;
}

.art {
  height: 220px;
  margin: 0 10px;
  border: 3px solid var(--accent);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
  background: #444;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  color: #aaa;
  font-style: italic;
}

.type-bar {
  font-size: 15px;
  padding-left: 12px;
}

.text-box {
  flex: 1;
  margin: 0 14px 22px;
  padding: 8px 10px;
  background: var(--box);
  border: 2px solid var(--accent);
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  line-height: 1.3;
  overflow: hidden;
}

.text-box p {
  margin: 0 0 6px;
  min-height: 1em;
}

.pt {
  position: absolute;
  right: 14px;
  bottom: 4px;
  padding: 2px 12px;
  background: var(--box);
  border: 2px solid var(--accent);
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
}
</style>
