<script setup>
import { computed } from 'vue'
import ManaSymbol from './ManaSymbol.vue'

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
  white: { frame: '#e8e2c2', box: '#f8f6e8', accent: '#cfc59a' },
  blue: { frame: '#1a6fb0', box: '#d6e6f3', accent: '#0d4f80' },
  black: { frame: '#2e2a28', box: '#cfc8c2', accent: '#151312' },
  red: { frame: '#c8322a', box: '#f6d2c4', accent: '#8e1d17' },
  green: { frame: '#1f7a44', box: '#cfe6d4', accent: '#0f5a2e' },
  gold: { frame: '#c9a74a', box: '#f3e6b8', accent: '#9b7b25' },
  colorless: { frame: '#9aa3a8', box: '#e3e7e9', accent: '#6b7479' },
}

const frame = computed(() => FRAMES[props.color] ?? FRAMES.colorless)

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
    :style="{ '--frame': frame.frame, '--box': frame.box, '--accent': frame.accent }"
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
  background: var(--frame);
  border-radius: 8px;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background: var(--box);
  border: 2px solid var(--accent);
  border-radius: 10px / 50%;
  font-weight: bold;
}

.title {
  font-size: 17px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mana {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.art {
  height: 220px;
  margin: 0 6px;
  border: 2px solid var(--accent);
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
  font-size: 14px;
}

.text-box {
  flex: 1;
  margin: 0 6px;
  padding: 8px 10px;
  background: var(--box);
  border: 2px solid var(--accent);
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
