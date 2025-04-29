<script setup>
import { ref } from 'vue';

// 📌 Partials
import AddCategoryPartial from './partials/categories/AddCategory.vue';
import ListCategoriesPartial from './partials/categories/ListCategories.vue';
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : Add Category -->
    <div class="w-full">
      <AddCategoryPartial />
    </div>
    <!-- END : Add Category -->

    <hr class="border-gray-800" />

    <!-- START : Categories -->
    <div class="w-full">
      <ListCategoriesPartial />
    </div>
    <!-- END : Categories -->
  </div>
</template>
