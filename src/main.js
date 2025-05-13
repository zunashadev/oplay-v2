import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import print from './directives/print';

const app = createApp(App);

app.directive('print', print);

app.use(createPinia());
app.use(router);

app.mount('#app');
