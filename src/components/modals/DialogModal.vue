<script setup>
import { ref, computed } from 'vue';

import BaseModalComponent from './BaseModal.vue';

import CrossIcon from '@/components/icons/Cross.vue';

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

// Dynamic class binding untuk max-width dan width
const widthClass = computed(() => {
  const map = {
    sm: 'max-w-sm w-sm',
    md: 'max-w-md w-md',
    lg: 'max-w-lg w-lg',
    xl: 'max-w-xl w-xl',
    '2xl': 'max-w-2xl w-2xl',
    '3xl': 'max-w-3xl w-3xl',
    '4xl': 'max-w-4xl w-4xl',
    '5xl': 'max-w-5xl w-5xl',
    '6xl': 'max-w-6xl w-6xl',
    '7xl': 'max-w-7xl w-7xl',
  };
  return `${map[props.maxWidth]}`;
});
</script>

<template>
  <BaseModalComponent ref="baseModalRef" @close="$emit('close')">
    <div class="flex bg-gray-900 text-white" :class="widthClass">
      <div class="flex w-full flex-col">
        <!-- START : Header -->
        <div class="flex items-center justify-between bg-gray-800 px-6 py-5">
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
        <div class="px-6 py-6">
          <slot />
        </div>
        <!-- END : Content -->
      </div>
    </div>
  </BaseModalComponent>
</template>
