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

export function useCart() {
  const firestore = useFirestore();

  const user = useCurrentUser();
  const cart = ref([]);

  let unsubscribe = null;

  watchEffect(() => {
    if (user.value) {
      console.log('CART: watchEffect');
      // getDoc(doc(firestore, 'cart', String(user.value.uid))).then((doc) => {
      //   if (doc) {
      //     const data = doc.data();
      //     if (data && data.cart) {
      //       cart.value = Array.from(data.cart);
      //     }
      //   }
      // });

      unsubscribe = onSnapshot(doc(firestore, 'cart', String(user.value.uid)), (doc) => {
        const data = doc.data();
        if (data && data.cart) {
          cart.value = Array.from(data.cart);
        }
      });
    }
  });

  onBeforeUnmount(() => {
    console.log('CART: onBeforeUnmount');
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  });

  function updateCart() {
    if (user.value) {
      collection(firestore, 'products');

      setDoc(doc(firestore, 'cart', String(user.value.uid)), { cart: Array.from(cart.value) });
    }
  }

  const cartSumm = computed(() => {
    const sum = cart.value.reduce((sum, { price }) => sum + price, 0);
    return Math.round((sum + Number.EPSILON) * 100) / 100;
  });

  function inCart(product) {
    return cart.value.some(({ id }) => product.id === id);
  }

  function addToCart(product) {
    cart.value.push(product);
    updateCart();
  }

  function removeFromCart(product) {
    cart.value = cart.value.filter(({ id }) => product.id !== id);
    updateCart();
  }

  function clearCart() {
    cart.value.length = 0;
    updateCart();
  }

  function checkout() {}

  return { cart, cartSumm, inCart, addToCart, removeFromCart, clearCart };
}
