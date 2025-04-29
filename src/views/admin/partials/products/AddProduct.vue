<script setup>
import { ref, onMounted } from 'vue';

// 📌 Stores
import { useProductStore } from '@/stores/productStore';
import { useProductCategoryStore } from '@/stores/productCategoryStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import TextAreaComponent from '@/components/form/TextArea.vue';
import FileInputComponent from '@/components/form/FileInput.vue';
import SelectComponent from '@/components/form/Select.vue';

// 📌 ...
const productStore = useProductStore();
const productCategoryStore = useProductCategoryStore();

// 📌 Fetch Categories
onMounted(() => {
  productCategoryStore.fetchCategories();
});

// 📌 ...
const name = ref('');
const category = ref('');
const description = ref('');
const productImageFile = ref(null);
const productBannerImageFile = ref(null);

// 📌 Add Product
const addProduct = async () => {
  if (!name.value || !category.value || !productImageFile.value || !productBannerImageFile.value)
    return alert('Isi semua field!');

  try {
    await productStore.addProduct(
      name.value,
      category.value,
      description.value,
      productImageFile.value,
      productBannerImageFile.value,
    );

    // Reset form
    name.value = '';
    category.value = '';
    description.value = '';
    productImageFile.value = null;
    productBannerImageFile.value = null;
  } catch (err) {
    // Sudah ditangani oleh handleResponse di store
  }
};
</script>

<template>
  <div class="overflow-hidden rounded-xl bg-gray-900">
    <div class="bg-gray-800 px-3 py-3">
      <p class="text-lg font-medium">➕ Tambah Produk</p>
    </div>

    <div class="px-5 py-5">
      <form @submit.prevent="addProduct" class="flex flex-col gap-5">
        <div class="flex flex-col gap-5">
          <!-- Nama -->
          <InputComponent v-model="name" label="Nama" placeholder="Masukkan nama produk" required />

          <!-- Kategori -->
          <SelectComponent
            class="w-full"
            v-model="category"
            :options="productCategoryStore.categories"
            label="Kategori"
            labelKey="name"
            valueKey="id"
            placeholder="Pilih kategori"
            required
          >
          </SelectComponent>

          <!-- Deskripsi -->
          <TextAreaComponent
            v-model="description"
            label="Deskripsi"
            placeholder="Masukkan deskripsi"
            required
          />

          <!-- Logo Produk -->
          <FileInputComponent v-model="productImageFile" label="Logo Produk" required />

          <!-- Banner Produk -->
          <FileInputComponent v-model="productBannerImageFile" label="Banner Produk" required />
        </div>

        <ButtonComponent type="submit" variant="solid" textColor="black">
          Tambah Produk
        </ButtonComponent>
      </form>
    </div>
  </div>
</template>
