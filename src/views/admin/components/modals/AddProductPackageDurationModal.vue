<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';
import { useProductPackageDurationStore } from '@/stores/productPackageDurationStore';

import DialogModalComponent from '@/components/modals/DialogModal.vue';
import InputComponent from '@/components/form/Input.vue';
import ButtonComponent from '@/components/buttons/Button.vue';

// START : MODAL
const dialogModalRef = ref(null);

function openModal(productId, productPackageId) {
  selectedProductId.value = productId;
  selectedProductPackageId.value = productPackageId;

  dialogModalRef.value.openModal();
}

function closeModal() {
  name.value = '';
  value.value = '';
  selectedProductId.value = '';
  selectedProductPackageId.value = '';

  dialogModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : ADD PRODUCT PACKAGE DURATION
const productStore = useProductStore();
const productPackageStore = useProductPackageStore();
const productPackageDurationStore = useProductPackageDurationStore();

const name = ref('');
const value = ref('');
const selectedProductId = ref('');
const selectedProductPackageId = ref('');

onMounted(() => {
  productStore.fetchProducts(); // Ambil daftar produk
});

const addProductPackageDuration = async () => {
  if (!name.value || !value.value || !selectedProductId.value || !selectedProductPackageId.value)
    return alert('Isi semua field!');

  await productPackageDurationStore.addProductPackageDuration(
    selectedProductId.value,
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
  <DialogModalComponent ref="dialogModalRef" title="Tambah Durasi Paket">
    <div class="">
      <form @submit.prevent="addProductPackageDuration" class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <!-- Name -->
          <InputComponent v-model="name" placeholder="Masukkan nama durasi" type="text" required />
          <!-- Value -->
          <InputComponent
            v-model="value"
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
