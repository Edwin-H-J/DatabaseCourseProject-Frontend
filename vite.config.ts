import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api' : {
        target:'http://127.0.0.1:8001',
        changeOrigin:true,
        rewrite: (path) => path.replace(/^\/api/,"")
      }
    }
  },
  plugins: [
    vue()
  ]
})
