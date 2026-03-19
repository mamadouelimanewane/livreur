import { useEffect, useRef, useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, View, BackHandler, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import Constants from 'expo-constants'

const appTarget = Constants.expoConfig?.extra?.appTarget || 'user'
const route = appTarget === 'driver' ? '/mobile/driver' : '/mobile/user'

// In production, the web assets are bundled in dist/ and served locally.
// In dev, point to the Vite server exposed to the Android emulator.
const DEV_SERVER = 'http://10.0.2.2:5173'
const isDev = __DEV__

export default function App() {
  const webviewRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false
      webviewRef.current?.goBack()
      return true
    })

    return () => subscription.remove()
  }, [canGoBack])

  const sourceUri = isDev
    ? { uri: `${DEV_SERVER}${route}` }
    : { uri: `file:///android_asset/public/index.html` }

  const injectedJS = isDev ? '' : `
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
        onNavigationStateChange={state => setCanGoBack(state.canGoBack)}
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
