<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';
import { useProductPackageDurationStore } from '@/stores/productPackageDurationStore';

import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';

import ProductCardComponent from './components/ProductCard.vue';
import ProductCardLoadingSkeletonComponent from './components/ProductCardLoadingSkeleton.vue';

import NotFoundIllustration from '@/components/illustrations/NotFound.vue';

const router = useRouter();

const productStore = useProductStore();

// Fetch Product
onMounted(() => {
  productStore.fetchProducts();
});

// Go TO Detail Product
const goToDetail = (slug) => {
  router.push({ name: 'PublicProductDetail', params: { slug } });
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- START : Header -->
    <div class="page-padding-x reset-page-padding-x bg-gray-900 py-6">
      <div class="">
        <p class="text-2xl font-semibold">Daftar Produk</p>
      </div>
    </div>
    <!-- END : Header -->

    <!-- START : Filter -->
    <div class="flex items-center justify-between rounded-full">
      <div class="w-96">
        <InputComponent placeholder="Cari produk..." />
      </div>
      <div class="flex items-center gap-3">
        <div class="rounded-full px-6 py-2 text-sm outline outline-gray-500 hover:cursor-pointer">
          Design
        </div>
        <div class="rounded-full bg-yellow-500 px-6 py-2 text-sm text-black hover:cursor-pointer">
          Music
        </div>
        <div class="rounded-full px-6 py-2 text-sm outline outline-gray-500 hover:cursor-pointer">
          Streaming
        </div>
        <div class="rounded-full px-6 py-2 text-sm outline outline-gray-500 hover:cursor-pointer">
          AI
        </div>
      </div>
    </div>
    <!-- END : Filter -->

    <!-- START : List Product -->
    <div
      class="grid w-full"
      :class="{
        'grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
          productStore.loading || (productStore.products && productStore.products.length),
        'grid-cols-1 place-items-center':
          !productStore.loading && (!productStore.products || !productStore.products.length),
      }"
    >
      <!-- Loading -->
      <template v-if="productStore.loading">
        <ProductCardLoadingSkeletonComponent v-for="n in 4" :key="n" />
      </template>

      <!-- Produk -->
      <template v-else-if="productStore.products && productStore.products.length">
        <ProductCardComponent
          v-for="product in productStore.products"
          :key="product.id"
          :product="product"
          @click-detail="goToDetail"
        />
      </template>

      <!-- Tidak Ada Produk -->
      <template v-else>
        <div class="flex flex-col items-center justify-center gap-5">
          <NotFoundIllustration class="h-min max-w-xs py-5" />
          <p class="text-lightning-yellow-400 text-2xl font-normal">Produk belum tersedia :(</p>
        </div>
      </template>
    </div>
    <!-- END : List Product -->
  </div>
</template>
