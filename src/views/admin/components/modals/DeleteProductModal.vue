<script setup>
import { ref } from 'vue';

// Stores
import { useProductStore } from '@/stores/productStore';

// Components
import ConfirmModalComponent from '@/components/modals/ConfirmModal.vue';

// Icons
import TriangleWarningIcon from '@/components/icons/TriangleWarning.vue';

const productStore = useProductStore();

const selectedProductId = ref('');

// START : Modal
const confirmModalRef = ref(null);

function openModal(productId) {
  selectedProductId.value = productId;
  confirmModalRef.value.openModal();
}

function closeModal() {
  selectedProductId.value = '';
  confirmModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : Modal

// START : Handle Button
const handleConfirm = async () => {
  await productStore.deleteProduct(selectedProductId.value);
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
    title="Hapus Produk"
    message="Apakah anda yakin untuk menghapus produk ini?"
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
