<script setup>
import { ref, computed } from 'vue';

// 📌 Components
import BaseModalComponent from './BaseModal.vue';

// 📌 Icons
import CrossIcon from '@/components/icons/Cross.vue';

// 📌 Props
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: 'Judul Modal',
  },
  maxWidth: {
    type: String,
    default: 'xl',
    validator: (value) =>
      ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].includes(value),
  },
});

// START : Modal
const baseModalRef = ref(null);

function openModal() {
  baseModalRef.value.openModal();
}

function closeModal() {
  baseModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : Modal
</script>

<template>
  <BaseModalComponent ref="baseModalRef" @close="$emit('close')" :maxWidth="maxWidth">
    <div class="flex w-full bg-gray-900 text-white">
      <div class="flex w-full flex-col">
        <!-- START : Header -->
        <div class="flex items-center justify-between bg-gray-800 px-5 py-5">
          <p class="text-xl font-medium">{{ title }}</p>
          <div
            @click="closeModal"
            class="transform text-gray-600 transition-all duration-200 hover:cursor-pointer hover:text-white"
          >
            <CrossIcon class="size-6" />
          </div>
        </div>
        <!-- END : Header -->

        <!-- START : Content -->
        <div class="w-full px-5 py-5">
          <slot />
        </div>
        <!-- END : Content -->
      </div>
    </div>
  </BaseModalComponent>
</template>
