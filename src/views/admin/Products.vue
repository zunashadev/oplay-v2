<script setup>
import AddProductPartial from './partials/AddProduct.vue';
import ListProductsPartial from './partials/ListProducts.vue';
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- START : ADD PRODUCT -->
    <div class="w-full">
      <AddProductPartial />
    </div>
    <!-- END : ADD PRODUCT -->

    <hr class="border-gray-200" />

    <!-- START : LIST PRODUCTS -->
    <ListProductsPartial />
    <!-- END : LIST PRODUCTS -->
  </div>
</template>
