<script setup>
import { ref } from 'vue';

const props = defineProps(['product', 'width', 'height', 'preview', 'imageClass', 'imageStyle']);

const url = ref(`/products/${props.product.id}.jpg`);
const shouldPreview = ref(props.preview);

async function checkProductImage() {
  try {
    let response = await fetch(url.value, {
      method: 'HEAD',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) {
      const ct = response.headers.get('Content-Type');
      if (!(ct && ct.startsWith('image/'))) {
        url.value = '/noimage.jpg';
        shouldPreview.value = false;
      }
    }
  } catch {
    url.value = '/noimage.jpg';
    shouldPreview.value = false;
  }
}

checkProductImage();
</script>

<template>
  <Image
    :src="url"
    :alt="product.name"
    :width="props.width"
    :height="props.height"
    :preview="shouldPreview"
    :imageClass
    :imageStyle
  />
</template>
