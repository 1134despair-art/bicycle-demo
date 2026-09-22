import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons({ scale: 1.05 })],
  theme: {
    colors: {
      brand: {
        50: '#fff9f2',
        100: '#fff2e6',
        200: '#ffdfbf',
        300: '#ffc58c',
        400: '#ffa54d',
        500: '#ff7f00',
        600: '#e67200',
        700: '#ff7f00',
        800: '#994c00',
        900: '#733900',
      },
      ink: '#1d1d1f',
      muted: '#6e7378',
      soft: '#f5f6f8',
      line: '#e8eaed',
      success: '#17a26b',
      warning: '#ef8b17',
      danger: '#e44747',
    },
    boxShadow: {
      phone: '0 24px 64px rgba(29, 29, 31, 0.10)',
      card: '0 1px 2px rgba(29, 29, 31, 0.04)',
      float: '0 10px 28px rgba(29, 29, 31, 0.12)',
    },
    borderRadius: {
      control: '8px',
      card: '8px',
      media: '6px',
      sheet: '16px',
    },
    fontFamily: {
      sans: '"PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", "Inter", sans-serif',
    },
  },
})
