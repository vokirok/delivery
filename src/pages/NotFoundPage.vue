<script setup lang="ts"></script>

<template>
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <router-link to="/">
        <img src="/local_mall.svg" alt="Mall logo" class="mb-5 w-6rem flex-shrink-0" />
      </router-link>
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
        "
      >
        <div
          class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
          style="border-radius: 53px"
        >
          <span class="font-bold text-3xl">404</span>
          <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">Not Found</h1>
          <div class="text-600 mb-5">Requested resource is not available.</div>
          <router-link
            to="/"
            class="w-full flex align-items-center py-5 border-300 border-bottom-1 no-underline"
          >
            <span
              class="flex justify-content-center align-items-center bg-cyan-400 border-round"
              style="height: 3.5rem; width: 3.5rem"
            >
              <i class="text-50 pi pi-fw pi-home text-2xl"></i>
            </span>
            <span class="ml-4 flex flex-column">
              <span class="text-900 lg:text-xl font-medium mb-0 block">Go home</span>
              <span class="text-600 lg:text-xl">to continue shopping.</span>
            </span>
          </router-link>
          <router-link
            to="/user"
            class="w-full flex align-items-center py-5 border-300 border-bottom-1 no-underline"
          >
            <span
              class="flex justify-content-center align-items-center bg-orange-400 border-round"
              style="height: 3.5rem; width: 3.5rem"
            >
              <i class="pi pi-fw pi-user text-50 text-2xl"></i>
            </span>
            <span class="ml-4 flex flex-column">
              <span class="text-900 lg:text-xl font-medium mb-0">Go to your account</span>
              <span class="text-600 lg:text-xl">to check your orders.</span>
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
