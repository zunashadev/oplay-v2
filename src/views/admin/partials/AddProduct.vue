<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';

import AlertComponent from '../components/alerts/Alert.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import TextAreaComponent from '@/components/form/TextArea.vue';
import FileInputComponent from '@/components/form/FileInput.vue';

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
  <div class="overflow-hidden rounded-2xl bg-gray-900">
    <div class="bg-gray-800 px-3 py-3">
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

    <div class="px-5 py-5">
      <form @submit.prevent="addProduct" class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <!-- Name -->
          <InputComponent v-model="name" placeholder="Masukkan nama produk" required />
          <!-- Category -->
          <InputComponent v-model="category" placeholder="Masukkan kategori produk" required />
          <!-- Description -->
          <TextAreaComponent v-model="description" placeholder="Masukkan deskripsi" required />
          <!-- File -->
          <FileInputComponent v-model="file" required class="mt-3" />
        </div>

        <ButtonComponent type="submit" variant="solid" textColor="black"
          >Tambah Produk</ButtonComponent
        >
      </form>
    </div>
  </div>
</template>
