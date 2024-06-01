import { createApp } from 'vue';

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { VueFire, VueFireAuth } from 'vuefire';

import PrimeVue from 'primevue/config';

import Badge from 'primevue/badge';
import BadgeDirective from 'primevue/badgedirective';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import ConfirmationService from 'primevue/confirmationservice';
import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import 'primevue/resources/themes/aura-light-blue/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import router from './router';

import './style.css';

// This config was taken from Firebase Console.

const firebaseConfig = {
  apiKey: 'AIzaSyBVcOGf_kWfvni5NtyPWsUJh1fiyGVUY0A',
  authDomain: 'delivery-mall.firebaseapp.com',
  projectId: 'delivery-mall',
  storageBucket: 'delivery-mall.appspot.com',
  messagingSenderId: '705423343764',
  appId: '1:705423343764:web:19b43839bea1147869f481',
  measurementId: 'G-S18WGX11TD',
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDb = getFirestore();

// Setting up local Firebase emulator for debug purposes only for localhost

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  // console.log(`Working in emulator: ${location.hostname}`);

  connectAuthEmulator(firebaseAuth, 'http://127.0.0.1:9099');
  // connectFirestoreEmulator(firebaseDb, '127.0.0.1', 8080);
}

// Create Vue App

const app = createApp(App);

// Init router for Vue App

app.use(router);

// Init VueFire for Vue App

app.use(VueFire, {
  firebaseApp: firebaseApp,
  modules: [
    // ... other modules
    VueFireAuth(),
  ],
});

// Init PrimeVue for Vue App

app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

// Add PrimeVue directives and components

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('Badge', Badge);
app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('Message', Message);
app.component('Password', Password);
app.component('InputText', InputText);
app.component('Toast', Toast);

app.mount('#app');
