<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/productStore';
import { useProductPackageStore } from '@/stores/productPackageStore';
import { useProductPackageDurationStore } from '@/stores/productPackageDurationStore';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

import ButtonComponent from '@/components/buttons/Button.vue';

import BoxOpenSolidIcon from '@/components/icons/BoxOpenSolid.vue';

const router = useRouter();

const productStore = useProductStore();
const productPackageStore = useProductPackageStore();
const productPackageDurationStore = useProductPackageDurationStore();

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
  <div class="flex min-h-screen flex-col gap-8 px-24 py-6">
    <!-- START : FILTER -->
    <!-- <div>Filter</div> -->
    <!-- END : FILTER -->

    <!-- START : LIST PRODUCTS -->
    <template v-if="productStore.loading">
      <div>
        <div>Loading...</div>
        <div>Sabar dikit 😁</div>
      </div>
    </template>
    <div class="grid grid-cols-4 gap-5">
      <!-- START : PRODUCT CARD -->
      <template v-if="productStore.products && productStore.products.length">
        <div
          v-for="product in productStore.products"
          :key="product.id"
          class="rounded-xl bg-gradient-to-b from-gray-200/50 via-gray-400/50 to-gray-600/50 p-[1px]"
        >
          <div
            class="flex h-full flex-col justify-between gap-5 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 px-5 py-5"
          >
            <div class="flex flex-col gap-5">
              <div class="flex items-start justify-between">
                <img
                  v-if="product.image_url"
                  :src="product.image_url"
                  alt="Produk"
                  class="max-h-10"
                />
                <div class="rounded-2xl bg-gray-700 px-4 py-0.5 text-xs">
                  {{ product.category }}
                </div>
              </div>
              <div>
                <p class="text-xl font-semibold">
                  {{ product.name }}
                </p>
                <p class="line-clamp-2 text-sm font-normal text-gray-400">
                  {{ product.description }}
                </p>
              </div>

              <hr class="rounded-full border-gray-700" />

              <template v-if="product.product_packages && product.product_packages.length">
                <div class="flex flex-col gap-3">
                  <template v-for="pkg in product.product_packages" :key="pkg.id">
                    <div class="flex items-center gap-3">
                      <BoxOpenSolidIcon class="size-4 text-gray-600" />
                      <div>
                        <p class="text-xs font-normal text-gray-200">
                          {{ pkg.name }} <span v-if="pkg.is_best_seller">🔥</span>
                        </p>
                        <!-- Discount -->
                        <template
                          v-if="
                            pkg.discount_type && pkg.discount_type !== '' && pkg.discount_value > 0
                          "
                        >
                          <div class="flex items-center gap-1">
                            <p class="text-xs font-normal text-gray-400 line-through">
                              {{ formatRupiah(pkg.price) }}
                            </p>
                            <p class="text-lightning-yellow-400 text-base font-normal">
                              {{
                                formatRupiah(
                                  calculateFinalPrice(
                                    pkg.price,
                                    pkg.discount_type,
                                    pkg.discount_value,
                                  ),
                                )
                              }}
                            </p>
                            <span
                              v-if="pkg.discount_type === 'fixed_amount'"
                              class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                              >-{{ formatRupiah(pkg.discount_value) }}</span
                            >
                            <span
                              v-if="pkg.discount_type === 'percentage'"
                              class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                              >-{{ pkg.discount_value }}%</span
                            >
                          </div>
                        </template>
                        <!-- No Discount -->
                        <template v-else>
                          <div>
                            <p class="text-base font-normal text-gray-200">
                              {{ formatRupiah(pkg.price) }}
                            </p>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </div>

            <div class="flex flex-col gap-4">
              <hr class="rounded-full border-gray-700" />
              <div class="flex flex-col flex-wrap gap-2">
                <ButtonComponent
                  @click="goToDetail(product.slug)"
                  variant="solid"
                  textColor="black"
                >
                  Lihat Detail
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- END : PRODUCT CARD -->
    </div>
    <!-- END : LIST PRODUCTS -->
  </div>
</template>
