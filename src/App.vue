<script setup>
import { useTestMode } from '@/composables/testMode';

const { testMode } = useTestMode();
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <router-view></router-view>
  <footer class="h-4rem"></footer>
  <div class="fixed" style="z-index: 50000; bottom: 26px; left: 4px">
    <label><Checkbox v-model="testMode" :binary="true" class="mr-2" />Test mode</label>
  </div>
</template>
