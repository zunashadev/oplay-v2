<script setup>
import { computed } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { getPublicImageUrl } from '@/utils/storageHelper';

import ButtonComponent from '@/components/buttons/Button.vue';
import DiscountPriceComponent from '@/components/discounts/DiscountPrice.vue';

import BoxOpenSolidIcon from '@/components/icons/BoxOpenSolid.vue';
import NotFoundMagnifyingGlass from '@/components/icons/NotFoundMagnifyingGlass.vue';
import ArrowCircleRightIcon from '@/components/icons/ArrowCircleRight.vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click-detail']);

const handleClickDetail = () => {
  emit('click-detail', props.product.slug);
};
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-4xl">
    <div class="flex flex-1 flex-col bg-white">
      <div class="flex flex-1 flex-col px-3 py-3 sm:px-5 sm:py-5">
        <!-- ... -->
        <div class="flex flex-1 flex-col gap-5 pb-5">
          <div class="flex flex-none items-start justify-between py-2">
            <!-- Logo Produk -->
            <img
              :src="getPublicImageUrl(product.product_image_path, 'product')"
              alt="Produk"
              class="max-h-14 max-w-24"
            />

            <!-- Kategori  Produk -->
            <div class="flex flex-col items-end justify-end gap-2">
              <div class="w-fit rounded-2xl bg-cyan-700 px-4 py-0.5 text-xs">
                {{ product.product_categories.name }}
              </div>
            </div>
          </div>

          <div class="flex-none">
            <p class="text-2xl font-bold text-gray-950">{{ product.name }}</p>
          </div>

          <hr class="-mx-5 rounded-full border-gray-200" />

          <!-- Paket -->
          <template v-if="product.product_packages && product.product_packages.length">
            <div class="flex flex-col gap-3">
              <template v-for="pkg in product.product_packages" :key="pkg.id">
                <div class="flex items-center gap-1.5 sm:gap-3">
                  <div class="flex-none">
                    <BoxOpenSolidIcon class="size-3 text-gray-400 sm:size-4" />
                  </div>
                  <div class="flex flex-col">
                    <p class="text-xs font-normal text-gray-500">
                      {{ pkg.name }} <span v-if="pkg.is_best_seller">🔥</span>
                    </p>
                    <DiscountPriceComponent
                      :price="pkg.price"
                      :discount-type="pkg.discount_type"
                      :discount-value="pkg.discount_value"
                    />
                  </div>
                </div>
              </template>
            </div>
          </template>
          <!-- Tidak ada paket -->
          <template v-else>
            <div class="flex flex-1 flex-col items-center justify-center gap-3">
              <NotFoundMagnifyingGlass class="size-8 text-gray-500" />
              <p class="text-center text-xs font-normal text-gray-500">
                Maaf, untuk saat ini paket belum tersedia
              </p>
            </div>
          </template>
        </div>

        <!-- Button -->
        <div class="flex flex-col gap-4">
          <hr class="-mx-5 rounded-full border-gray-200" />
          <div class="flex flex-col flex-wrap gap-2">
            <ButtonComponent
              @click="handleClickDetail"
              variant="solid"
              textColor="black"
              color="yellow"
              class="group"
            >
              <div class="flex items-center gap-0 transition-all group-hover:gap-6">
                <p class="-mr-4">Lihat Detail</p>
                <ArrowCircleRightIcon
                  class="size-4 text-black opacity-0 transition-all group-hover:opacity-100"
                />
              </div>
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
