function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeFbm(seed) {
  const rand = mulberry32(seed)
  const perm = new Uint8Array(512)
  const vals = new Float32Array(256)
  const p = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  for (let i = 0; i < 256; i++) vals[i] = rand()

  const lattice = (x, y) => vals[perm[perm[x & 255] + (y & 255)]]

  const noise = (x, y) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const u = xf * xf * (3 - 2 * xf)
    const v = yf * yf * (3 - 2 * yf)
    const a = lattice(xi, yi)
    const b = lattice(xi + 1, yi)
    const c = lattice(xi, yi + 1)
    const d = lattice(xi + 1, yi + 1)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }

  return (x, y) => {
    let sum = 0
    let amp = 0.5
    for (let o = 0; o < 5; o++) {
      sum += amp * noise(x, y)
      x *= 2
      y *= 2
      amp *= 0.5
    }
    return sum
  }
}

const cache = new Map()

// Domain-warped fbm marbling, returned as a PNG data URL so html-to-image can embed it.
export function marbleDataUrl({ base, vein }, width, height, seed = 1337) {
  const key = `${base}|${vein}|${width}x${height}|${seed}`
  if (cache.has(key)) return cache.get(key)

  const fbm = makeFbm(seed)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(width, height)
  const data = img.data
  const freq = 3 / Math.max(width, height)

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const x = px * freq
      const y = py * freq
      const q1 = fbm(x, y)
      const q2 = fbm(x + 5.2, y + 1.3)
      const r = fbm(x + 4 * q1 + 1.7, y + 4 * q2 + 9.2)
      const t = (x * 0.4 + y) * 2 + 6 * r

      const thick = Math.pow(1 - Math.abs(Math.sin(t * 2)), 4)
      const thin = Math.pow(1 - Math.abs(Math.sin(t * 7 + r * 3)), 14) * 0.6
      const v = Math.min(1, thick * 0.8 + thin)
      const shade = 0.85 + 0.3 * fbm(x * 3 + 20, y * 3 + 20)

      const i = (py * width + px) * 4
      for (let c = 0; c < 3; c++) {
        const b = base[c] * shade
        data[i + c] = b + (vein[c] - b) * v
      }
      data[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  const url = canvas.toDataURL('image/png')
  cache.set(key, url)
  return url
}
