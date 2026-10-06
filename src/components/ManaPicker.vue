<script setup>
import { ref } from 'vue'
import ManaSymbol from './ManaSymbol.vue'

const model = defineModel({ type: Array, required: true })

const OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'W', 'U', 'B', 'R', 'G', 'C']

const openIndex = ref(null)

function toggle(i) {
  openIndex.value = openIndex.value === i ? null : i
}

function select(i, value) {
  model.value = model.value.map((v, j) => (j === i ? value : v))
  openIndex.value = null
}

function remove(i) {
  model.value = model.value.filter((_, j) => j !== i)
  openIndex.value = null
}

function add() {
  model.value = [...model.value, '1']
  openIndex.value = model.value.length - 1
}
</script>

<template>
  <div class="mana-picker">
    <div v-for="(sym, i) in model" :key="i" class="slot">
      <button type="button" class="slot-btn" @click="toggle(i)">
        <ManaSymbol :value="sym" />
        <span class="caret">▾</span>
      </button>

      <div v-if="openIndex === i" class="menu">
        <button
          v-for="opt in OPTIONS"
          :key="opt"
          type="button"
          class="opt"
          :class="{ active: opt === sym }"
          @click="select(i, opt)"
        >
          <ManaSymbol :value="opt" />
        </button>
        <button type="button" class="remove" @click="remove(i)">Remove</button>
      </div>
    </div>

    <button type="button" class="add" title="Add mana symbol" @click="add">+</button>

    <div v-if="openIndex !== null" class="backdrop" @click="openIndex = null" />
  </div>
</template>

<style scoped>
.mana-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.slot {
  position: relative;
}

.slot-btn,
.add {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #2b2d33;
  color: inherit;
  cursor: pointer;
  font-weight: normal;
}

.add {
  height: 31px;
  width: 31px;
  justify-content: center;
  font-size: 18px;
}

.caret {
  font-size: 10px;
  opacity: 0.7;
}

.menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(6, 30px);
  gap: 4px;
  padding: 8px;
  background: #2b2d33;
  border: 1px solid #555;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
}

.opt {
  padding: 3px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}

.opt:hover,
.opt.active {
  border-color: #e0a526;
}

.remove {
  grid-column: 1 / -1;
  padding: 4px;
  font-size: 12px;
  background: #5a2a2a;
  color: #eee;
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 5;
}
</style>
