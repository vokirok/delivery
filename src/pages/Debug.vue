<script setup>
import { ref } from 'vue';
import { useFirestore, useCollection, useDocument } from 'vuefire';
import { collection, doc, setDoc } from 'firebase/firestore';

const firestore = useFirestore();

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

const productToDisplay = ref({ id: 52, name: 'The product' });
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

    <ProductImage :product="productToDisplay" width="250" preview />

    <ul>
      <li v-for="product in products" :key="product.id">
        <router-link :to="`/product/${product.id}`">{{ product.name }}</router-link>
        <span>{{ product.price }}</span>
      </li>
    </ul>
  </section>
</template>
