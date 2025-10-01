import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/DemoReception/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['vite.svg', 'icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'デモ用簡易版QR受付アプリ',
        short_name: 'DemoReception',
        description: 'QRコードを使った簡易受付システムのデモ版',
        theme_color: '#667eea',
        background_color: '#667eea',
        display: 'standalone',
        start_url: '/DemoReception/',
        scope: '/DemoReception/',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})