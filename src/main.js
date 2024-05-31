import { createApp } from 'vue';

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
// import { getFirestore, collection } from 'firebase/firestore';
import { VueFire, VueFireAuth } from 'vuefire';

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';

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

// Setting up local Firebase emulator for debug purposes only for localhost

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  // console.log(`Working in emulator: ${location.hostname}`);

  // const db = getFirestore();
  // connectFirestoreEmulator(db, '127.0.0.1', 4400);

  connectAuthEmulator(firebaseAuth, 'http://127.0.0.1:9099');
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

// Add PrimeVue components

app.component('Button', Button);

app.mount('#app');
