<script setup>
import { useFirestore, useDocument } from 'vuefire';
import { doc } from 'firebase/firestore';
import { useRoute } from 'vue-router';

import { useCart } from '@/composables/cart';

const route = useRoute();

const firestore = useFirestore();

const product = useDocument(doc(firestore, 'products', route.params.productId));

const { user, inCart, addToCart, removeFromCart } = useCart();

function getStockTitle(n) {
  switch (n) {
    case 'LOWSTOCK':
      return 'МАЛО';
    default:
      return null;
  }
}
</script>

<template>
  <section
    v-if="product"
    class="flex flex-column align-items-stretch p-4 gap-3 mx-auto"
    style="width: 450px"
  >
    <div class="relative flex flex-column align-items-center">
      <ProductImage :product width="400" imageClass="mx-auto border-round" preview />
      <Tag
        v-if="product.inventoryStatus === 'LOWSTOCK'"
        :value="getStockTitle(product.inventoryStatus)"
        severity="warning"
        class="absolute"
        style="left: 4px; top: 4px"
      ></Tag>
    </div>
    <div class="relative flex flex-column justify-content-between flex-1 gap-4 w-auto">
      <div class="absolute surface-100 p-1" style="border-radius: 30px; right: 4px; top: 8px">
        <div
          class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2"
          style="
            border-radius: 30px;
            box-shadow:
              0px 1px 2px 0px rgba(0, 0, 0, 0.04),
              0px 1px 2px 0px rgba(0, 0, 0, 0.06);
          "
        >
          <span class="text-900 font-medium text-sm">{{ product.rating }}</span>
          <i class="pi pi-star-fill text-yellow-500"></i>
        </div>
      </div>

      <div class="flex flex-column justify-content-between align-items-start gap-2">
        <div class="text-lg font-medium text-900 mt-2">{{ product.name }}</div>
        <div class="font-medium text-secondary text-color-secondary text-sm">
          {{ product.category }}
        </div>
        <div class="font-medium text-secondary">{{ product.description }}</div>
      </div>

      <div class="flex flex-column gap-2">
        <span class="text-xl font-semibold text-900">{{ product.price }} руб.</span>
        <div class="flex flex-row gap-2">
          <div v-if="inCart(product)" class="flex flex-auto flex-row gap-2">
            <router-link
              to="/user/cart"
              class="no-underline flex-auto white-space-nowrap flex flex-row"
            >
              <Button
                icon="pi pi-check-square"
                label="Оформить заказ"
                class="flex-auto white-space-nowrap"
                severity="success"
              />
            </router-link>
            <Button
              icon="pi pi-times"
              v-tooltip.left="'Убрать из корзины'"
              outlined
              severity="danger"
              @click="() => removeFromCart(product)"
            />
          </div>
          <div v-else-if="user" class="flex flex-row flex-auto gap-2">
            <Button
              icon="pi pi-cart-arrow-down"
              label="Добавить в корзину"
              class="flex flex-auto white-space-nowrap"
              @click="() => addToCart(product)"
            ></Button>
          </div>
          <div v-else class="flex flex-row flex-auto gap-2">
            <router-link to="/signin" class="flex flex-auto white-space-nowrap no-underline">
              <Button
                icon="pi pi-cart-arrow-down"
                label="Добавить в корзину"
                class="flex-auto white-space-nowrap"
              ></Button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- <Divider /> -->

  <article v-if="false">
    <!-- <h2>Product {{ $route.params.productId }}</h2> -->
    <h2>Product {{ $route.params.productId }}</h2>
    <div v-if="product">
      <hr />
      <!-- <p>{{ product }}</p> -->
      <p>{{ product.id }}</p>
      <p>{{ product.name }}</p>
      <p>{{ product.description }}</p>
      <p>{{ product.price }}</p>
      <p>{{ product.category }}</p>
      <p>{{ product.inventoryStatus }}</p>
      <p>{{ product.rating }}</p>

      <ProductImage :product width="250" preview />
      <!-- <Image :src="`/products/${product.id}.jpg`" :alt="product.name" width="250" preview /> -->

      <div v-if="inCart(product)" class="flex flex-row gap-2">
        <router-link
          to="/user/cart"
          class="no-underline flex-auto white-space-nowrap flex flex-row gap-2"
        >
          <Button
            icon="pi pi-check-square"
            label="Checkout"
            :disabled="product.inventoryStatus === 'OUTOFSTOCK'"
            class="flex-auto white-space-nowrap"
            severity="success"
          />
        </router-link>
        <!-- @click="checkout" -->
        <Button
          icon="pi pi-times"
          v-tooltip.left="`Remove from cart`"
          outlined
          severity="danger"
          @click="() => removeFromCart(product)"
        />
      </div>
      <div v-else class="flex flex-row gap-2">
        <Button
          icon="pi pi-cart-arrow-down"
          label="В корзину"
          :disabled="product.inventoryStatus === 'OUTOFSTOCK'"
          class="flex-auto white-space-nowrap"
          @click="() => addToCart(product)"
        ></Button>
        <!-- <Button icon="pi pi-heart" outlined></Button> -->
      </div>
    </div>
  </article>
</template>
