<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import { useOrderStore } from '@/stores/orderStore';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

import WaveLoaderComponent from '@/components/loaders/WaveLoader.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import ConfirmOrderModalComponent from './components/modals/ConfirmOrderModal.vue';

import BoxOpenSolidIcon from '@/components/icons/BoxOpenSolid.vue';
import Products from './Products.vue';

const route = useRoute();
const authStore = useAuthStore();
const productStore = useProductStore();
const orderStore = useOrderStore();

const product = ref(null);

onMounted(async () => {
  product.value = await productStore.fetchProductBySlug(route.params.slug);
});

const selectedPackage = ref(null);
const selectedDuration = ref(null);

const selectPackage = (pkg) => {
  selectedPackage.value = pkg;
  selectedDuration.value = null;
};

const selectDuration = (duration) => {
  selectedDuration.value = duration;
};

// Harga Total
const totalPrice = computed(() => {
  if (!selectedPackage.value || !selectedDuration.value) return 0;

  const finalPrice = calculateFinalPrice(
    selectedPackage.value.price,
    selectedPackage.value.discount_type,
    selectedPackage.value.discount_value,
  );

  return finalPrice * selectedDuration.value.value;
});

// Modal Konfirmasi Pesanan
const confirmOrderModalRef = ref(null);

function openConfirmOrderModal() {
  console.log(selectedPackage.value);

  if (!product.value || !selectedPackage.value || !selectedDuration.value)
    return alert('Harap pilih paket dan durasi terlebih dahulu');

  confirmOrderModalRef.value.openModal({
    product: product.value,
    pkg: selectedPackage.value,
    duration: selectedDuration.value,
    totalPrice: totalPrice.value,
  });
}

function closeConfirmOrderModal() {
  confirmOrderModalRef.value.closeModal();
}
</script>

<template>
  <ConfirmOrderModalComponent ref="confirmOrderModalRef" />

  <!-- START : Loading -> Page -->
  <template v-if="productStore.loading">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <WaveLoaderComponent />
    </div>
  </template>
  <!-- END : Loading -> Page -->

  <template v-else>
    <div class="flex min-h-screen flex-col gap-8 px-24 py-6">
      <!-- START : DETAIL PRODUCT -->
      <div v-if="product" class="flex w-full gap-5">
        <!-- START : LEFT -->
        <div class="flex w-2/3 flex-col gap-5">
          <div class="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-5">
            <img
              v-if="product.image_url"
              :src="product.image_url"
              alt="Produk"
              class="max-h-16 w-fit"
            />
            <div class="flex items-center gap-4">
              <p class="text-4xl font-semibold">{{ product.name }}</p>
              <p class="bg-lightning-yellow-400 w-fit rounded-sm px-3 py-0.5 text-sm text-black">
                {{ product.category }}
              </p>
            </div>
          </div>
          <p class="text-sm font-normal text-white">{{ product.description }}</p>
        </div>
        <!-- END : LEFT -->

        <!-- START : RIGHT -->
        <div class="flex w-1/3 flex-col gap-5 rounded-lg bg-gray-900 px-5 py-5">
          <p class="text-xl font-medium">📋 Buat Pesanan</p>
          <!-- Pilih Paket -->
          <div class="flex flex-col gap-3">
            <p class="text-sm text-gray-400">Pilih paket :</p>
            <template v-if="product.product_packages && product.product_packages.length">
              <div class="flex flex-col gap-2">
                <template v-for="pkg in product.product_packages" :key="pkg.id">
                  <div
                    @click="selectPackage(pkg)"
                    class="flex items-center gap-3 rounded-lg px-4 py-2 hover:cursor-pointer"
                    :class="
                      selectedPackage?.id === pkg.id
                        ? 'outline-lightning-yellow-400 bg-gray-900 outline'
                        : 'bg-gray-800'
                    "
                  >
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
          <!-- Pilih Durasi -->
          <div class="flex flex-col gap-3">
            <p class="text-sm text-gray-400">Pilih durasi :</p>

            <template v-if="!selectedPackage">
              <p class="text-sm font-normal text-gray-600">Pilih paket untuk melihat durasi</p>
            </template>
            <template v-else>
              <template
                v-if="
                  !selectedPackage.product_package_durations ||
                  !selectedPackage.product_package_durations.length
                "
              >
                <p class="text-sm font-normal text-gray-600">
                  Mohon maaf, untuk saat ini pilihan durasi belum tersedia
                </p>
              </template>
              <template v-else>
                <div class="grid grid-cols-2 gap-2">
                  <template
                    v-for="duration in selectedPackage.product_package_durations"
                    :key="duration.id"
                  >
                    <div
                      @click="selectDuration(duration)"
                      class="rounded-lg px-4 py-2 text-center hover:cursor-pointer"
                      :class="[
                        selectedDuration?.id === duration.id
                          ? 'outline-lightning-yellow-400 bg-gray-900 outline'
                          : 'bg-gray-800',
                      ]"
                    >
                      <p class="text-sm">{{ duration.name }}</p>
                    </div>
                  </template>
                </div>
              </template>
            </template>
          </div>

          <!-- Total Harga -->
          <div class="flex items-center justify-between">
            <p>Total Harga :</p>
            <p>{{ formatRupiah(totalPrice) }}</p>
          </div>
          <!-- Buat Pesanan -->
          <ButtonComponent
            v-if="!authStore.isAuthenticated"
            variant="solid"
            textColor="black"
            disabled=""
          >
            Buat Pesanan
          </ButtonComponent>
          <ButtonComponent
            v-else
            @click="openConfirmOrderModal()"
            variant="solid"
            textColor="black"
          >
            Buat Pesanan
          </ButtonComponent>
        </div>
        <!-- END : RIGHT -->
      </div>
      <!-- END : DETAIL PRODUCT -->

      <!-- START : LOADING -->
      <div v-else>Loading...</div>
      <!-- END : LOADING -->
    </div>
  </template>
</template>
