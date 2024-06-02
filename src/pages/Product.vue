<script setup>
import { useFirestore, useCollection, useDocument } from 'vuefire';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useRoute } from 'vue-router';

import { useCart } from '@/composables/cart';

const route = useRoute();

const firestore = useFirestore();

const product = useDocument(doc(firestore, 'products', route.params.productId));

const { inCart, addToCart, removeFromCart } = useCart();

// const product = ref(null);
// console.log(route.params.productId);
// const docRef = doc(firestore, 'products', route.params.productId);
// getDoc(docRef).then((docSnap) => {
//   console.log('---');
//   if (docSnap.exists()) {
//     console.log('Document data:', docSnap.data());
//     product.value = docSnap;
//   } else {
//     // docSnap.data() will be undefined in this case
//     console.log('No such document!');
//   }
// });
</script>

<template>
  <article v-if="product">
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
        <router-link to="/user/cart" class="no-underline">
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
          label="Add to cart"
          :disabled="product.inventoryStatus === 'OUTOFSTOCK'"
          class="flex-auto white-space-nowrap"
          @click="() => addToCart(product)"
        ></Button>
        <!-- <Button icon="pi pi-heart" outlined></Button> -->
      </div>
    </div>
  </article>
</template>
