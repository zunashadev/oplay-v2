<script setup>
import { ref } from 'vue';

// 📌 Stores
import { useProductCategoryStore } from '@/stores/productCategoryStore';

// 📌 Components
import ConfirmModalComponent from '@/components/modals/ConfirmModal.vue';

// 📌 Icons
import TriangleWarningIcon from '@/components/icons/TriangleWarning.vue';

// 📌...
const productCategoryStore = useProductCategoryStore();

const selectedCategoryId = ref('');

// START : Modal
const confirmModalRef = ref(null);

function openModal(categoryId) {
  selectedCategoryId.value = categoryId;
  confirmModalRef.value.openModal();
}

function closeModal() {
  selectedCategoryId.value = '';
  confirmModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : Modal

// START : Handle Button
const handleConfirm = async () => {
  await productCategoryStore.deleteCategory(selectedCategoryId.value);
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
    title="Hapus Kategori Produk"
    message="Apakah anda yakin untuk menghapus kategori produk ini?"
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
