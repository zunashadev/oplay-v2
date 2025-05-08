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
  <!-- 📌 Background -> Pattern -->

  <div class="flex flex-col gap-8">
    <!-- START : Header -->
    <div
      class="page-padding-x reset-page-padding-x relative flex flex-col items-center justify-between gap-6 bg-gray-900 py-6 sm:flex-row sm:gap-12"
    >
      <!-- START : Background -->
      <div class="absolute inset-0 -z-0 h-full">
        <div class="bg-pattern relative h-full w-full">
          <div class="absolute inset-0 z-10 bg-gray-950/75"></div>
        </div>
      </div>
      <!-- END : Background -->

      <!-- START : Title -->
      <div class="z-10">
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
        'grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
          productStore.loading || (productStore.products && productStore.products.length),
        'grid-cols-1 place-items-center':
          !productStore.loading && (!productStore.products || !productStore.products.length),
      }"
    >
      <!-- START : Loading -->
      <template v-if="productStore.loading">
        <ProductCardLoadingSkeletonComponent v-for="n in 8" :key="n" />
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
          <div class="flex flex-col items-center justify-center gap-12 py-24">
            <img
              src="/images/illustrations/UndrawNoData.svg"
              class="max-w-[8rem] sm:max-w-[12rem]"
            />

            <div class="flex flex-col items-center gap-2">
              <p class="text-center text-base font-medium text-white sm:text-2xl">
                Produk Tidak Ditemukan
              </p>
              <p class="text-center text-xs text-gray-500 sm:text-sm">
                Kami tidak menemukan produk yang sesuai dengan pencarian Anda.
              </p>
            </div>
          </div>
        </template>
        <!-- END : Tidak Ada Produk -->
      </template>
      <!-- START : Loading Done -->
    </div>
    <!-- END : List Product -->
  </div>
</template>

<style scoped>
.bg-pattern {
  background-image: url('/images/patterns/graph-paper.svg');
  background-repeat: repeat;
  background-size: auto; /* bisa diubah jadi 'contain', 'cover', atau ukuran tertentu */
  background-position: center;
}
</style>
