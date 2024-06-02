<script setup>
import { ref, onBeforeUnmount, watchEffect } from 'vue';
import { useCurrentUser, useFirestore } from 'vuefire';
import { collection, onSnapshot } from 'firebase/firestore';

import { numProductsInRussian } from '@/utils';

const firestore = useFirestore();
const user = useCurrentUser();

const orders = ref([]);

let unsubscribe = null;

watchEffect(() => {
  if (user.value) {
    unsubscribe = onSnapshot(collection(firestore, String(user.value.uid)), (col) => {
      orders.value.length = 0;
      col.forEach((doc) => {
        const data = doc.data();
        if (data && data.timestamp) {
          orders.value.push(data);
        }
      });
    });
  }
});

onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
});
</script>

<template>
  <section v-if="user">
    <DataTable :value="orders" showGridlines tableStyle="min-width: 30rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Заказы</span>
        </div>
      </template>

      <Column field="timestamp" header="Заказ">
        <template #body="slotProps">
          <div class="flex flex-row justify-content-between align-items-start gap-2">
            <div>
              <router-link :to="`/user/order/${slotProps.data.timestamp}`" class="no-underline">
                <div class="text-lg font-medium text-900 mt-1">#{{ slotProps.data.timestamp }}</div>
              </router-link>
              <span class="font-medium text-secondary text-sm"
                >от {{ new Date(slotProps.data.timestamp).toLocaleString('ru-RU') }}</span
              >
            </div>
          </div>
        </template>
      </Column>

      <Column field="items" header="Количество">
        <template #body="slotProps">{{
          numProductsInRussian(slotProps.data.items.length)
        }}</template>
      </Column>
      <Column field="sum" header="Сумма заказа">
        <template #body="slotProps">{{ slotProps.data.sum }} руб.</template>
      </Column>
    </DataTable>
  </section>
  <section v-else>
    <p>Пожалуйста, авторизуйтесь, для посмотра списка заказов.</p>
  </section>
</template>
