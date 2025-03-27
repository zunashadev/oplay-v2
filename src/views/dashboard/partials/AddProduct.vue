<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';

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
</script>

<template>
  <div class="rounded-md border border-gray-200">
    <div class="bg-gray-200 px-3 py-3">
      <p class="text-lg font-medium">Tambah Produk</p>
    </div>
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
        <input type="file" ref="fileInputRef" @change="onFileChange" />
        <button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
          Tambah Produk
        </button>
      </form>
    </div>
  </div>
</template>
