<script setup>
import { computed } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

import ButtonComponent from '@/components/buttons/Button.vue';

import BoxOpenSolidIcon from '@/components/icons/BoxOpenSolid.vue';
import BrokenImageIcon from '@/components/icons/BrokenImage.vue';
import NotFoundMagnifyingGlass from '@/components/icons/NotFoundMagnifyingGlass.vue';

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
    <!-- Top -->
    <div class="relative">
      <div class="flex">
        <div class="h-3 w-full rounded-t-4xl bg-gray-50"></div>
        <div class="h-3 w-12 flex-none rounded-t-4xl bg-gray-950"></div>
        <div class="h-3 w-full rounded-t-4xl bg-gray-50"></div>
      </div>
      <!--  -->
      <div
        class="absolute top-3 left-1/2 h-6 w-12 -translate-x-1/2 rounded-b-4xl bg-gray-950"
      ></div>
      <div class="h-10 bg-gray-50"></div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col bg-white">
      <div class="flex flex-1 flex-col border-y-2 border-dashed border-gray-300 px-5 py-5">
        <div class="flex flex-1 flex-col gap-5 pb-5">
          <div class="flex flex-none items-start justify-between">
            <!-- Logo Produk -->
            <img
              v-if="product?.image_url && product.image_url.trim().length"
              :src="product.image_url"
              alt="Produk"
              class="max-h-14"
            />
            <div v-else class="flex size-14 items-center justify-center rounded-md bg-gray-200">
              <BrokenImageIcon class="w-4 text-gray-500" />
            </div>
            <!-- Kategori Produk -->
            <div class="rounded-2xl bg-cyan-700 px-4 py-0.5 text-xs">
              {{ product.category }}
            </div>
          </div>

          <div class="flex-none">
            <p class="text-2xl font-bold text-gray-950">{{ product.name }}</p>
            <p class="line-clamp-2 text-sm font-normal text-gray-500">
              {{ product.description }}
            </p>
          </div>

          <hr class="-mx-5 rounded-full border-gray-200" />

          <!-- Paket -->
          <template v-if="product.product_packages && product.product_packages.length">
            <div class="flex flex-col gap-3">
              <template v-for="pkg in product.product_packages" :key="pkg.id">
                <div class="flex items-center gap-3">
                  <BoxOpenSolidIcon class="size-4 text-gray-500" />
                  <div>
                    <p class="text-xs font-normal text-gray-500">
                      {{ pkg.name }} <span v-if="pkg.is_best_seller">🔥</span>
                    </p>

                    <template v-if="pkg.discount_type && pkg.discount_value > 0">
                      <div class="flex items-center gap-1">
                        <p class="text-xs font-normal text-gray-500 line-through">
                          {{ formatRupiah(pkg.price) }}
                        </p>
                        <p class="text-base font-normal text-yellow-500">
                          {{
                            formatRupiah(
                              calculateFinalPrice(pkg.price, pkg.discount_type, pkg.discount_value),
                            )
                          }}
                        </p>
                        <span
                          v-if="pkg.discount_type === 'fixed_amount'"
                          class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                        >
                          -{{ formatRupiah(pkg.discount_value) }}
                        </span>
                        <span
                          v-if="pkg.discount_type === 'percentage'"
                          class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                        >
                          -{{ pkg.discount_value }}%
                        </span>
                      </div>
                    </template>

                    <template v-else>
                      <p class="text-base font-normal text-yellow-500">
                        {{ formatRupiah(pkg.price) }}
                      </p>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <!-- Tidak ada paket -->
          <template v-else>
            <div class="flex flex-1 flex-col items-center justify-center gap-3">
              <NotFoundMagnifyingGlass class="size-8 text-gray-500" />
              <p class="text-xs font-normal text-gray-500">
                Maaf, untuk saat ini paket belum tersedia
              </p>
            </div>
          </template>
        </div>

        <!-- Button -->
        <div class="flex flex-col gap-4">
          <hr class="-mx-5 rounded-full border-gray-200" />
          <div class="flex flex-col flex-wrap gap-2">
            <ButtonComponent @click="handleClickDetail" variant="solid" textColor="black">
              Lihat Detail
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div class="relative rotate-180">
      <div class="flex">
        <div class="h-3 w-full rounded-t-4xl bg-gray-50"></div>
        <div class="h-3 w-12 flex-none rounded-t-4xl bg-gray-950"></div>
        <div class="h-3 w-full rounded-t-4xl bg-gray-50"></div>
      </div>
      <!-- ... -->
      <div
        class="absolute top-3 left-1/2 h-6 w-12 -translate-x-1/2 rounded-b-4xl bg-gray-950"
      ></div>
      <div class="h-10 bg-gray-50"></div>
    </div>
  </div>
</template>
