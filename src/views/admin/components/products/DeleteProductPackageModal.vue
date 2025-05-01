<script setup>
import { ref } from 'vue';

// Stores
import { useProductPackageStore } from '@/stores/productPackageStore';

// Components
import ConfirmModalComponent from '@/components/modals/ConfirmModal.vue';

// Icons
import TriangleWarningIcon from '@/components/icons/TriangleWarning.vue';

const productPackageStore = useProductPackageStore();

const selectedProductPackageId = ref('');

// START : Modal
const confirmModalRef = ref(null);

function openModal(productPackageId) {
  selectedProductPackageId.value = productPackageId;
  confirmModalRef.value.openModal();
}

function closeModal() {
  selectedProductPackageId.value = '';
  confirmModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : Modal

// START : Handle Button
const handleConfirm = async () => {
  await productPackageStore.deleteProductPackage(selectedProductPackageId.value);
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
    title="Hapus Paket Produk"
    message="Apakah anda yakin untuk menghapus paket ini?"
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
