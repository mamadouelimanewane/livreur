const target = process.env.APP_TARGET || 'user'

const configs = {
  user: {
    name: 'SÛR Utilisateur',
    slug: 'sur-user',
    bundleId: 'com.sur.user',
    icon: './assets/icon-user.png',
    splash: {
      backgroundColor: '#1a1d2e',
    },
  },
  driver: {
    name: 'SÛR Conducteur',
    slug: 'sur-driver',
    bundleId: 'com.sur.driver',
    icon: './assets/icon-driver.png',
    splash: {
      backgroundColor: '#1a1d2e',
    },
  },
}

const cfg = configs[target] || configs.user

export default {
  expo: {
    name: cfg.name,
    slug: cfg.slug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: cfg.icon,
    userInterfaceStyle: 'light',
    splash: {
      backgroundColor: cfg.splash.backgroundColor,
      resizeMode: 'contain',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: cfg.bundleId,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: cfg.icon,
        backgroundColor: '#1a1d2e',
      },
      package: cfg.bundleId,
    },
    extra: {
      appTarget: target,
    },
  },
}
