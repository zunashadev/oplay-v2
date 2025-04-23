<script setup>
import { useToastStore } from '@/stores/toastStore';
import Toast from './Toast.vue';

const toast = useToastStore();
</script>

<template>
  <div class="fixed top-16 right-10 z-[100] flex flex-col gap-3">
    <Toast
      v-for="item in toast.toasts"
      :key="item.id"
      :message="item.message"
      :error="item.error"
      :duration="item.duration"
      @close-alert="toast.removeToast(item.id)"
    />
  </div>
</template>
