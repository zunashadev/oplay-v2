<script setup>
import { defineProps, defineEmits } from 'vue';

import CrossIcon from '@/components/icons/Cross.vue';

const props = defineProps({
  message: String,
  error: String,
});

const emit = defineEmits(['close-alert']);

const closeAlert = () => {
  emit('close-alert');
};
</script>

<template>
  <div class="fixed top-20 right-10 z-50 w-80">
    <div
      class="flex flex-col gap-1 rounded-lg p-3 text-sm text-white shadow-lg"
      :class="error ? 'bg-red-500' : 'bg-green-500'"
    >
      <!-- Title -->
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium">{{ message }}</p>
        <div
          @click="closeAlert"
          class="rounded-md p-1 transition-all hover:cursor-pointer"
          :class="error ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
        >
          <CrossIcon class="size-5" />
        </div>
      </div>
      <!-- Description -->
      <div class="">
        <p v-if="error" class="text-xs font-normal">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
