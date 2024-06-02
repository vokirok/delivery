<script setup>
import { ref, watchEffect } from 'vue';
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
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import { numProductsInRussian } from '@/utils';

import { useRoute, useRouter } from 'vue-router';

const confirm = useConfirm();
const toast = useToast();
const firestore = useFirestore();
const user = useCurrentUser();
const router = useRouter();
const route = useRoute();
const order = ref(null);

watchEffect(() => {
  if (user.value) {
    getDoc(doc(firestore, String(user.value.uid), route.params.orderId)).then((doc) => {
      if (doc) {
        const data = doc.data();
        if (data && data.timestamp && data.items) {
          order.value = data;
        }
      }
    });
  }
});

function cancelOrder() {
  if (user.value) {
    deleteDoc(doc(firestore, String(user.value.uid), route.params.orderId));
  }
}

function askCancelOrder() {
  confirm.require({
    message: 'Вы действительно хотите отменить заказ?',
    header: 'Удалить заказ?',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Передумал отменять',
    acceptLabel: 'Да, отменить заказ',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      cancelOrder();
      router.push('/');
      toast.add({
        severity: 'success',
        summary: `Заказ ${order.value.timestamp} успешно отменён`,
        detail: 'Но мы ждём Ваши новые заказы.',
        life: 3000,
      });
    },
  });
}

function getOrderSummary() {
  return `Всего ${numProductsInRussian(order.value.items.length)} продуктов на сумму ${order.value.sum} руб.`;
}
</script>

<template>
  <section v-if="user">
    <DataTable v-if="order" :value="order.items" showGridlines tableStyle="min-width: 30rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold"
            >Заказ #{{ order.timestamp }} от {{ new Date(order.timestamp).toLocaleString('ru-RU') }}
          </span>
          <!-- <Button icon="pi pi-times" severity="danger" label="Clear cart" @click="clearCart" /> -->
        </div>
      </template>

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
            <span class="text-xl font-semibold text-900">{{ slotProps.data.price }} руб.</span>
          </div>
        </template>
      </Column>
      <template #footer>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <!-- Всего {{ order.items.length }} продуктов на сумму {{ order.sum }} руб. -->
          {{ getOrderSummary() }}
          <Button
            icon="pi pi-times"
            severity="danger"
            label="Отменить заказ"
            @click="askCancelOrder"
          />
        </div>
      </template>
    </DataTable>

    <p v-else>Заказ не найден.</p>
  </section>
  <section v-else>
    <p>Пожалуйста, авторизуйтесь, для посмотра заказа.</p>
  </section>
</template>
