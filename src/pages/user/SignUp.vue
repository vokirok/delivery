<script setup>
import { ref, computed } from 'vue';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import { useTestMode } from '@/composables/testMode';

const name = ref('');
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
          name.value = user.name;
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
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) =>
      updateProfile(userCredential.user, {
        displayName: name.value,
      }).then(() => {
        router.push('/');
        toast.add({
          severity: 'success',
          summary: 'Вы успешно зарегистрировались',
          detail: `Добро пожаловать, ${name.value}!`,
          life: 3000,
        });
      })
    )
    .catch((error) => {
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage.value = 'Неверный почтовый адрес';
          break;
        case 'auth/email-already-in-use':
          errorMessage.value = 'Почтовый адрес уже используется';
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
            <div class="text-900 text-3xl font-medium mb-3">Добро пожаловать!</div>
            <span class="text-600 font-medium">Зарегистрируйтесь, чтобы продолжить</span>
          </div>

          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

          <div>
            <label for="name1" class="block text-900 text-xl font-medium mb-2"
              >Имя<Button
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
              id="name1"
              type="text"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
              v-model="name"
            />

            <label for="email1" class="block text-900 text-xl font-medium mb-2">Почта</label>

            <InputText
              id="email1"
              type="text"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
              v-model="email"
            />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Пароль</label>
            <Password
              id="password1"
              v-model="password"
              :toggleMask="true"
              class="w-full mb-3"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              :feedback="false"
            ></Password>

            <Message severity="error" v-if="errorMessage">{{ errorMessage }}</Message>

            <Button
              label="Зарегистроваться"
              class="w-full p-3 my-5 text-xl"
              type="submit"
              :disabled="!(name && email && password)"
            ></Button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
