import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.ltwoo.bicycle',
  appName: '蓝图骑行',
  webDir: 'dist',
  backgroundColor: '#ffffff',
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'LIGHT',
      hidden: false,
      animation: 'NONE',
    },
  },
}

export default config
