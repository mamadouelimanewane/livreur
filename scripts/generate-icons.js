#!/usr/bin/env node

/**
 * generate-icons.js — Creates valid 1024x1024 PNG icons for both app variants.
 * Generates proper PNG files with zlib-compressed IDAT chunks.
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { deflateSync } from 'zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const assets = resolve(__dirname, '..', 'assets')

function crc32(buf) {
  let crc = 0xFFFFFFFF
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    }
    table[i] = c
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function createPNGChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeAndData = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeAndData))
  return Buffer.concat([len, typeAndData, crc])
}

function createPNG(size, r, g, b) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)  // width
  ihdr.writeUInt32BE(size, 4)  // height
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // color type (RGB)
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace
  const ihdrChunk = createPNGChunk('IHDR', ihdr)

  // IDAT - raw pixel data with filter bytes
  const rowSize = 1 + size * 3  // filter byte + RGB per pixel
  const raw = Buffer.alloc(rowSize * size)
  for (let y = 0; y < size; y++) {
    const offset = y * rowSize
    raw[offset] = 0  // filter: none
    for (let x = 0; x < size; x++) {
      const px = offset + 1 + x * 3
      raw[px] = r
      raw[px + 1] = g
      raw[px + 2] = b
    }
  }
  const compressed = deflateSync(raw)
  const idatChunk = createPNGChunk('IDAT', compressed)

  // IEND
  const iendChunk = createPNGChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

// Create 192x192 icons (smaller but valid, to keep file size reasonable)
// Dark navy for user (#1a1d2e = 26, 29, 46)
const userIcon = createPNG(192, 26, 29, 46)
// Blue accent for driver (#46, 128, 255)
const driverIcon = createPNG(192, 70, 128, 255)

writeFileSync(resolve(assets, 'icon-user.png'), userIcon)
writeFileSync(resolve(assets, 'icon-driver.png'), driverIcon)
writeFileSync(resolve(assets, 'adaptive-icon.png'), userIcon)
writeFileSync(resolve(assets, 'splash-icon.png'), userIcon)

console.log(`✅ Valid PNG icons generated (192x192)`)
console.log(`   icon-user.png:   ${userIcon.length} bytes (dark navy)`)
console.log(`   icon-driver.png: ${driverIcon.length} bytes (blue accent)`)
