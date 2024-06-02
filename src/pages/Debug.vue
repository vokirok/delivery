<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { useCurrentUser, useFirestore, useCollection, useDocument } from 'vuefire';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  where,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { useCart } from '@/composables/cart';

const firestore = useFirestore();

const user = useCurrentUser();
const products = useCollection(collection(firestore, 'products'));

const numTestProducts = 52;

function getRandomPrice() {
  return Math.floor(Math.random() * 100000) / 100;
}

function getRandomCategory() {
  const categories = ['Accessories', 'Fitness', 'Clothing', 'Electronics', 'Food'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomRating() {
  return Math.floor(Math.random() * 5);
}

function getRandomInStock() {
  const availability = ['INSTOCK', 'LOWSTOCK'];
  return availability[Math.floor(Math.random() * availability.length)];
}

function generateTestProducts() {
  const testProducts = [];
  for (let i = 1; i <= numTestProducts; ++i) {
    data.push({
      id: i,
      name: `Our Product #${i}`,
      description: `Our Product #${i} long description`,
      price: getRandomPrice(),
      category: getRandomCategory(),
      inventoryStatus: getRandomInStock(),
      rating: getRandomRating(),
    });
  }
  return testProducts;
}

async function jsonToFirebase(testProducts) {
  testProducts.forEach(async (product) => {
    await setDoc(doc(firestore, 'products', String(product.id)), product);
  });
}

async function generateJsonAndUploadToFirebase() {
  const testProducts = generateTestProducts();
  await jsonToFirebase(testProducts);
}

function generateJsonAndDownload() {
  const testProducts = generateTestProducts();

  let dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(testProducts, null, 4));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', 'products.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

async function uploadJsonToFirebase() {
  fetch('/products.json', { headers: { 'Cache-Control': 'no-cache' } })
    .then((res) => res.json())
    .then(jsonToFirebase);
}

// const productToDisplay = ref({ id: 52, name: 'The product' });

const { cart, cartSumm, inCart, addToCart, removeFromCart, clearCart } = useCart();

async function checkout() {
  if (user.value) {
    const timestamp = Date.now();
    const order = {
      items: Array.from(cart.value),
      timestamp,
      sum: cartSumm.value,
      user: { id: user.value.uid, email: user.value.email, name: user.value.displayName },
    };
    // setDoc(doc(firestore, 'cart', String(user.value.uid)), { cart: Array.from(cart.value) });
    const newOrderRef = doc(collection(firestore, String(user.value.uid)), String(timestamp));
    await setDoc(newOrderRef, order);
  }
}

const unsubscribe = [];

watchEffect(() => {
  if (user.value) {
    // getDoc(doc(firestore, 'cart', String(user.value.uid))).then((doc) => {
    //   if (doc) {
    //     const data = doc.data();
    //     if (data && data.cart) {
    //       cart.value = Array.from(data.cart);
    //     }
    //   }
    // });

    // const unsCart = onSnapshot(doc(firestore, 'cart', String(user.value.uid)), (doc) => {
    //   const data = doc.data();
    //   if (data && data.cart) {
    //     cart.value = Array.from(data.cart);
    //   }
    // });
    // unsubscribe.push(unsCart);

    const unsOrders = onSnapshot(collection(firestore, String(user.value.uid)), (col) => {
      orders.value.length = 0;
      col.forEach((doc) => {
        const data = doc.data();
        if (data && data.timestamp) {
          orders.value.push(data);
        }
      });
    });
    unsubscribe.push(unsOrders);
  }
});

onBeforeUnmount(() => {
  unsubscribe.forEach((uns) => uns());
  unsubscribe.length = 0;
});

const orders = ref([]);

function cancelOrder(order) {
  if (user.value) {
    deleteDoc(doc(firestore, String(user.value.uid), String(order.timestamp)));
  }
}
</script>

<template>
  <section class="flex flex-column gap-2 p-2">
    <h1>Страница для отладочных целей</h1>
    <router-link to="/" class="pb-4">
      <Button label="На главную" icon="pi pi-home" severity="success" />
    </router-link>

    <Button
      :label="`Создать ${numTestProducts} случайных тестовых продукта сразу в Firebase`"
      @click="generateJsonAndUploadToFirebase"
      severity="secondary"
      size="small"
    />
    <Button
      :label="`Создать ${numTestProducts} случайных тестовых продукта и скачать как 'product.json'`"
      @click="generateJsonAndDownload"
      severity="secondary"
      size="small"
    />
    <Button
      label="Загрузить тестовые продукты из 'product.json' в Firebase"
      @click="uploadJsonToFirebase"
      severity="secondary"
      size="small"
    />

    <Divider />

    <p v-if="user">{{ user.displayName }}</p>

    <DataTable :value="orders" showGridlines tableStyle="min-width: 30rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Orders</span>
          <!-- <Button icon="pi pi-times" severity="danger" label="Clear cart" @click="clearCart" /> -->
        </div>
      </template>
      <Column field="timestamp" header="Date">
        <template #body="slotProps">{{
          new Date(slotProps.data.timestamp).toLocaleString('ru-RU')
        }}</template>
      </Column>
      <Column field="items" header="Items">
        <template #body="slotProps">{{ slotProps.data.items.length }}</template>
      </Column>
      <Column field="sum" header="Sum">
        <template #body="slotProps">${{ slotProps.data.sum }}</template>
      </Column>
      <Column>
        <template #body="slotProps">
          <router-link :to="`/user/order/${slotProps.data.timestamp}`">
            <Button type="button" text outlined label="View" />
          </router-link>
        </template>
        <!-- @click="() => viewOrder(slotProps.data)" -->
      </Column>
    </DataTable>

    <Divider />

    <DataTable :value="cart" showGridlines tableStyle="min-width: 30rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Cart</span>
          <Button icon="pi pi-times" severity="danger" label="Clear cart" @click="clearCart" />
        </div>
      </template>
      <Column field="id" header="Id"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="price" header="Price"></Column>
      <Column>
        <template #body="slotProps">
          <Button
            type="button"
            icon="pi pi-times"
            text
            outlined
            severity="danger"
            label="Remove"
            @click="() => removeFromCart(slotProps.data)"
          />
        </template>
      </Column>
      <template #footer>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          Products in cart: {{ cart ? cart.length : 0 }} (${{ cartSumm }})
          <Button icon="pi pi-check-square" severity="success" label="Checkout" @click="checkout" />
        </div>
      </template>
    </DataTable>

    <Divider />

    <!-- <ProductImage :product="productToDisplay" width="250" preview /> -->

    <!-- scrollable
      scrollHeight="300px" -->
    <DataTable :value="products" showGridlines tableStyle="min-width: 30rem">
      <Column field="id" header="Id"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <ProductImage :product="slotProps.data" imageClass="w-6rem border-round" preview />
        </template>
      </Column>
      <Column field="name" header="Name">
        <template #body="slotProps">
          <div>
            <span class="font-medium text-secondary text-sm">{{ slotProps.data.category }}</span>
            <router-link :to="`/product/${slotProps.data.id}`" class="no-underline">
              <div class="text-lg font-medium text-900 mt-2">{{ slotProps.data.name }}</div>
            </router-link>
            <Rating :modelValue="slotProps.data.rating" readonly :cancel="false" />
          </div>
        </template>
      </Column>
      <Column field="price" header="Price">
        <template #body="slotProps">
          <div class="flex flex-column md:align-items-start gap-5">
            <span class="text-xl font-semibold text-900">${{ slotProps.data.price }}</span>
            <div v-if="inCart(slotProps.data)" class="flex flex-row gap-2">
              <Button
                icon="pi pi-check-square"
                label="Checkout"
                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
                class="flex-auto white-space-nowrap"
                severity="success"
                @click="checkout"
              />
              <Button
                icon="pi pi-times"
                v-tooltip.left="`Remove from cart`"
                outlined
                severity="danger"
                @click="() => removeFromCart(slotProps.data)"
              />
            </div>
            <div v-else class="flex flex-row gap-2">
              <Button
                icon="pi pi-cart-arrow-down"
                label="Add to cart"
                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
                class="flex-auto white-space-nowrap"
                @click="() => addToCart(slotProps.data)"
              ></Button>
              <!-- <Button icon="pi pi-heart" outlined></Button> -->
            </div>
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- <div v-for="product in products" :key="product.id">
        <router-link :to="`/product/${product.id}`">{{ product.name }}</router-link>
        <span>{{ product.price }}</span>
      </li> -->
  </section>
</template>
