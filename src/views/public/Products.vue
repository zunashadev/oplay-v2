<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useProductStore } from '@/stores/productStore';
import { useProductCategoryStore } from '@/stores/productCategoryStore';

import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';

import ProductCardComponent from './components/ProductCard.vue';
import ProductCardLoadingSkeletonComponent from './components/ProductCardLoadingSkeleton.vue';

import NotFoundIllustration from '@/components/illustrations/NotFound.vue';

const router = useRouter();

const productStore = useProductStore();
const categoryStore = useProductCategoryStore();

// 📌 Fetch Product
onMounted(() => {
  productStore.fetchProducts();
  categoryStore.fetchCategories();
});

// 📌 Go TO Detail Product
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
      <!-- 📌 Search -->
      <div class="w-96">
        <InputComponent placeholder="Cari produk..." />
      </div>

      <!-- 📌 Filter -->
      <template v-if="categoryStore.categories.length">
        <div class="flex items-center gap-3">
          <div
            v-for="(item, index) in categoryStore.categories"
            :key="index"
            class="rounded-full px-6 py-2 text-sm outline outline-gray-500 hover:cursor-pointer"
          >
            {{ item.name }}
          </div>
        </div>
      </template>
    </div>
    <!-- END : Filter -->

    <!-- START : List Product -->
    <div
      class="grid w-full"
      :class="{
        'grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
          productStore.loading || (productStore.products && productStore.products.length),
        'grid-cols-1 place-items-center':
          !productStore.loading && (!productStore.products || !productStore.products.length),
      }"
    >
      <!-- START : Loading -->
      <template v-if="productStore.loading">
        <ProductCardLoadingSkeletonComponent v-for="n in 4" :key="n" />
      </template>
      <!-- END : Loading -->

      <!-- START : Loading Done -->
      <template v-else>
        <!-- START : Produk -->
        <template v-if="productStore.products && productStore.products.length">
          <ProductCardComponent
            v-for="product in productStore.products"
            :key="product.id"
            :product="product"
            @click-detail="goToDetail"
          />
        </template>
        <!-- END : Produk -->

        <!-- START : Tidak Ada Produk -->
        <template v-else>
          <div class="flex flex-col items-center justify-center gap-5">
            <NotFoundIllustration class="h-min max-w-xs py-5" />
            <p class="text-lightning-yellow-400 text-2xl font-normal">Produk belum tersedia :(</p>
          </div>
        </template>
        <!-- END : Tidak Ada Produk -->
      </template>
      <!-- START : Loading Done -->
    </div>
    <!-- END : List Product -->
  </div>
</template>
