<script setup>
import { ref, onMounted } from 'vue';
import { useFirestore, useCollection, useDocument } from 'vuefire';
import { collection, doc, setDoc } from 'firebase/firestore';

const firestore = useFirestore();
const products = useCollection(collection(firestore, 'products'));

const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warning';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
};
</script>

<template>
  <section class="flex flex-column gap-2">
    <h1>Home</h1>
    <div class="card">
      <DataView :value="products" layout="grid" :paginator="true" :rows="9">
        <template #grid="slotProps">
          <div class="grid grid-nogutter">
            <div
              v-for="(product, index) in slotProps.items"
              :key="product.id"
              class="col-12 sm:col-6 md:col-4 p-2"
            >
              <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
                <div class="surface-50 flex justify-content-center border-round p-3">
                  <div class="relative mx-auto">
                    <ProductImage
                      :product
                      imageClass="border-round w-full"
                      imageStyle="max-width: 300px"
                      preview
                    />
                    <Tag
                      :value="product.inventoryStatus"
                      :severity="getSeverity(product)"
                      class="absolute"
                      style="left: 4px; top: 4px"
                    ></Tag>
                  </div>
                </div>
                <div class="pt-4">
                  <div class="flex flex-row justify-content-between align-items-start gap-2">
                    <div>
                      <span class="font-medium text-secondary text-sm">{{ product.category }}</span>
                      <router-link :to="`/product/${product.id}`" class="no-underline">
                        <div class="text-lg font-medium text-900 mt-1">
                          {{ product.name }}
                        </div>
                      </router-link>
                    </div>
                    <div class="surface-100 p-1" style="border-radius: 30px">
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
                  </div>
                  <div class="flex flex-column gap-4 mt-4">
                    <span class="text-2xl font-semibold text-900">{{ product.price }} руб.</span>
                    <div class="flex gap-2">
                      <Button
                        icon="pi pi-shopping-cart"
                        label="Buy Now"
                        :disabled="product.inventoryStatus === 'OUTOFSTOCK'"
                        class="flex-auto white-space-nowrap"
                      ></Button>
                      <!-- <Button icon="pi pi-heart" outlined></Button> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </section>
</template>
