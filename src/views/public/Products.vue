<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useProductStore } from '@/stores/productStore';
import { useProductCategoryStore } from '@/stores/productCategoryStore';

import ButtonComponent from '@/components/buttons/Button.vue';
import InputComponent from '@/components/form/Input.vue';
import ListboxSelectComponent from '@/components/form/ListboxSelect.vue';

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

// 📌 Search & Filter
const keyword = ref('');
const selectedCategory = ref(null);

watch([keyword, selectedCategory], () => {
  productStore.searchAndFilterProducts({
    keyword: keyword.value,
    categoryId: selectedCategory.value,
  });
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- START : Header -->
    <div
      class="page-padding-x reset-page-padding-x flex flex-col items-center justify-between gap-12 bg-gray-900 py-6 sm:flex-row"
    >
      <!-- START : Title -->
      <div class="">
        <p class="text-2xl font-semibold">Daftar Produk</p>
      </div>
      <!-- END : Title -->

      <!-- START : Filter -->
      <div
        class="flex w-full flex-col items-center justify-end gap-4 rounded-2xl sm:w-1/2 lg:flex-row"
      >
        <!-- 📌 Search -->
        <div class="w-full sm:max-w-96">
          <InputComponent v-model="keyword" placeholder="Cari produk..." />
        </div>

        <!-- 📌 Filter -->
        <template v-if="categoryStore.categories.length">
          <ListboxSelectComponent
            class="w-full sm:max-w-52"
            v-model="selectedCategory"
            :options="categoryStore.categories"
            labelKey="name"
            valueKey="id"
            placeholder="Pilih kategori"
            required
          >
          </ListboxSelectComponent>
        </template>
      </div>
      <!-- END : Filter -->
    </div>
    <!-- END : Header -->

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
