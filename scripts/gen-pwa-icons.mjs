import { Jimp } from 'jimp'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = resolve(__dirname, '../public/logo/Manzana.webp')
const out = resolve(__dirname, '../public')

const sizes = [192, 512]

for (const size of sizes) {
  const img = await Jimp.read(src)
  img.resize({ w: size, h: size })
  await img.write(`${out}/pwa-${size}x${size}.png`)
  console.log(`✓ pwa-${size}x${size}.png`)
}
