<script setup>
import AddProductPartial from './partials/AddProduct.vue';
import ListProductsPartial from './partials/ListProducts.vue';
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- START : Add Product -->
    <div class="w-full">
      <AddProductPartial />
    </div>
    <!-- END : Add Product -->

    <hr class="border-gray-800" />

    <!-- START : List Products -->
    <div class="w-full">
      <ListProductsPartial />
    </div>
    <!-- END : List Products -->
  </div>
</template>
