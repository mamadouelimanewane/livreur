const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ANDROID_DIR = path.join(ROOT_DIR, 'android');

// App configurations
const APPS = {
  user: {
    appId: 'com.sur.user',
    appName: 'LiviGo Utilisateur',
    mobileRoute: '/mobile/user',
    icon: './assets/icon-user.png'
  },
  driver: {
    appId: 'com.sur.driver',
    appName: 'LiviGo Conducteur', 
    mobileRoute: '/mobile/driver',
    icon: './assets/icon-driver.png'
  }
};

function run(cmd, options = {}) {
  console.log(`\n▶ Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT_DIR, ...options });
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

function createCapacitorConfig(app) {
  const config = {
    appId: app.appId,
    appName: app.appName,
    webDir: 'dist',
    server: {
      androidScheme: 'https'
    },
    plugins: {
      SplashScreen: {
        launchShowDuration: 2000,
        backgroundColor: '#1a1d2e',
        showSpinner: false,
        androidSplashResourceName: 'splash',
        androidScaleType: 'CENTER_CROP'
      },
      StatusBar: {
        style: 'DARK',
        backgroundColor: '#1a1d2e'
      }
    }
  };
  
  fs.writeFileSync(
    path.join(ROOT_DIR, 'capacitor.config.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log(`✅ Created capacitor.config.json for ${app.appName}`);
}

function buildApk(appType) {
  const app = APPS[appType];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 Building ${app.appName} APK`);
  console.log(`${'='.repeat(60)}`);
  
  // Step 1: Create capacitor config
  createCapacitorConfig(app);
  
  // Step 2: Remove existing android folder
  if (fs.existsSync(ANDROID_DIR)) {
    console.log('🗑️ Removing existing android folder...');
    fs.rmSync(ANDROID_DIR, { recursive: true, force: true });
  }
  
  // Step 3: Add Android platform
  if (!run('npx cap add android')) {
    console.error('❌ Failed to add Android platform');
    return false;
  }
  
  // Step 4: Sync web assets
  if (!run('npx cap sync android')) {
    console.error('❌ Failed to sync Android');
    return false;
  }
  
  // Step 5: Build APK (debug)
  const gradlewCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  const androidAppDir = path.join(ANDROID_DIR, 'app');
  
  console.log('\n🔨 Building debug APK...');
  if (!run(`${gradlewCmd} assembleDebug`, { cwd: androidAppDir })) {
    console.error('❌ Failed to build APK');
    return false;
  }
  
  // Step 6: Copy APK to output folder
  const outputDir = path.join(ROOT_DIR, 'apk-output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const apkSource = path.join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  const apkDest = path.join(outputDir, `${appType}-app.apk`);
  
  if (fs.existsSync(apkSource)) {
    fs.copyFileSync(apkSource, apkDest);
    console.log(`\n✅ APK created: ${apkDest}`);
    return true;
  } else {
    console.error('❌ APK file not found');
    return false;
  }
}

// Main execution
console.log('🚀 LiviGo APK Builder');
console.log('=====================');

// Check if dist exists
if (!fs.existsSync(DIST_DIR)) {
  console.log('📦 Building web app first...');
  run('npm run build');
}

// Build both APKs
const results = {
  user: buildApk('user'),
  driver: buildApk('driver')
};

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 BUILD SUMMARY');
console.log('='.repeat(60));

Object.entries(results).forEach(([app, success]) => {
  const status = success ? '✅ SUCCESS' : '❌ FAILED';
  console.log(`${APPS[app].appName}: ${status}`);
});

console.log('\n📁 APK files location: ./apk-output/');
console.log('   - user-app.apk (Client)');
console.log('   - driver-app.apk (Conducteur)');
