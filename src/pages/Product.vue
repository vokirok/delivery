<script setup>
import { useFirestore, useCollection, useDocument } from 'vuefire';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useRoute } from 'vue-router';

const route = useRoute();

const firestore = useFirestore();

const product = useDocument(doc(firestore, 'products', route.params.productId));
// console.log(product.value.name);

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
      <p>{{ product.name }}</p>
      <p>{{ product.price }}</p>

      <Image :src="`/products/${product.id}.jpg`" :alt="product.name" width="250" preview />
    </div>
  </article>
</template>
