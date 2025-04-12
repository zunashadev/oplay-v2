<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import BaseModalComponent from '@/components/modals/BaseModal.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

import CompletedIllustration from '@/components/illustrations/Completed.vue';

const router = useRouter();

// START : MODAL
const baseModalRef = ref(null);

function openModal() {
  baseModalRef.value.openModal();
}

function closeModal() {
  baseModalRef.value.closeModal();
}

function handlePaymentSuccessModalClose() {
  router.push({ name: 'CustomerDashboardHome' });
}

defineExpose({ openModal, closeModal });
defineEmits(['close']);
// END : MODAL
</script>

<template>
  <BaseModalComponent ref="baseModalRef" @close="handlePaymentSuccessModalClose">
    <div class="flex w-full max-w-xl bg-gray-900 text-white">
      <div class="flex w-xl flex-col items-center gap-10 px-6 py-16">
        <div class="py-5">
          <CompletedIllustration class="h-48" />
        </div>
        <div class="flex flex-col items-center gap-10">
          <div class="flex flex-col gap-3 text-center">
            <p class="text-2xl font-semibold">Anda sudah mengunggah bukti pembayaran!</p>
            <p class="text-sm font-normal text-gray-500">
              Pantau status pesanan pada dashboard anda
            </p>
          </div>
          <ButtonComponent @click="closeModal" type="button" textColor="black">
            Buka Dashboard
          </ButtonComponent>
        </div>
      </div>
    </div>
  </BaseModalComponent>
</template>
