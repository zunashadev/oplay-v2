<script setup>
import { ref } from 'vue';

// 📌 Stores
import { useProductCategoryStore } from '@/stores/productCategoryStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';

// 📌 ...
const productCategoryStore = useProductCategoryStore();

const name = ref('');

// 📌 Add Category
const addCategory = async () => {
  if (!name.value) return alert('Isi semua field!');

  try {
    await productCategoryStore.addCategory(name.value);

    // Reset form
    name.value = '';
  } catch (err) {
    // Sudah ditangani oleh handleResponse di store
  }
};
</script>

<template>
  <div class="overflow-hidden rounded-xl bg-gray-900">
    <div class="bg-gray-800 px-3 py-3">
      <p class="text-lg font-medium">➕ Tambah Kategori</p>
    </div>

    <div class="px-5 py-5">
      <form @submit.prevent="addCategory" class="flex flex-col gap-5">
        <div class="flex flex-col gap-5">
          <!-- Nama -->
          <InputComponent
            v-model="name"
            label="Nama"
            placeholder="Masukkan nama kategori"
            required
          />
        </div>

        <ButtonComponent type="submit" variant="solid" textColor="black">
          Tambah Kategori
        </ButtonComponent>
      </form>
    </div>
  </div>
</template>
