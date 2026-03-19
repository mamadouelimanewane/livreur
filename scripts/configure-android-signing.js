#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const buildGradlePath = resolve(root, 'android', 'app', 'build.gradle')

if (!existsSync(buildGradlePath)) {
  console.error('Android Gradle file not found. Run "npx cap add android" first.')
  process.exit(1)
}

const requiredEnv = [
  'ANDROID_KEYSTORE_FILE',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
]

const missing = requiredEnv.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error(`Missing Android signing env vars: ${missing.join(', ')}`)
  process.exit(1)
}

let content = readFileSync(buildGradlePath, 'utf8')

if (!content.includes('signingConfigs')) {
  const signingBlock = `
    signingConfigs {
        release {
            storeFile file(System.getenv("ANDROID_KEYSTORE_FILE"))
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
`

  content = content.replace('    buildTypes {', `${signingBlock}\n    buildTypes {`)
}

if (!content.includes('buildTypes {\n        release {\n            signingConfig signingConfigs.release')) {
  const nextContent = content.replace(
    /(buildTypes\s*\{\s*\n\s*release\s*\{\s*\n)/,
    `$1            signingConfig signingConfigs.release\n`
  )

  if (nextContent === content) {
    console.error('Could not locate buildTypes.release block in android/app/build.gradle')
    process.exit(1)
  }

  content = nextContent
}

writeFileSync(buildGradlePath, content)

console.log('Configured Android release signing in android/app/build.gradle')
