import { createApp } from 'vue'
import { createRouter,createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import routes from "./router"
import App from './App.vue'

const router = createRouter({
    history:createWebHashHistory(),
    routes
})
createApp(App).use(ElementPlus).use(router).mount('#app')
