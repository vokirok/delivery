import { ref, reactive } from 'vue';

const testMode = ref(false);

const testUsers = reactive([
  { email: 'test@test.com', password: '123qwe', name: 'Дорогой покупатель' },
  { email: 'vasily@test.com', password: '123456', name: 'Василий Муркин' },
  { email: 'polina@test.com', password: '123456', name: 'Полина Широкова' },
]);

const noTestUsers = reactive([]);

export function useTestMode() {
  // const testMode = true;
  // const testMode = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  return { testMode, testUsers: testMode ? testUsers : noTestUsers };
}
