<script setup>
import { useToastStore } from '@/stores/toastStore';
import Toast from './Toast.vue';

const toast = useToastStore();
</script>

<template>
  <!-- <div class="fixed top-28 right-24 z-[100] flex flex-col gap-3"> -->
  <div
    class="fixed top-20 right-auto left-1/2 z-[100] flex w-[90%] -translate-x-1/2 flex-col gap-1.5 sm:top-24 sm:right-16 sm:left-auto sm:w-80 sm:translate-x-0 sm:gap-3"
  >
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
