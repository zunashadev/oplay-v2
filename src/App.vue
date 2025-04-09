<script setup>
import { RouterView } from 'vue-router';

// Components
import ToastListComponent from '@/components/toasts/ToastList.vue';
</script>

<template>
  <ToastListComponent />
  <RouterView />
</template>
