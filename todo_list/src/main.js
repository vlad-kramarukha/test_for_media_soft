import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vfonts/FiraSans.css'
import './styles.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
