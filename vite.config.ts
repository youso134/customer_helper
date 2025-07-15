import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; // 需要安装 @types/node

// 按需引入elementUI
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "@": '/',
    },
  },
  
  // server: {
  //   proxy: {
  //     // 代理所有以 /api 开头的请求
  //     '/api': {
  //       target: 'http://localhost:3000', // 你的后端服务器地址
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '') // 可选，移除 /api 前缀
  //     }
  //   }
  // }

  // resolve: {
  //   alias: [
  //     {
  //       find: '@',
  //       replacement: '/src',
  //     }
  //   ]
  // }
});
