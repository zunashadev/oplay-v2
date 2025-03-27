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
  <div class="px-3 py-3">
    <div
      class="mt-2 flex items-start justify-between gap-2 rounded-lg p-4 text-sm text-white"
      :class="error ? 'bg-red-500' : 'bg-green-500'"
    >
      <div class="flex flex-col gap-1">
        <p class="text-sm font-medium">{{ message }}</p>
        <p v-if="error" class="text-xs font-normal">{{ error }}</p>
      </div>
      <div
        @click="closeAlert"
        class="rounded-md p-1 transition-all hover:cursor-pointer"
        :class="error ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
      >
        <CrossIcon class="size-5" />
      </div>
    </div>
  </div>
</template>
