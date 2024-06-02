import { createApp } from 'vue';

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection } from 'firebase/firestore';
import { VueFire, VueFireAuth } from 'vuefire';

import PrimeVue from 'primevue/config';

import Badge from 'primevue/badge';
import BadgeDirective from 'primevue/badgedirective';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import Image from 'primevue/image';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Rating from 'primevue/rating';
import Ripple from 'primevue/ripple';
import Skeleton from 'primevue/skeleton';
import StyleClass from 'primevue/styleclass';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import ProductImage from './components/ProductImage.vue';
import router from './router';
import { useTestMode } from '@/composables/testMode';

const { testMode } = useTestMode();

import './theme.css';
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
  connectFirestoreEmulator(firebaseDb, '127.0.0.1', 8080);

  testMode.value = true;
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
app.component('Breadcrumb', Breadcrumb);
app.component('Button', Button);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('Image', Image);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('Message', Message);
app.component('Password', Password);
app.component('Rating', Rating);
app.component('Skeleton', Skeleton);
app.component('Tag', Tag);
app.component('Toast', Toast);

app.component('ProductImage', ProductImage);

app.mount('#app');
