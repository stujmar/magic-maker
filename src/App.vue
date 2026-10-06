<script setup>
import { computed, ref } from 'vue'
import { toPng } from 'html-to-image'
import MtgCard from './components/MtgCard.vue'
import ManaPicker from './components/ManaPicker.vue'

const colors = ['white', 'blue', 'black', 'red', 'green', 'gold', 'colorless']

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
