<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import { useProductPackageDurationStore } from '@/stores/productPackageDurationStore';

import DialogModalComponent from '@/components/modals/DialogModal.vue';
import InputComponent from '@/components/form/Input.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

// START : MODAL
const dialogModalRef = ref(null);

// Fungsi reset form
function resetForm() {
  name.value = '';
  value.value = null;
  selectedProductPackageId.value = null;
}

function openModal(productPackageId) {
  selectedProductPackageId.value = productPackageId;
  dialogModalRef.value.openModal();
}

function closeModal() {
  resetForm();
  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : ADD PRODUCT PACKAGE DURATION
const productPackageDurationStore = useProductPackageDurationStore();

const name = ref('');
const value = ref('');
const selectedProductPackageId = ref('');

const addProductPackageDuration = async () => {
  if (!name.value || !value.value || !selectedProductPackageId.value)
    return alert('Isi semua field!');

  await productPackageDurationStore.addProductPackageDuration(
    selectedProductPackageId.value,
    name.value,
    value.value,
  );

  // Reset form jika berhasil
  if (!productPackageDurationStore.error) {
    name.value = '';
    value.value = '';
  }

  // Tutup modal
  closeModal();
};
// END : ADD PRODUCT PACKAGE DURATION
</script>

<template>
  <DialogModalComponent ref="dialogModalRef" title="Tambah Durasi Paket" @close="resetForm">
    <div class="">
      <form @submit.prevent="addProductPackageDuration" class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <!-- Name -->
          <InputComponent
            v-model="name"
            label="Nama Durasi"
            placeholder="Masukkan nama durasi"
            type="text"
            required
          />
          <!-- Value -->
          <InputComponent
            v-model="value"
            label="Nilai Durasi"
            placeholder="Masukkan nilai durasi"
            type="number"
            required
          />
        </div>

        <!-- Button -->
        <ButtonComponent type="submit" variant="solid" textColor="black">
          Tambah Durasi
        </ButtonComponent>
      </form>
    </div>
  </DialogModalComponent>
</template>
