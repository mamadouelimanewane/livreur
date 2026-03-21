const target = process.env.APP_TARGET || 'user'
const webDevUrl = process.env.APP_WEB_DEV_URL || 'http://10.0.2.2:5173'

const configs = {
  user: {
    name: 'LiviGo Utilisateur',
    slug: 'sur-user',
    bundleId: 'com.sur.user',
    icon: './assets/icon-user.png',
    splash: {
      backgroundColor: '#1a1d2e',
    },
  },
  driver: {
    name: 'LiviGo Conducteur',
    slug: 'sur-driver',
    bundleId: 'com.sur.driver',
    icon: './assets/icon-driver.png',
    splash: {
      backgroundColor: '#1a1d2e',
    },
  },
  admin: {
    name: 'LiviGo Admin',
    slug: 'sur-admin',
    bundleId: 'com.sur.admin',
    icon: './assets/adaptive-icon.png',
    splash: {
      backgroundColor: '#1a1d2e',
    },
  },
}

const cfg = configs[target] || configs.user
const mobileRoute = target === 'driver' ? '/mobile/driver' : target === 'admin' ? '/dashboard' : '/mobile/user'

export default {
  expo: {
    name: cfg.name,
    slug: cfg.slug,
    owner: 'mamadouelimane',
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
      mobileRoute,
      webDevUrl,
      eas: {
        projectId: '9797d8ea-a369-4fc2-a3ea-761cc6970ea6',
      },
    },
  },
}
