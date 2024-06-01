<script setup>
import { ref, computed } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import { useTestMode } from '@/composables/testMode';

const email = ref('');
const password = ref('');

const errorMessage = ref('');

const auth = useFirebaseAuth();

const router = useRouter();
const toast = useToast();

const { testMode, testUsers } = useTestMode();
const menu = ref();
const items = computed(() => {
  return [
    {
      label: 'Test users',
      items: testUsers.map((user) => ({
        label: `${user.name}`,
        icon: 'pi pi-user',
        command: () => {
          email.value = user.email;
          password.value = user.password;
        },
      })),
    },
  ];
});

function toggle(event) {
  menu.value.toggle(event);
}

function onSubmit() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      router.push('/');
      toast.add({
        severity: 'success',
        summary: 'Successfully signed in',
        detail: `Welcome, ${userCredential.user.displayName}!`,
        life: 3000,
      });
    })
    .catch((error) => {
      console.error('Failed to sign in');
      console.error(error);
      console.log(error.code);
      console.log(error.message);

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage.value = 'Invalid email';
          break;
        case 'auth/user-not-found':
          errorMessage.value = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage.value = 'Wrong password';
          break;
        default:
          errorMessage.value = error.code;
      }
    });
}
</script>

<template>
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <form
      class="flex flex-column align-items-center justify-content-center"
      @submit.prevent="onSubmit"
    >
      <router-link to="/">
        <img src="/local_mall.svg" alt="Delivery logo" class="mb-5 w-6rem flex-shrink-0" />
      </router-link>
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
        "
      >
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Welcome to Delivery!</div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div>

          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2"
              >Email<Button
                v-if="testMode"
                class="text-xs p-1 ml-2"
                icon="pi pi-users"
                @click="toggle"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                severity="secondary"
                label="Test users"
                outlined
              />
            </label>

            <InputText
              id="email1"
              type="text"
              placeholder="Email address"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
              v-model="email"
            />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
            <Password
              id="password1"
              v-model="password"
              placeholder="Password"
              :toggleMask="true"
              class="w-full mb-3"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
            ></Password>

            <Message severity="error" v-if="errorMessage">{{ errorMessage }}</Message>

            <Button
              label="Sign In"
              class="w-full p-3 my-5 text-xl"
              type="submit"
              :disabled="!(email && password)"
            ></Button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
