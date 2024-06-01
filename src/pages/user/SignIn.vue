<script setup>
import { ref, onMounted } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import { useTestMode } from '@/composables/testMode';

const email = ref('test@test.com');
const password = ref('123qwe');

const errorMessage = ref('');

const auth = useFirebaseAuth();

const router = useRouter();
const toast = useToast();

const { testMode, testUsers } = useTestMode();

function onSubmit() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // console.log('User signed in');
      // console.log(userCredential);
      // console.log(userCredential.user);
      // console.log(userCredential.user.displayName);
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

          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
            <Dropdown
              v-if="testMode"
              id="email1"
              editable
              type="text"
              placeholder="Email address"
              class="w-full md:w-30rem mb-5 p-2"
              :options="testUsers"
              optionLabel="email"
              style="padding: 1rem"
              v-model="email"
            />
            <InputText
              v-else
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

            <Button label="Sign In" class="w-full p-3 my-5 text-xl" type="submit"></Button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
