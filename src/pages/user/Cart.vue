<script setup>
import { useCart } from '@/composables/cart';
import { numProductsInRussian } from '@/utils';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const { cart, cartSumm, removeFromCart, clearCart, makeOrder } = useCart();

function getCartSummary() {
  return `Всего ${numProductsInRussian(cart.value.length)} на сумму ${cartSumm.value} руб.`;
}

async function makeOrder2() {
  makeOrder((orderNum, sum) => {
    router.push('/');
    toast.add({
      severity: 'success',
      summary: `Заказ ${orderNum} на сумму ${sum} руб. успешно оформлен`,
      detail: 'Спасибо за заказ!',
      life: 3000,
    });
  });
}
</script>

<template>
  <section>
    <DataTable :value="cart" showGridlines tableStyle="min-width: 30rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Корзина</span>
          <Button
            icon="pi pi-times"
            severity="danger"
            label="Очистить корзину"
            @click="clearCart"
          />
        </div>
      </template>
      <Column field="id" header="№"></Column>
      <Column field="name" header="Товар"></Column>
      <Column field="price" header="Цена"></Column>
      <Column>
        <template #body="slotProps">
          <Button
            type="button"
            icon="pi pi-times"
            text
            outlined
            severity="danger"
            label="Убрать"
            @click="() => removeFromCart(slotProps.data)"
          />
        </template>
      </Column>
      <template #footer>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          {{ getCartSummary() }}
          <Button
            icon="pi pi-check-square"
            severity="success"
            label="Оформить"
            @click="makeOrder2"
          />
        </div>
      </template>
    </DataTable>
  </section>
</template>
