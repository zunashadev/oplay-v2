<script setup>
import { ref } from 'vue';

// Components
import BaseModalComponent from './BaseModal.vue';
import ButtonComponent from '../buttons/Button.vue';

// Icons
import CrossIcon from '../icons/Cross.vue';

// Props
defineProps({
  title: {
    type: String,
    default: 'Konfirmasi',
  },
  message: {
    type: String,
    default: 'Apakah kamu yakin ingin melanjutkan tindakan ini?',
  },
  confirmText: {
    type: String,
    default: 'Ya',
  },
  cancelText: {
    type: String,
    default: 'Batal',
  },
  danger: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['confirm', 'cancel']);

// Base Modal
const baseModalRef = ref(null);

function openModal() {
  baseModalRef.value.openModal();
}

function closeModal() {
  baseModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });

// Button Handle
function handleConfirm() {
  emit('confirm');
  closeModal();
}

function handleCancel() {
  emit('cancel');
  closeModal();
}
</script>

<template>
  <BaseModalComponent ref="baseModalRef">
    <div class="flex w-full max-w-xl bg-gray-900 text-white">
      <div class="flex w-xl flex-col">
        <!-- Start : Title -->
        <div class="flex items-center justify-between px-6 py-5">
          <div class="flex items-center gap-3">
            <slot name="icon" />
            <p class="text-lg font-semibold">{{ title }}</p>
          </div>
          <button @click="closeModal">
            <CrossIcon
              class="size-5 text-gray-500 transition-all hover:cursor-pointer hover:text-white"
            />
          </button>
        </div>
        <!-- End : Title -->

        <!-- Start : Content -->
        <div class="px-6 py-5">
          <p class="text-sm text-gray-300">{{ message }}</p>
        </div>
        <!-- End : Content -->

        <!-- Start : Button -->
        <div class="flex justify-end px-6 py-5">
          <div class="flex gap-3">
            <ButtonComponent @click="handleCancel" variant="outline">
              {{ cancelText }}
            </ButtonComponent>
            <ButtonComponent v-if="danger" @click="handleConfirm" color="red">
              {{ confirmText }}
            </ButtonComponent>
            <ButtonComponent v-else @click="handleConfirm">
              {{ confirmText }}
            </ButtonComponent>
          </div>
        </div>
        <!-- End : Button -->
      </div>
    </div>
  </BaseModalComponent>
</template>
