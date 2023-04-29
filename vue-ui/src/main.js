import { createApp } from 'vue'
import App from './App.vue'

// import './assets/main.css'

import EP from 'element-plus'
import 'element-plus/dist/index.css'

let app = createApp(App)

app.use(EP)

app.mount('#app')
