import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

import '@unocss/reset/tailwind.css'
import App from './App.vue'
import 'uno.css'
import './style.css'
import { router } from './router'

const nativeRootPaths = new Set(['/', '/home', '/data', '/routes', '/device', '/my'])

if (Capacitor.isNativePlatform()) {
  document.documentElement.classList.add('capacitor-native')

  void CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    const currentPath = router.currentRoute.value.path

    if (canGoBack && !nativeRootPaths.has(currentPath)) {
      router.back()
      return
    }

    void CapacitorApp.exitApp()
  })
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
