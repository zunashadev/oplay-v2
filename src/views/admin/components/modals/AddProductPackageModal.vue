<script setup>
import { ref, defineProps, defineExpose, watch, computed, onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';

import AlertComponent from '../alerts/Alert.vue';
import BaseModalComponent from '@/components/modals/BaseModal.vue';

import CrossIcon from '@/components/icons/Cross.vue';

// START : MODAL
const baseModalRef = ref(null);

function openModal(productId) {
  selectedProductId.value = productId;
  baseModalRef.value.openModal();
}

function closeModal() {
  baseModalRef.value.closeModal();
}

defineExpose({ openModal, closeModal });
// END : MODAL

// START : ADD PRODUCT PACKAGE
const productStore = useProductStore();
const productPackageStore = useProductPackageStore();

const name = ref('');
const price = ref('');
const selectedProductId = ref('');
const discountType = ref(''); // 'percentage' atau 'fixed_amount'
const discountValue = ref(0); // Nilai diskon
const isBestSeller = ref(false);

onMounted(() => {
  productStore.fetchProducts(); // Ambil daftar produk
});

const addProductPackage = async () => {
  if (!name.value || !price.value || !selectedProductId.value) return alert('Isi semua field!');

  await productPackageStore.addProductPackage(
    selectedProductId.value,
    name.value,
    price.value,
    discountType.value, // Kirim jenis diskon
    discountValue.value, // Kirim nilai diskon
    isBestSeller.value,
  );

  // Reset form jika berhasil
  if (!productPackageStore.error) {
    name.value = '';
    price.value = '';
    discountType.value = '';
    discountValue.value = 0;
    isBestSeller.value = false;
  }

  // Tutup modal
  closeModal();
};

// Fungsi untuk menghapus message & error dari store
const clearAlert = () => {
  productPackageStore.message = null;
  productPackageStore.error = null;
};
// END : ADD PRODUCT PACKAGE
</script>

<template>
  <!-- START : MESSAGE AND ERROR -->
  <template v-if="productPackageStore.message || productPackageStore.error">
    <AlertComponent
      :message="productPackageStore.message"
      :error="productPackageStore.error"
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
          <p class="font-semibold">Tambah Paket Produk</p>
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
          <form @submit.prevent="addProductPackage" class="flex flex-col gap-2">
            <!-- Dropdown Pilih Produk -->
            <select v-model="selectedProductId" class="rounded border p-2" required>
              <option value="" disabled>Pilih Produk</option>
              <option
                v-for="product in productStore.products"
                :key="product.id"
                :value="product.id"
              >
                {{ product.name }}
              </option>
            </select>

            <!-- Name -->
            <input v-model="name" placeholder="Nama Paket" class="rounded border p-2" required />

            <!-- Price -->
            <input
              v-model="price"
              type="number"
              placeholder="Harga"
              class="rounded border p-2"
              required
            />

            <!-- Diskon Type -->
            <select v-model="discountType" class="rounded border p-2">
              <option value="" disabled>Pilih Jenis Diskon</option>
              <option value="percentage">Persentase (%)</option>
              <option value="fixed_amount">Potongan Harga (Rp)</option>
            </select>

            <!-- Diskon Value -->
            <input
              v-model="discountValue"
              type="number"
              placeholder="Nilai Diskon"
              class="rounded border p-2"
              :disabled="!discountType"
              required
            />

            <!-- Is Best Seller -->
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="isBestSeller" class="rounded border" />
              <span>🔥 Terlaris</span>
            </label>

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
