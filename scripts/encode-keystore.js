#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const [inputPath, outputPath] = process.argv.slice(2)

if (!inputPath) {
  console.error('Usage: node scripts/encode-keystore.js <keystore-path> [output-file]')
  process.exit(1)
}

const resolvedInput = resolve(process.cwd(), inputPath)
const base64 = readFileSync(resolvedInput).toString('base64')

if (outputPath) {
  const resolvedOutput = resolve(process.cwd(), outputPath)
  writeFileSync(resolvedOutput, base64)
  console.log(`Base64 written to ${resolvedOutput}`)
} else {
  console.log(base64)
}
