<script setup>
import { ref } from 'vue';

// 📌 Partials
import AddCategoryPartial from './partials/product-categories/AddCategory.vue';
import ListCategoriesPartial from './partials/product-categories/ListCategories.vue';

import AddDeliveryTypePartial from './partials/delivery-types/AddDeliveryType.vue';
import ListDeliveryTypesPartial from './partials/delivery-types/ListDeliveryTypes.vue';
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : Add Category -->
    <div class="w-full">
      <AddDeliveryTypePartial />
    </div>
    <!-- END : Add Category -->

    <hr class="border-gray-800" />

    <!-- START : Categories -->
    <div class="w-full">
      <ListDeliveryTypesPartial />
    </div>
    <!-- END : Categories -->
  </div>
</template>
