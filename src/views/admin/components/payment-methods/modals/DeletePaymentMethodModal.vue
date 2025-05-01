<script setup>
import { ref, onMounted } from 'vue';

// 📌 Stores
import { usePaymentMethodStore } from '@/stores/paymentMethodStore';

// 📌 Components
import ConfirmModalComponent from '@/components/modals/ConfirmModal.vue';

// 📌 Icons
import TriangleWarningIcon from '@/components/icons/TriangleWarning.vue';

// 📌...
const paymentMethodStore = usePaymentMethodStore();

// 📌 ...
const selectedPaymentMethodId = ref('');

// START : Modal
const confirmModalRef = ref(null);

function openModal(paymentMethodId) {
  selectedPaymentMethodId.value = paymentMethodId;
  confirmModalRef.value.openModal();
}

function closeModal() {
  selectedPaymentMethodId.value = '';
  confirmModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : Modal

// START : Handle Button
const handleConfirm = async () => {
  await paymentMethodStore.deletePaymentMethod(selectedPaymentMethodId.value);
  closeModal();
};

function handleCancel() {
  closeModal();
}
// END : Handle Button
</script>

<template>
  <ConfirmModalComponent
    ref="confirmModalRef"
    title="Hapus Metode Pembayaran"
    message="Apakah anda yakin untuk menghapus metode pembayaran ini?"
    confirmText="Hapus"
    cancelText="Batal"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    danger
  >
    <template #icon>
      <TriangleWarningIcon class="size-8 text-red-500" />
    </template>
  </ConfirmModalComponent>
</template>
