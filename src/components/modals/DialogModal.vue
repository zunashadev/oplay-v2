<script setup>
import { ref } from 'vue';

import BaseModalComponent from './BaseModal.vue';

import CrossIcon from '@/components/icons/Cross.vue';

defineProps({
  title: {
    type: String,
    required: false,
    default: 'Judul Modal',
  },
});

// START : MODAL
const baseModalRef = ref(null);

function openModal() {
  baseModalRef.value.openModal();
}

function closeModal() {
  baseModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL
</script>

<template>
  <BaseModalComponent ref="baseModalRef">
    <div class="flex w-full max-w-xl bg-gray-900 text-white">
      <div class="flex w-xl flex-col">
        <!-- Start : Header -->
        <div class="flex items-center justify-between bg-gray-800 px-6 py-5">
          <p class="text-xl font-medium">{{ title }}</p>
          <div
            @click="closeModal"
            class="transform text-gray-600 transition-all duration-200 hover:cursor-pointer hover:text-white"
          >
            <CrossIcon class="size-6" />
          </div>
        </div>
        <!-- End : Header -->

        <!-- Start : Content -->
        <div class="px-6 py-6">
          <slot />
        </div>
        <!-- End : Content -->
      </div>
    </div>
  </BaseModalComponent>
</template>
