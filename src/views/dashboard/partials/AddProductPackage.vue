<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';

import CrossIcon from '@/components/icons/Cross.vue';

const productStore = useProductStore();
const productPackageStore = useProductPackageStore();

const name = ref('');
const price = ref('');
const selectedProductId = ref('');

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

// Fungsi untuk menutup pesan
const closeMessage = () => {
  productPackageStore.message = null;
};

// Fungsi untuk menutup error
const closeError = () => {
  productPackageStore.error = null;
};

onMounted(() => {
  productStore.fetchProducts(); // Ambil daftar produk
});
</script>

<template>
  <div class="rounded-md border border-gray-200">
    <div class="border-b border-gray-200 bg-gray-50 px-3 py-3">
      <p class="text-lg font-medium">➕ Tambah Paket Produk</p>
    </div>

    <!-- START : MESSAGE AND ERROR -->
    <div v-if="productPackageStore.message || productPackageStore.error" class="px-3 py-3">
      <div
        v-if="productPackageStore.message"
        class="mt-2 flex items-center justify-between rounded-lg bg-green-500 p-4 text-sm text-white"
      >
        <p>{{ productPackageStore.message }}</p>
        <div
          @click="closeMessage"
          class="rounded-md bg-green-400 p-1 transition-all hover:cursor-pointer hover:text-red-500"
        >
          <CrossIcon class="size-5" />
        </div>
      </div>
      <div
        v-if="productPackageStore.error"
        class="mt-2 flex items-center justify-between rounded-lg bg-red-500 p-4 text-sm text-white"
      >
        <p>{{ productPackageStore.error }}</p>
        <div
          @click="closeError"
          class="rounded-md bg-red-400 p-1 transition-all hover:cursor-pointer hover:text-red-500"
        >
          <CrossIcon class="size-5" />
        </div>
      </div>
    </div>
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
