<script setup>
import { useTestMode } from '@/composables/testMode';

const { testMode } = useTestMode();
</script>

<template>
  <Toast />
  <router-view></router-view>
  <div class="absolute" style="z-index: 50000; bottom: 26px; left: 4px">
    <label><Checkbox v-model="testMode" :binary="true" class="mr-2" />Test mode</label>
  </div>
</template>
