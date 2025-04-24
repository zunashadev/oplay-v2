<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

// 📌 Stores
import { useAuthStore } from './stores/authStore';

// 📌 Components
import ToastListComponent from '@/components/toasts/ToastList.vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initAuth();
});
</script>

<template>
  <ToastListComponent />
  <RouterView />
</template>
