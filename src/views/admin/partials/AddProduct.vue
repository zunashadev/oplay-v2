<script setup>
import { ref } from 'vue';
import { useProductStore } from '@/stores/productStore';

import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import TextAreaComponent from '@/components/form/TextArea.vue';
import FileInputComponent from '@/components/form/FileInput.vue';

const productStore = useProductStore();

const name = ref('');
const category = ref('');
const description = ref('');
const file = ref(null);

const addProduct = async () => {
  if (!name.value || !category.value || !file.value) return alert('Isi semua field!');
  await productStore.addProduct(name.value, category.value, description.value, file.value);

  // Reset Form
  name.value = '';
  category.value = '';
  description.value = '';
  file.value = null;
};
</script>

<template>
  <div class="overflow-hidden rounded-xl bg-gray-900">
    <div class="bg-gray-800 px-3 py-3">
      <p class="text-lg font-medium">➕ Tambah Produk</p>
    </div>

    <div class="px-5 py-5">
      <form @submit.prevent="addProduct" class="flex flex-col gap-5">
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

        <ButtonComponent type="submit" variant="solid" textColor="black">
          Tambah Produk
        </ButtonComponent>
      </form>
    </div>
  </div>
</template>
