<script setup>
import { ref, defineExpose, watch, computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';
import { useProductPackageDurationStore } from '@/stores/productPackageDurationStore';

import AlertComponent from '../alerts/Alert.vue';
import BaseModalComponent from '@/components/modals/BaseModal.vue';

import CrossIcon from '@/components/icons/Cross.vue';

// START : MODAl
const baseModalRef = ref(null);

function openModal(productId, productPackageId) {
  selectedProductId.value = productId;
  selectedProductPackageId.value = productPackageId;
  baseModalRef.value.openModal();
}

function closeModal() {
  baseModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAl

// START : ADD PRODUCT PACKAGE DURATION
const productStore = useProductStore();
const productPackageStore = useProductPackageStore();
const productPackageDurationStore = useProductPackageDurationStore();

const unit = ref('');
const value = ref('');
const selectedProductId = ref('');
const selectedProductPackageId = ref('');

onMounted(() => {
  productStore.fetchProducts(); // Ambil daftar produk
});

const addProductPackageDuration = async () => {
  if (!unit.value || !value.value || !selectedProductId.value || !selectedProductPackageId.value)
    return alert('Isi semua field!');

  await productPackageDurationStore.addProductPackageDuration(
    selectedProductId.value,
    selectedProductPackageId.value,
    unit.value,
    value.value,
  );

  // Reset form jika berhasil
  if (!productPackageDurationStore.error) {
    unit.value = '';
    value.value = '';
  }

  // Tutup modal
  closeModal();
};

const clearAlert = () => {
  productPackageDurationStore.message = null;
  productPackageDurationStore.error = null;
};
// END : ADD PRODUCT PACKAGE DURATION
</script>

<template>
  <!-- START : MESSAGE AND ERROR -->
  <template v-if="productPackageDurationStore.message || productPackageDurationStore.error">
    <AlertComponent
      :message="productPackageDurationStore.message"
      :error="productPackageDurationStore.error"
      @close-alert="clearAlert"
    />
  </template>
  <!-- START : MESSAGE AND ERROR -->

  <!-- START : MODAL -->
  <BaseModalComponent ref="baseModalRef">
    <div class="flex w-full max-w-xl bg-white">
      <div class="flex w-xl flex-col">
        <!-- Start : Header -->
        <div class="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-5">
          <p class="font-semibold">Tambah Durasi Paket Produk</p>
          <div
            @click="closeModal"
            class="transform text-gray-400 transition-all duration-200 hover:cursor-pointer hover:text-gray-950"
          >
            <CrossIcon class="size-6" />
          </div>
        </div>
        <!-- End : Header -->

        <!-- Start : Content -->
        <div class="flex flex-col px-5 py-5">
          <form @submit.prevent="addProductPackageDuration" class="flex flex-col gap-2">
            <!-- Unit -->
            <input v-model="unit" placeholder="Satuan Durasi" class="rounded border p-2" required />

            <!-- Value -->
            <input v-model="value" placeholder="Nilai Durasi" class="rounded border p-2" required />

            <!-- Button -->
            <button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
              Tambah Produk
            </button>
          </form>
        </div>
        <!-- End : Content -->
      </div>
    </div>
  </BaseModalComponent>
  <!-- END : MODAL -->
</template>
