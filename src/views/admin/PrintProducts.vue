<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { getPublicImageUrl } from '@/utils/storageHelper';

// 📌 Stores
import { useProductStore } from '@/stores/productStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
import GeometryLoaderComponent from '@/components/loaders/GeometryLoader.vue';

import ProductCardComponent from '../public/components/ProductCard.vue';
import ProductCardLoadingSkeletonComponent from '../public/components/ProductCardLoadingSkeleton.vue';

import NotFoundIllustration from '@/components/illustrations/NotFound.vue';

// 📌 Inisialisasi Store
const productStore = useProductStore();

// 📌 Fetch Product
onMounted(() => {
  productStore.fetchProducts();
});

onUnmounted(() => {
  productStore.resetProductsState();
});
</script>

<template>
  <div class="space-y-12">
    <div class="bg-pink-500 px-5 py-5">
      <ButtonComponent v-print="'#print-area'" textColor="black">Cetak</ButtonComponent>
    </div>

    <!-- PRINT -->
    <div class="p-5">
      <div id="print-area">
        <!-- START : PRINT AREA -->
        <div class="flex flex-col gap-12 bg-gray-950 px-5 py-5">
          <!-- START : Judul -->
          <div class="text-center">
            <p class="text-5xl font-semibold text-yellow-500">OPLAY</p>
          </div>
          <!-- END : Judul -->

          <!-- START : List Produk -->
          <div
            class="grid w-full"
            :class="{
              'grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
                productStore.isFetchingList ||
                (productStore.products && productStore.products.length),
              'grid-cols-1 place-items-center':
                !productStore.isFetchingList &&
                (!productStore.products || !productStore.products.length),
            }"
          >
            <!-- START : Loading -->
            <template v-if="productStore.isFetchingList">
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
          <!-- END : List Produk -->
        </div>
        <!-- END : PRINT AREA -->
      </div>
    </div>
  </div>
</template>
