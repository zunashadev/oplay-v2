<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';

import AlertComponent from '../components/alerts/Alert.vue';

const productStore = useProductStore();
const productPackageStore = useProductPackageStore();

const name = ref('');
const price = ref('');
const selectedProductId = ref('');

onMounted(() => {
  productStore.fetchProducts(); // Ambil daftar produk
});

const addProductPackage = async () => {
  if (!name.value || !price.value || !selectedProductId.value) return alert('Isi semua field!');

  await productPackageStore.addProductPackage(selectedProductId.value, name.value, price.value);

  // Reset form jika berhasil
  if (!productPackageStore.error) {
    name.value = '';
    price.value = '';
    selectedProductId.value = '';
  }
};

// Fungsi untuk menghapus message & error dari store
const clearAlert = () => {
  productPackageStore.message = null;
  productPackageStore.error = null;
};
</script>

<template>
  <div class="rounded-md border border-gray-200">
    <div class="border-b border-gray-200 bg-gray-50 px-3 py-3">
      <p class="text-lg font-medium">➕ Tambah Paket Produk</p>
    </div>

    <!-- START : MESSAGE AND ERROR -->
    <template v-if="productPackageStore.message || productPackageStore.error">
      <AlertComponent
        :message="productPackageStore.message"
        :error="productPackageStore.error"
        @close-alert="clearAlert"
      />
    </template>
    <!-- START : MESSAGE AND ERROR -->

    <div class="px-3 py-3">
      <form @submit.prevent="addProductPackage" class="flex flex-col gap-2">
        <!-- Dropdown Pilih Produk -->
        <select v-model="selectedProductId" class="rounded border p-2" required>
          <option value="" disabled>Pilih Produk</option>
          <option v-for="product in productStore.products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>

        <input v-model="name" placeholder="Nama Paket" class="rounded border p-2" required />
        <input
          v-model="price"
          type="number"
          placeholder="Harga"
          class="rounded border p-2"
          required
        />
        <button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
          Tambah Produk
        </button>
      </form>
    </div>
  </div>
</template>
