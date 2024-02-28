import './styles.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import ApplicationVue from './Application.vue';

const app = createApp(ApplicationVue)

app.use(createPinia())

app.mount('#application')