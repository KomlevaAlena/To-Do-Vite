import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/To-Do-Vite/',
  
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
        // about: resolve(__dirname, 'src/pages/about.html'),
        // button: resolve(__dirname, 'src/pages/button-demo.html'),
      }
    },
    // Включаем обработку assets
    assetsInlineLimit: 4096, // файлы меньше 4kb инлайнятся
  },
  
  // Оптимизация для изображений
  optimizeDeps: {
    include: ['sharp']
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        charset: false // может помочь с некоторыми версиями Sass
      }
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  
  server: {
    port: 3000,
    open: true
  }
})