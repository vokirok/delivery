import { createApp } from 'vue';
import PrimeVue from 'primevue/config';

import Button from 'primevue/button';

import 'primevue/resources/themes/aura-light-blue/theme.css';
import './style.css';

import App from './App.vue';

const app = createApp(App);
app.use(PrimeVue, { ripple: true });

app.component('Button', Button);

app.mount('#app');
