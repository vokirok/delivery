import { ref, reactive } from 'vue';

const testMode = ref(false);

const testUsers = reactive([
  { email: 'test@test.com', password: '123qwe' },
  { email: 'user1@test.com', password: '123qwe' },
  { email: 'user2@test.com', password: '123qwe' },
]);

const noTestUsers = reactive([]);

export function useTestMode() {
  // const testMode = true;
  // const testMode = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  return { testMode, testUsers: testMode ? testUsers : noTestUsers };
}
