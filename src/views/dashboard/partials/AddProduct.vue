<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';

import AlertComponent from '../components/alerts/Alert.vue';

const productStore = useProductStore();

const name = ref('');
const category = ref('');
const description = ref('');
const file = ref(null);
const fileInputRef = ref(null); // Ref untuk input file - biar bisa reset inputan file saat berhasil add product

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const addProduct = async () => {
  if (!name.value || !category.value) return alert('Isi semua field!');
  await productStore.addProduct(name.value, category.value, description.value, file.value);

  // Reset Form
  name.value = '';
  category.value = '';
  description.value = '';
  file.value = null;

  // Reset input file dengan mereset value-nya
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// Fungsi untuk menghapus message & error dari store
const clearAlert = () => {
  productStore.message = null;
  productStore.error = null;
};
</script>

<template>
  <div class="rounded-md border border-gray-200">
    <div class="border-b border-gray-200 bg-gray-50 px-3 py-3">
      <p class="text-lg font-medium">➕ Tambah Produk</p>
    </div>

    <!-- START : MESSAGE AND ERROR -->
    <template v-if="productStore.message || productStore.error">
      <AlertComponent
        :message="productStore.message"
        :error="productStore.error"
        @close-alert="clearAlert"
      />
    </template>
    <!-- START : MESSAGE AND ERROR -->

    <div class="px-3 py-3">
      <form @submit.prevent="addProduct" class="flex flex-col gap-2">
        <input v-model="name" placeholder="Nama Produk" class="rounded border p-2" required />
        <input v-model="category" placeholder="Kategori" class="rounded border p-2" required />
        <textarea
          v-model="description"
          placeholder="Deskripsi"
          class="rounded border p-2"
          required
        ></textarea>
        <div class="rounded-sm border px-4 py-2">
          <input
            type="file"
            ref="fileInputRef"
            @change="onFileChange"
            class="hover:cursor-pointer"
          />
        </div>
        <button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
          Tambah Produk
        </button>
      </form>
    </div>
  </div>
</template>
