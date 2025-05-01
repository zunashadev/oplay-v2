<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

// 📌 Stores
import { useProductCategoryStore } from '@/stores/productCategoryStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// import DeleteProductCategoryModalComponent from '../../components/modals/DeleteProductCategoryModal.vue';
import DeleteProductCategoryModalComponent from '../../components/product-categories/modals/DeleteProductCategoryModal.vue';

// 📌 ...
const productCategoryStore = useProductCategoryStore();

// 📌 Fetch Categories
onMounted(() => {
  productCategoryStore.fetchCategories();
});

onUnmounted(() => {
  productCategoryStore.resetCategoriesState();
});

// 📌 Delete Kategori
const deleteProductCategoryModalRef = ref(null);

const openDeleteProductCategoryModal = async (id) => {
  deleteProductCategoryModalRef.value?.openModal(id);
};
</script>

<template>
  <!-- Delete Product Category -->
  <DeleteProductCategoryModalComponent ref="deleteProductCategoryModalRef" />

  <!-- loading -->
  <div v-if="productCategoryStore.loading" class="py-10 text-center">
    <span class="text-gray-500">Loading kategori...</span>
  </div>

  <!-- Categories Kosong -->
  <div
    v-else-if="!productCategoryStore.loading && productCategoryStore.categories.length === 0"
    class="py-10 text-center"
  >
    <span class="text-gray-500">Belum ada kategori.</span>
  </div>

  <!-- Categories -->
  <div v-else class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <div
      v-for="category in productCategoryStore.categories"
      :key="category.id"
      class="flex flex-col justify-between gap-6 rounded-2xl bg-white p-5"
    >
      <div>
        <h2 class="mb-2 text-xl font-semibold text-gray-950">{{ category.name }}</h2>
        <div class="flex items-center gap-2">
          <p class="text-sm text-gray-500">Slug :</p>
          <p class="text-sm text-gray-500">{{ category.slug }}</p>
        </div>
      </div>

      <div class="flex gap-2">
        <ButtonComponent type="button" variant="solid" size="sm" textColor="black">
          Edit
        </ButtonComponent>
        <ButtonComponent
          @click="openDeleteProductCategoryModal(category.id)"
          type="button"
          variant="solid"
          size="sm"
          color="red"
          textColor="black"
        >
          Delete
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>
