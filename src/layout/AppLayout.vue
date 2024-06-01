<script setup>
import { ref } from 'vue';
import { signOut } from 'firebase/auth';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';
import { useToast } from 'primevue/usetoast';

const auth = useFirebaseAuth();
const user = useCurrentUser();

const toast = useToast();

function handleSignOut() {
  const userName = user.value.displayName;
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      toast.add({
        severity: 'contrast',
        summary: 'Signed out',
        detail: `Hope to see you later, ${userName}!`,
        life: 3000,
      });
    })
    .catch((error) => {
      // An error happened.
      console.error(error);
      toast.add({
        severity: 'error',
        summary: "Couldn't sign out",
        detail: `There was an error ${error}`,
        life: 3000,
      });
    });
}
</script>

<template>
  <main>
    <header class="flex align-items-center justify-content-between relative">
      <router-link class="flex align-items-center no-underline" to="/">
        <img src="/local_mall.svg" alt="Delivery Logo" height="42" />
        <span class="text-900 font-medium text-2xl line-height-3 mr-8">Delivery</span>
      </router-link>

      <section v-if="user" class="flex justify-content-between gap-2 py-3">
        <router-link to="/user/cart">
          <Button label="Cart" badge="2" icon="pi pi-shopping-cart"></Button>
        </router-link>

        <Button
          label="Sign Out"
          severity="danger"
          icon="pi pi-sign-out"
          @click="handleSignOut"
        ></Button>
      </section>
      <section v-else class="flex justify-content-between gap-2 py-3">
        <router-link to="/user/signin">
          <Button label="Sign In" icon="pi pi-sign-in"></Button>
        </router-link>

        <router-link to="/user/signin">
          <Button label="Sign Up" icon="pi pi-user-plus"></Button>
        </router-link>
      </section>
    </header>
  </main>

  <div class="border border-1 m-2 p-2">
    <router-view></router-view>
  </div>
</template>
