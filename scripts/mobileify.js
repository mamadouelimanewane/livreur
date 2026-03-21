#!/usr/bin/env node

/**
 * mobileify.js - Sets the APP_TARGET env and generates configs for APK builds.
 *
 * Usage:
 *   node scripts/mobileify.js user      -> LiviGo Utilisateur
 *   node scripts/mobileify.js driver    -> LiviGo Conducteur
 *
 * Works with both Capacitor and Expo/EAS builds.
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const target = (process.argv[2] || 'user').toLowerCase()

const configs = {
  user: {
    appId: 'com.sur.user',
    appName: 'LiviGo Utilisateur',
    server: '/mobile/user',
  },
  driver: {
    appId: 'com.sur.driver',
    appName: 'LiviGo Conducteur',
    server: '/mobile/driver',
  },
  admin: {
    appId: 'com.sur.admin',
    appName: 'LiviGo Admin',
    server: '/dashboard',
  },
}

const cfg = configs[target]

if (!cfg) {
  console.error(`Unknown target "${target}". Use: user | driver | admin`)
  process.exit(1)
}

// Set env for Expo/EAS
process.env.APP_TARGET = target

// Generate Capacitor config (for Capacitor builds)
const capacitorConfig = {
  appId: cfg.appId,
  appName: cfg.appName,
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1d2e',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a1d2e',
    },
  },
}

writeFileSync(
  resolve(root, 'capacitor.config.json'),
  JSON.stringify(capacitorConfig, null, 2)
)

console.log(`Configured for: ${cfg.appName} (${cfg.appId})`)
console.log(`   Target: ${target} | Route: ${cfg.server}`)
console.log('')
console.log('   Expo/EAS:  APP_TARGET=' + target + ' eas build --profile ' + target + '-apk --platform android')
console.log('   Capacitor: npm run mobile:' + target)
