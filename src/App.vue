<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/authStore';

// const authStore = useAuthStore();

// onMounted(() => {
//   authStore.fetchUser();
// });
</script>

<template>
  <RouterView />
</template>
