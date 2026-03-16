import { useRef, useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, View, BackHandler, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import Constants from 'expo-constants'

const appTarget = Constants.expoConfig?.extra?.appTarget || 'user'
const route = appTarget === 'driver' ? '/mobile/driver' : '/mobile/user'

// In production, the web assets are bundled in dist/ and served locally
// In dev, point to your local dev server
const DEV_SERVER = 'http://10.0.2.2:5174' // Android emulator localhost
const BASE_URL = __DEV__ ? DEV_SERVER : ''

export default function App() {
  const webviewRef = useRef(null)
  const [loading, setLoading] = useState(true)

  // Handle Android back button
  if (Platform.OS === 'android') {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (webviewRef.current) {
        webviewRef.current.goBack()
        return true
      }
      return false
    })
  }

  const sourceUri = __DEV__
    ? { uri: `${DEV_SERVER}${route}` }
    : { uri: `file:///android_asset/public/index.html` }

  const injectedJS = __DEV__ ? '' : `
    (function() {
      if (window.location.pathname !== '${route}') {
        window.location.replace('${route}');
      }
    })();
    true;
  `

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d2e" />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4680ff" />
        </View>
      )}
      <WebView
        ref={webviewRef}
        source={sourceUri}
        style={styles.webview}
        injectedJavaScript={injectedJS}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        originWhitelist={['*']}
        setSupportMultipleWindows={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d2e',
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1d2e',
    zIndex: 10,
  },
})
