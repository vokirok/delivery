<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';

const usermail = ref('test@test.com');
const userpass = ref('123qwe');

const auth = useFirebaseAuth();
const user = useCurrentUser();

function signIn() {
  signInWithEmailAndPassword(auth, usermail.value, userpass.value)
    .then((userCredential) => {
      user.value = userCredential.user;
      console.log('User signed in');
      console.log(userCredential);
      console.log(userCredential.user);
    })
    .catch((error) => {
      console.error('Failed to sign in');
      console.error(error);
    });
}
</script>

<template>
  <div></div>
  <p v-if="user">Hello {{ user.displayName }}</p>
  <p v-else>No user</p>
  <Button @click="signIn">Boo</Button>
  <router-view></router-view>
</template>
