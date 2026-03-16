const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Exclude web-only source files from Metro bundling
// Metro should only bundle App.native.jsx (the RN WebView wrapper)
config.resolver.blockList = [
  // Block the entire src/ directory (web-only React app)
  new RegExp(path.resolve(__dirname, 'src').replace(/[/\\]/g, '[/\\\\]') + '.*'),
  // Block android build outputs
  new RegExp(path.resolve(__dirname, 'android', 'app', 'build').replace(/[/\\]/g, '[/\\\\]') + '.*'),
  // Block dist/ (Vite build output)
  new RegExp(path.resolve(__dirname, 'dist').replace(/[/\\]/g, '[/\\\\]') + '.*'),
]

module.exports = config
