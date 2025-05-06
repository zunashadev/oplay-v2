<script setup>
import { ref } from 'vue';

// 📌 Stores
import { useDeliveryTypeStore } from '@/stores/deliveryTypeStore';

// 📌 Components
import ConfirmModalComponent from '@/components/modals/ConfirmModal.vue';

// 📌 Icons
import TriangleWarningIcon from '@/components/icons/TriangleWarning.vue';

// 📌 Inisialisasi Stores
const deliveryTypeStore = useDeliveryTypeStore();

// 📌 ...
const selectedDeliveryTypeId = ref('');

// START : Modal
const confirmModalRef = ref(null);

function openModal(deliveryTypeId) {
  selectedDeliveryTypeId.value = deliveryTypeId;
  confirmModalRef.value.openModal();
}

function closeModal() {
  selectedDeliveryTypeId.value = '';
  confirmModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : Modal

// START : Handle Button
const handleConfirm = async () => {
  await deliveryTypeStore.deleteDeliveryType(selectedDeliveryTypeId.value);
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
    title="Hapus Metode Pengiriman"
    message="Apakah anda yakin untuk menghapus metode pengiriman ini?"
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
