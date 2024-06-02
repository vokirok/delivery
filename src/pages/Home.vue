<script setup>
import { ref, onMounted } from 'vue';
import { useFirestore, useCollection, useDocument } from 'vuefire';
import { collection, doc, setDoc } from 'firebase/firestore';

const firestore = useFirestore();
const products = useCollection(collection(firestore, 'products'));

const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
  { label: 'Price High to Low', value: '!price' },
  { label: 'Price Low to High', value: 'price' },
]);

const onSortChange = (event) => {
  const value = event.value.value;
  const sortValue = event.value;

  if (value.indexOf('!') === 0) {
    sortOrder.value = -1;
    sortField.value = value.substring(1, value.length);
    sortKey.value = sortValue;
  } else {
    sortOrder.value = 1;
    sortField.value = value;
    sortKey.value = sortValue;
  }
};

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
      <DataView
        :value="products"
        :layout="layout"
        :paginator="true"
        :rows="9"
        :sortOrder="sortOrder"
        :sortField="sortField"
      >
        <template #header>
          <div class="grid grid-nogutter">
            <div class="col-6 text-left">
              <Dropdown
                v-model="sortKey"
                :options="sortOptions"
                optionLabel="label"
                placeholder="Sort By Price"
                @change="onSortChange($event)"
              />
            </div>
            <div class="col-6 text-right">
              <DataViewLayoutOptions v-model="layout" />
            </div>
          </div>
        </template>

        <template #list="slotProps">
          <div class="grid grid-nogutter">
            <div v-for="(product, index) in slotProps.items" :key="product.id" class="col-12">
              <div
                class="flex flex-column sm:flex-row sm:align-items-center p-4 gap-3"
                :class="{ 'border-top-1 surface-border': index !== 0 }"
              >
                <div class="md:w-10rem relative">
                  <ProductImage
                    :product
                    imageClass="block xl:block mx-auto border-round w-full"
                    preview
                  />
                  <Tag
                    :value="product.inventoryStatus"
                    :severity="getSeverity(product)"
                    class="absolute"
                    style="left: 4px; top: 4px"
                  ></Tag>
                </div>

                <div
                  class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4"
                >
                  <div
                    class="flex flex-row md:flex-column justify-content-between align-items-start gap-2"
                  >
                    <div>
                      <span class="font-medium text-secondary text-sm">{{ product.category }}</span>
                      <router-link :to="`/product/${product.id}`" class="no-underline">
                        <div class="text-lg font-medium text-900 mt-2">{{ product.name }}</div>
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
                  <div class="flex flex-column md:align-items-end gap-5">
                    <span class="text-xl font-semibold text-900">${{ product.price }}</span>
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <!-- <Button icon="pi pi-heart" outlined></Button> -->
                      <Button
                        icon="pi pi-shopping-cart"
                        label="Buy Now"
                        :disabled="product.inventoryStatus === 'OUTOFSTOCK'"
                        class="flex-auto md:flex-initial white-space-nowrap"
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

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
                    <span class="text-2xl font-semibold text-900">${{ product.price }}</span>
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
