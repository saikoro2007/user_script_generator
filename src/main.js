import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/index.css'
import element_plus from 'element-plus'

const app = createApp(App)
app.use(router).use(element_plus).mount('#app')