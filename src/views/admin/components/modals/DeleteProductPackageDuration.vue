<script setup>
import { ref } from 'vue';

// Stores
import { useProductPackageDurationStore } from '@/stores/productPackageDurationStore';

// Components
import ConfirmModalComponent from '@/components/modals/ConfirmModal.vue';

// Icons
import TriangleWarningIcon from '@/components/icons/TriangleWarning.vue';

const productPackageDurationStore = useProductPackageDurationStore();

const selectedProductPackageDurationId = ref('');

// START : Modal
const confirmModalRef = ref(null);

function openModal(productPackageDurationId) {
  selectedProductPackageDurationId.value = productPackageDurationId;
  confirmModalRef.value.openModal();
}

function closeModal() {
  selectedProductPackageDurationId.value = '';
  confirmModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : Modal

// START : Handle Button
const handleConfirm = async () => {
  await productPackageDurationStore.deleteProductPackageDuration(
    selectedProductPackageDurationId.value,
  );
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
    title="Hapus Durasi Paket Produk"
    message="Apakah anda yakin untuk menghapus durasi ini?"
    confirmText="Hapus"
    cancelText="Batal"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    danger
  >
    <template #icon>
      <TriangleWarningIcon class="size-6 text-red-500" />
    </template>
  </ConfirmModalComponent>
</template>
