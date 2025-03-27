<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';

import AddProductPartial from './partials/AddProduct.vue';
import AddProductPackagePartial from './partials/AddProductPackage.vue';

const productStore = useProductStore();
const productPackageStore = useProductPackageStore();

// START : FETCH PRODUCTS
onMounted(() => {
  productStore.fetchProducts();
});
// END : FETCH PRODUCTS

// START : DELETE PRODUCTS
const deleteProduct = async (id) => {
  await productStore.deleteProduct(id);
};
// END : DELETE PRODUCTS

// START : DELETE PRODUCTS
const deleteProductPackage = async (id) => {
  await productPackageStore.deleteProductPackage(id);
};
// END : DELETE PRODUCTS
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

    <!-- START : LIST PRODUCTS -->
    <div class="flex flex-col gap-2">
      <template v-for="product in productStore.products" :key="product.id">
        <div class="rounded-md border border-gray-200">
          <!-- START : HEAD -->
          <div class="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <div class="flex items-center space-x-3">
              <img v-if="product.image_url" :src="product.image_url" alt="Produk" class="max-h-8" />
              <p class="text-xl font-semibold">
                {{ product.name }}
              </p>
            </div>
            <div class="flex gap-1">
              <button
                class="bg-lightning-yellow-400 hover:bg-lightning-yellow-500 rounded-md px-3 py-1 text-sm font-medium text-white transition-all hover:cursor-pointer"
              >
                Edit
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white transition-all hover:cursor-pointer hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          <!-- END : HEAD -->

          <!-- START : BODY -->
          <div class="flex flex-col gap-3 px-4 py-2">
            <div>
              <p class="text-xs font-normal text-gray-400">Category</p>
              <p>{{ product.category }}</p>
            </div>
            <div>
              <p class="text-xs font-normal text-gray-400">Description</p>
              <p>{{ product.description }}</p>
            </div>
          </div>

          <!-- START : PACKAGES -->
          <div class="flex flex-col gap-3 border-t border-gray-200 px-4 py-2">
            <p class="text-base font-normal text-gray-400">Paket</p>
            <div v-if="product.product_packages.length">
              <div class="flex flex-col gap-1">
                <div
                  v-for="pkg in product.product_packages"
                  :key="pkg.id"
                  class="flex items-center justify-between rounded-md bg-gray-200 px-4 py-2"
                >
                  <div>
                    <p>{{ pkg.name }} - Rp{{ pkg.price }}</p>
                  </div>
                  <div class="flex gap-1">
                    <button
                      class="bg-lightning-yellow-400 hover:bg-lightning-yellow-500 rounded-md px-3 py-1 text-sm font-medium text-white transition-all hover:cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteProductPackage(pkg.id)"
                      class="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white transition-all hover:cursor-pointer hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-400">Tidak ada paket untuk produk ini.</p>
          </div>
          <!-- END : PACKAGES -->

          <!-- END : BODY -->
        </div>
      </template>
    </div>
    <!-- END : LIST PRODUCTS -->
  </div>
</template>
