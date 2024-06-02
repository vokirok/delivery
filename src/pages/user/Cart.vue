<script setup>
import { useCart } from '@/composables/cart';
import { numProductsInRussian } from '@/utils';

const { cart, cartSumm, removeFromCart, clearCart, makeOrder } = useCart();

function getCartSummary() {
  return `Всего ${numProductsInRussian(cart.value.length)} на сумму ${cartSumm.value} руб.`;
}

async function makeOrder2() {
  makeOrder((orderNum) => {
    console.log(`Order #${orderNum} completed`);
  });
}
</script>

<template>
  <section>
    <DataTable :value="cart" showGridlines tableStyle="min-width: 30rem">
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">Корзина</span>
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
