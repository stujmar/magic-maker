<script setup>
import { computed, ref } from 'vue'
import { toPng } from 'html-to-image'
import MtgCard from './components/MtgCard.vue'
import ManaPicker from './components/ManaPicker.vue'

const colors = ['white', 'blue', 'black', 'red', 'green', 'gold', 'artifact', 'colorless']

const title = ref('Goblin Tinkerer')
const typeLine = ref('Creature — Goblin Artificer')
const description = ref('Haste\nWhen Goblin Tinkerer enters the battlefield, destroy target artifact.')
const manaSymbols = ref(['1', 'R'])
const manaCost = computed(() => manaSymbols.value.map((s) => `{${s}}`).join(''))
const color = ref('red')
const power = ref('2')
const toughness = ref('1')
const image = ref('')

const cardEl = ref(null)

function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => (image.value = reader.result)
  reader.readAsDataURL(file)
}

async function download() {
  const dataUrl = await toPng(cardEl.value, { pixelRatio: 2 })
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `${title.value || 'card'}.png`
  a.click()
}
</script>

<template>
  <main>
    <form class="controls" @submit.prevent="download">
      <h1>Magic Maker</h1>

      <label>Image <input type="file" accept="image/*" @change="onFile" /></label>
      <label>Title <input v-model="title" /></label>
      <div class="field">
        Mana cost
        <ManaPicker v-model="manaSymbols" />
      </div>
      <label>
        Color
        <select v-model="color">
          <option v-for="c in colors" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <label>Type line <input v-model="typeLine" /></label>
      <label>Description <textarea v-model="description" rows="6" /></label>
      <div class="row">
        <label>Power <input v-model="power" /></label>
        <label>Toughness <input v-model="toughness" /></label>
      </div>

      <button type="submit">Download PNG</button>
    </form>

    <div ref="cardEl" class="preview">
      <MtgCard
        :title="title"
        :type-line="typeLine"
        :description="description"
        :mana-cost="manaCost"
        :color="color"
        :image="image"
        :power="power"
        :toughness="toughness"
      />
    </div>
  </main>

  <footer>
    <a href="https://github.com/stujmar/magic-maker" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
      stujmar/magic-maker
    </a>
  </footer>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #1e1f24;
  color: #eee;
}

main {
  display: flex;
  gap: 40px;
  padding: 32px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}

footer {
  padding: 16px;
  text-align: center;
  font-size: 14px;
}

footer a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid #444;
  border-radius: 999px;
  color: #ccc;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

footer a:hover {
  color: #fff;
  border-color: #e0a526;
  background: #2b2d33;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
}

.controls h1 {
  margin: 0 0 8px;
}

.controls label,
.controls .field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.controls input,
.controls select,
.controls textarea {
  padding: 6px 8px;
  font: inherit;
  border-radius: 4px;
  border: 1px solid #555;
  background: #2b2d33;
  color: inherit;
}

.row {
  display: flex;
  gap: 12px;
}

.row label {
  flex: 1;
}

.row input {
  width: 100%;
  box-sizing: border-box;
}

button {
  padding: 10px;
  font: inherit;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  background: #e0a526;
  color: #111;
  cursor: pointer;
}

.preview {
  display: inline-block;
}
</style>
