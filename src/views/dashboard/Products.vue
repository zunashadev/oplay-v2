<script setup>
import AddProductPartial from './partials/AddProduct.vue';
import AddProductPackagePartial from './partials/AddProductPackage.vue';
import ListProductsPartial from './partials/ListProducts.vue';
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex w-full gap-3">
      <!-- START : ADD PRODUCT -->
      <div class="w-full">
        <AddProductPartial />
      </div>
      <!-- END : ADD PRODUCT -->

      <!-- START : ADD PRODUCT PACKAGE -->
      <div class="w-full">
        <AddProductPackagePartial />
      </div>
      <!-- END : ADD PRODUCT PACKAGE -->
    </div>

    <hr class="border-gray-200" />

    <!-- START : LIST PRODUCTS -->
    <ListProductsPartial />
    <!-- END : LIST PRODUCTS -->
  </div>
</template>
