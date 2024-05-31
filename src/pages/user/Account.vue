<script setup></script>

<template>
  <article>
    <h2>Account</h2>
    <div></div>
    <p v-if="user">Hello {{ user.displayName }}</p>
    <p v-else>No user</p>
    <Button @click="signIn">Boo</Button>
  </article>
</template>
