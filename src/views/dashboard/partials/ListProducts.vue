<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';

const productStore = useProductStore();
const productPackageStore = useProductPackageStore();

// Fetch Product
onMounted(() => {
  productStore.fetchProducts();
});

// Delete Product
const deleteProduct = async (id) => {
  await productStore.deleteProduct(id);
};

// Delete Product Package
const deleteProductPackage = async (id) => {
  await productPackageStore.deleteProductPackage(id);
};
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="rounded-md border border-gray-200 bg-gray-50 px-6 py-3">
      <p class="text-center text-2xl font-semibold">🛒 Daftar Produk</p>
    </div>

    <template v-for="product in productStore.products" :key="product.id">
      <div class="rounded-md border border-gray-200">
        <!-- START : HEAD -->
        <div
          class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-4"
        >
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
        <div class="flex w-full gap-3 px-4 py-5">
          <!-- START : DETAIL -->
          <div
            class="flex w-1/2 flex-col gap-5 rounded-md border border-dashed border-gray-200 px-3 py-3"
          >
            <p class="text-base font-normal">ℹ️ Informasi</p>
            <div class="flex flex-col gap-2">
              <div>
                <p class="text-xs font-normal text-gray-400">Category</p>
                <p>{{ product.category }}</p>
              </div>
              <div>
                <p class="text-xs font-normal text-gray-400">Description</p>
                <p>{{ product.description }}</p>
              </div>
            </div>
          </div>
          <!-- END : DETAIL -->

          <!-- START : PACKAGES -->
          <div
            class="flex w-1/2 flex-col gap-5 rounded-md border border-dashed border-gray-200 px-3 py-3"
          >
            <p class="text-base font-normal">📦 Paket</p>
            <div v-if="product.product_packages.length">
              <div class="flex flex-col gap-1">
                <div
                  v-for="pkg in product.product_packages"
                  :key="pkg.id"
                  class="flex items-center justify-between rounded-md border border-l-6 border-gray-200 bg-gray-50 px-4 py-2"
                >
                  <div>
                    <p class="text-base font-medium">{{ pkg.name }}</p>
                    <p class="text-sm font-normal">Rp{{ pkg.price }}</p>
                  </div>
                  <div class="flex gap-1">
                    <button
                      class="bg-lightning-yellow-400 hover:bg-lightning-yellow-500 rounded-md px-3 py-1 text-xs font-medium text-white transition-all hover:cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteProductPackage(pkg.id)"
                      class="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white transition-all hover:cursor-pointer hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-gray-400">Belum ada paket untuk produk ini.</p>
          </div>
          <!-- END : PACKAGES -->
        </div>
        <!-- END : BODY -->
      </div>
    </template>
  </div>
</template>
