<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { getPublicImageUrl } from '@/utils/storageHelper';

import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import { useOrderStore } from '@/stores/orderStore';

// 📌 Components
import WaveLoaderComponent from '@/components/loaders/WaveLoader.vue';
import ButtonComponent from '@/components/buttons/Button.vue';
import DiscountPriceComponent from '@/components/discounts/DiscountPrice.vue';

import ConfirmOrderModalComponent from './components/modals/ConfirmOrderModal.vue';

// 📌 Icons
import BoxOpenSolidIcon from '@/components/icons/BoxOpenSolid.vue';
import AngleSmallLeftIcon from '@/components/icons/AngleSmallLeft.vue';
import WhatsAppIcon from '@/components/icons/social-media/WhatsApp.vue';

// 📌 Inisialisasi
const route = useRoute();
const router = useRouter();
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

// 📌 Harga Total
const totalPrice = computed(() => {
  if (!selectedPackage.value || !selectedDuration.value) return 0;

  const finalPrice = calculateFinalPrice(
    selectedPackage.value.price,
    selectedPackage.value.discount_type,
    selectedPackage.value.discount_value,
  );

  return finalPrice * selectedDuration.value.value;
});

// 📌 Modal Konfirmasi Pesanan (Website)
const confirmOrderModalRef = ref(null);

function openConfirmOrderModal() {
  // console.log(product.value);

  if (!product.value || !selectedPackage.value || !selectedDuration.value)
    return alert('Harap pilih paket dan durasi terlebih dahulu');

  confirmOrderModalRef.value.openModal({
    product: product.value,
    pkg: selectedPackage.value,
    duration: selectedDuration.value,
    totalPrice: totalPrice.value,
  });
}

// 📌 Modal Konfirmasi Pesanan (WhatsApp)
function openConfirmOrderModalViaWhatsapp() {
  alert('Buat pesanan lewat WhatsApp');
}

// 📌 Page Page
function goBack() {
  router.back(); // atau router.go(-1)
}
</script>

<template>
  <ConfirmOrderModalComponent ref="confirmOrderModalRef" />

  <!-- START : Loading -->
  <template v-if="productStore.loading">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <WaveLoaderComponent />
    </div>
  </template>
  <!-- END : Loading -->

  <!-- START : Loading Done -->
  <template v-else>
    <div class="flex flex-col gap-8">
      <!-- START : Header -->
      <div class="flex items-center gap-3 sm:gap-6">
        <div
          @click="goBack"
          class="rounded-full bg-gray-800 p-1.5 transition-all hover:cursor-pointer hover:bg-gray-700"
        >
          <AngleSmallLeftIcon class="size-5" />
        </div>
        <p class="text-lg font-medium sm:text-xl">Detail Produk</p>
      </div>
      <!-- END : Header -->

      <div v-if="product" class="">
        <!-- START : Product -->
        <div class="relative">
          <!-- <div class="h-32 rounded-2xl bg-gray-700"></div> -->
          <img
            :src="getPublicImageUrl(product.product_banner_image_path, 'banner')"
            alt="Gambar"
            class="h-full max-h-32 w-full rounded-2xl object-cover sm:max-h-32"
          />
          <div class="absolute -bottom-12 w-full px-6 sm:-bottom-8 sm:px-12">
            <div
              class="flex flex-col items-center gap-3 rounded-2xl bg-gray-900/70 px-3 py-3 backdrop-blur-sm sm:flex-row sm:gap-5 sm:px-6 sm:py-5"
            >
              <img
                :src="getPublicImageUrl(product.product_image_path, 'product')"
                alt="Produk"
                class="max-h-16 w-fit sm:max-h-16"
              />

              <p class="text-xl font-semibold sm:text-4xl">{{ product.name }}</p>
            </div>
          </div>
        </div>
        <!-- END : Product -->

        <!-- START : Detail Produk -->
        <div class="mt-20 flex w-full flex-col gap-8 sm:mt-16 md:flex-row md:gap-5">
          <!-- START : Left -->
          <div class="flex h-fit w-full flex-col gap-5 rounded-2xl bg-gray-900 px-5 py-5 md:w-2/3">
            <div class="flex flex-col gap-3">
              <!-- Kategori -->
              <div class="flex flex-col gap-1">
                <p class="text-xs font-medium text-white sm:text-base">Kategori :</p>
                <p class="w-fit rounded-sm bg-cyan-700 px-3 py-0.5 text-xs text-white sm:text-sm">
                  {{ product.product_categories.name }}
                </p>
              </div>
              <!-- Metode Pengiriman -->
              <div class="flex flex-col gap-1">
                <p class="text-xs font-medium text-white sm:text-base">Metode Pengiriman :</p>
                <p class="w-fit rounded-sm bg-yellow-700 px-3 py-0.5 text-xs text-white sm:text-sm">
                  {{ product.delivery_types.label }}
                </p>
              </div>
            </div>

            <hr class="rounded-full border-gray-700" />

            <!-- Deskripsi -->
            <div class="flex flex-col gap-1">
              <p class="text-sm font-normal text-white">{{ product.description }}</p>
            </div>
          </div>
          <!-- END : Left -->

          <!-- START : Right -->
          <div class="flex h-fit w-full flex-col gap-5 rounded-2xl bg-gray-900 px-5 py-5 md:w-1/3">
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

              <template v-else>
                <p class="text-sm text-gray-600">Paket belum tersedia</p>
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

            <hr class="rounded-full border-gray-700" />

            <!-- Total Harga -->
            <div class="flex items-center justify-between">
              <p class="text-gray-400">Total Harga :</p>
              <p class="text-xl text-yellow-500">{{ formatRupiah(totalPrice) }}</p>
            </div>

            <!-- Tombol Buat Pesanan -->
            <div class="flex w-full flex-col gap-2">
              <ButtonComponent
                @click="openConfirmOrderModal()"
                variant="solid"
                textColor="black"
                :disabled="!authStore.isAuthenticated"
              >
                Buat Pesanan 🚀
              </ButtonComponent>
              <ButtonComponent
                @click="openConfirmOrderModalViaWhatsapp()"
                variant="solid"
                color="green"
                textColor="black"
              >
                <span>Buat Pesanan</span>
                <WhatsAppIcon class="size-5" />
              </ButtonComponent>
            </div>
          </div>
          <!-- END : Right -->
        </div>
        <!-- END : Detail Produk -->
      </div>

      <!-- START : Loading -->
      <!-- ! Perlu diperhatikan lagi -->
      <div v-else>
        <p>Maaf, terdapat kesalahan dalam memuat data produk :(</p>
      </div>
      <!-- END : Loading -->
    </div>
  </template>
  <!-- END : Loading Done -->
</template>
