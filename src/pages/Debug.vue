<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { useCurrentUser, useFirestore, useCollection, useDocument } from 'vuefire';
import { collection, doc, getDoc, setDoc, onSnapshot, where, query } from 'firebase/firestore';

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

const cart = ref(new Set());

const cartItems = computed(() => {
  return Array.from(cart.value);
});

function updateCart() {
  if (user.value) {
    collection(firestore, 'products');

    setDoc(doc(firestore, 'cart', String(user.value.uid)), { cart: Array.from(cart.value) });
  }
}

function addToCart(product) {
  cart.value.add(product);
  updateCart();
}

function removeFromCart(product) {
  cart.value.delete(product);
  updateCart();
}

// const cartInFirebase = useCollection(collection(firestore, 'cart', user.value.uid));

function checkout() {
  if (user.value) {
    console.log(user.value.uid);
  }
}

// let unsubscribe = null;

watchEffect(() => {
  if (user.value) {
    console.log(`watchEffect: ${user.value.uid}`);

    getDoc(doc(firestore, 'cart', String(user.value.uid))).then((doc) => {
      if (doc) {
        const data = doc.data();
        if (data) {
          const c = data.cart;
          if (c) {
            cart.value = new Set(doc.data().cart);
          }
        }
        console.log('Doc exists:');
        console.log(doc);
        console.log(data);
        // cart.value = new Set(doc.data().cart);
      } else {
        console.log('Doc is not exists');
      }
    });

    // const q = query(collection(firestore, 'cart'), where('uid', '==', user.value.uid));

    // unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const cart = [];
    //   querySnapshot.forEach((doc) => {
    //     // cart.push(doc.data().name);
    //     console.log(cart);
    //   });
    //   // console.log('Current cities in CA: ', cart.join(', '));
    // });
  }
});

onBeforeUnmount(() => {
  // if (unsubscribe) {
  //   unsubscribe();
  // }
});
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
    />
    <Button
      :label="`Создать ${numTestProducts} случайных тестовых продукта и скачать как 'product.json'`"
      @click="generateJsonAndDownload"
      severity="secondary"
    />
    <Button
      label="Загрузить тестовые продукты из 'product.json' в Firebase"
      @click="uploadJsonToFirebase"
      severity="secondary"
    />

    <Divider />

    <p v-if="user">{{ user.displayName }}</p>

    <DataTable :value="cartItems" showGridlines tableStyle="min-width: 30rem">
      <Column field="id" header="Id"></Column>
      <Column field="name" header="Name"></Column>
    </DataTable>

    <Divider />

    <!-- <ProductImage :product="productToDisplay" width="250" preview /> -->

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
          <div class="flex flex-column md:align-items-end gap-5">
            <span class="text-xl font-semibold text-900">${{ slotProps.data.price }}</span>
            <div v-if="cart.has(slotProps.data)" class="flex flex-row-reverse md:flex-row gap-2">
              <Button
                icon="pi pi-times-circle"
                v-tooltip="`Remove from cart`"
                outlined
                severity="danger"
                @click="() => removeFromCart(slotProps.data)"
              ></Button>
              <Button
                icon="pi pi-check-square"
                label="Checkout"
                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
                class="flex-auto md:flex-initial white-space-nowrap"
                severity="success"
                @click="() => checkout()"
                cla
              ></Button>
            </div>
            <div v-else class="flex flex-row-reverse md:flex-row gap-2">
              <Button
                icon="pi pi-cart-arrow-down"
                label="Add to cart"
                :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
                class="flex-auto md:flex-initial white-space-nowrap"
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
