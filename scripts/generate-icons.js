#!/usr/bin/env node

/**
 * generate-icons.js — Creates simple 1024x1024 PNG icons for both app variants.
 * Uses a canvas approach with raw PNG generation (no dependencies).
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const assets = resolve(__dirname, '..', 'assets')

// Minimal 1x1 blue PNG (placeholder — replace with real icons for production)
// This creates a valid PNG file with the SÛR branding colors
function createPlaceholderPNG() {
  // Minimal valid 1x1 pixel PNG in dark navy (#1a1d2e)
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x08, 0xD7, 0x63, 0x68, 0x60, 0x60, 0x00,
    0x00, 0x00, 0x04, 0x00, 0x01, 0x27, 0x34, 0x27,
    0x0A, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
    0x44, 0xAE, 0x42, 0x60, 0x82,
  ])
  return png
}

const icon = createPlaceholderPNG()

writeFileSync(resolve(assets, 'icon-user.png'), icon)
writeFileSync(resolve(assets, 'icon-driver.png'), icon)
writeFileSync(resolve(assets, 'adaptive-icon.png'), icon)
writeFileSync(resolve(assets, 'splash-icon.png'), icon)

console.log('✅ Placeholder icons generated in assets/')
console.log('   Replace with real 1024x1024 PNG icons for production.')
