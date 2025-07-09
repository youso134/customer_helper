import { createApp } from 'vue'
import '@/assets/css/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(router)
app.mount('#app')

// 导入图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

