<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { getPublicImageUrl } from '@/utils/storageHelper';

// 📌 Stores
import { useOrderStore } from '@/stores/orderStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
import DiscountPriceComponent from '@/components/discounts/DiscountPrice.vue';

// 📌 Icons
import FileUploadIcon from '@/components/icons/FileUpload.vue';
import EyeIcon from '@/components/icons/Eye.vue';

// 📌 ...
const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrdersByUser();
});
</script>

<template>
  <div class="flex flex-col gap-5 rounded-xl bg-gray-900 px-5 py-5">
    <!-- START : Title & Filter -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-6 w-1 rounded-md bg-yellow-500"></div>
        <p class="text-lg font-medium sm:text-xl">Riwayat Transaksi</p>
      </div>
      <!-- <div>tools</div> -->
    </div>
    <!-- END : Title & Filter -->

    <!-- START : Transaction History -->
    <div class="flex flex-col gap-2">
      <template v-for="order in orderStore.orders" :key="order.id">
        <div class="flex flex-col overflow-hidden rounded-xl">
          <!-- START : Top -->
          <div
            class="flex flex-col gap-3 bg-gray-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
          >
            <!-- App -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <!--  -->
              <div class="flex w-60">
                <div class="flex items-center gap-3">
                  <img
                    :src="getPublicImageUrl(order.product_image_path, 'product')"
                    alt="Produk"
                    class="max-h-8"
                  />
                  <p class="text-sm font-medium">
                    {{ order.product_name }}
                  </p>
                </div>
              </div>
              <!--  -->
              <div class="flex w-36 flex-col gap-1">
                <p class="text-sm font-normal text-gray-400">Paket</p>
                <p class="text-sm font-medium text-white">{{ order.product_package_name }}</p>
              </div>
              <!--  -->
              <div class="flex w-72 flex-col gap-1">
                <p class="text-sm font-normal text-gray-400">Harga</p>

                <DiscountPriceComponent
                  :price="order.product_package_price"
                  :discount-type="order.product_package_discount_type"
                  :discount-value="order.product_package_discount_value"
                />
              </div>
              <!--  -->
              <div class="flex w-36 flex-col gap-1">
                <p class="text-sm font-normal text-gray-400">Durasi</p>
                <p class="text-sm font-medium text-white">
                  {{ order.product_package_duration_name }}
                </p>
              </div>
              <!--  -->
              <div class="flex w-36 flex-col gap-1">
                <p class="text-sm font-normal text-gray-400">Total Harga</p>
                <p class="text-sm font-medium text-white">
                  {{ formatRupiah(order.total_price) }}
                </p>
              </div>
            </div>
            <!-- Status -->
            <div class="flex w-24 flex-col gap-1 sm:items-end">
              <p class="text-sm font-normal text-gray-400">Status</p>
              <template v-if="order.status">
                <p
                  class="rounded-full px-3 py-1 text-center text-xs font-medium capitalize"
                  :class="[
                    {
                      'bg-yellow-500/10 text-yellow-500': order.status === 'pending',
                      'bg-blue-500/10 text-blue-500': order.status === 'dibayar',
                      'bg-green-500/10 text-green-500': order.status === 'selesai',
                      'bg-red-500/10 text-red-500': order.status === 'gagal',
                    },
                  ]"
                >
                  {{ order.status }}
                </p>
              </template>
            </div>
          </div>
          <!-- END : Top -->
          <!-- START : Bottom -->
          <div
            class="flex justify-center border-t border-gray-700 bg-gray-800 px-5 py-3 sm:justify-end"
          >
            <div class="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
              <!-- Lihat Bukti Pembayaran -->
              <template v-if="order?.payment_proof_image_url">
                <a :href="order.payment_proof_image_url" target="_blank" rel="noopener" class="">
                  <ButtonComponent
                    variant="solid"
                    size="sm"
                    color="green"
                    textColor="black"
                    class="w-full"
                  >
                    <FileUploadIcon class="size-5" />
                    <span>Lihat Bukti Pembayaran</span>
                  </ButtonComponent>
                </a>
              </template>

              <!-- Unggah Bukti Pembayaran -->
              <template v-else>
                <RouterLink :to="{ name: 'CustomerPayment', query: { orderId: order?.id } }">
                  <ButtonComponent
                    variant="solid"
                    size="sm"
                    color="cyan"
                    textColor="black"
                    class="w-full"
                  >
                    <FileUploadIcon class="size-5" />
                    <span>Unggah Bukti Pembayaran</span>
                  </ButtonComponent>
                </RouterLink>
              </template>

              <!-- Lihat Akun -->
              <ButtonComponent variant="solid" size="sm" textColor="black">
                <EyeIcon class="size-5" />
                <span>Lihat Produk</span>
              </ButtonComponent>
            </div>
          </div>
          <!-- END : Bottom -->
        </div>
      </template>
    </div>
    <!-- END : Transaction History -->
  </div>
</template>
