<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

// Stores
import { useOrderStore } from '@/stores/orderStore';

// Components
import ButtonComponent from '@/components/buttons/Button.vue';

// Icons
import FileUploadIcon from '@/components/icons/FileUpload.vue';
import EyeIcon from '@/components/icons/Eye.vue';

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
        <div class="bg-lightning-yellow-400 h-6 w-1 rounded-md"></div>
        <p class="text-xl font-medium">Riwayat Transaksi</p>
      </div>
      <div>tools</div>
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
                    v-if="order.product_image_url"
                    :src="order.product_image_url"
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
                <p class="text-sm font-normal text-gray-500">Paket</p>
                <p class="text-sm font-medium text-white">{{ order.product_package_name }}</p>
              </div>
              <!--  -->
              <div class="flex w-72 flex-col gap-1">
                <p class="text-sm font-normal text-gray-500">Harga</p>

                <!-- Discount -->
                <template
                  v-if="
                    order.product_package_discount_type &&
                    order.product_package_discount_type !== '' &&
                    order.product_package_discount_value > 0
                  "
                >
                  <div class="flex items-center gap-1">
                    <p class="text-sm font-normal text-gray-500 line-through">
                      {{ formatRupiah(order.product_package_price) }}
                    </p>
                    <p class="text-lightning-yellow-400 text-sm font-normal">
                      {{
                        formatRupiah(
                          calculateFinalPrice(
                            order.product_package_price,
                            order.product_package_discount_type,
                            order.product_package_discount_value,
                          ),
                        )
                      }}
                    </p>
                    <span
                      v-if="order.product_package_discount_type === 'fixed_amount'"
                      class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                      >-{{ formatRupiah(order.product_package_discount_value) }}</span
                    >
                    <span
                      v-if="order.product_package_discount_type === 'percentage'"
                      class="ml-2 rounded-sm bg-red-500 px-1.5 text-xs"
                      >-{{ order.product_package_discount_value }}%</span
                    >
                  </div>
                </template>
                <!-- No Discount -->
                <template v-else>
                  <div>
                    <p class="text-sm font-normal text-gray-200">
                      {{ formatRupiah(order.product_package_price) }}
                    </p>
                  </div>
                </template>
              </div>
              <!--  -->
              <div class="flex w-36 flex-col gap-1">
                <p class="text-sm font-normal text-gray-500">Durasi</p>
                <p class="text-sm font-medium text-white">
                  {{ order.product_package_duration_name }}
                </p>
              </div>
              <!--  -->
              <div class="flex w-36 flex-col gap-1">
                <p class="text-sm font-normal text-gray-500">Total Harga</p>
                <p class="text-sm font-medium text-white">
                  {{ formatRupiah(order.total_price) }}
                </p>
              </div>
            </div>
            <!-- Status -->
            <div class="flex w-24 flex-col gap-1 sm:items-end">
              <p class="text-sm font-normal text-gray-500">Status</p>
              <template v-if="order.status">
                <p
                  class="rounded-full px-3 py-1 text-center text-xs font-medium capitalize"
                  :class="[
                    {
                      'text-lightning-yellow-400 bg-lightning-yellow-400/10':
                        order.status === 'pending',
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
          <div class="flex justify-center bg-gray-700 px-5 py-3 sm:justify-end">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <!-- Lihat Bukti Pembayaran -->
              <template v-if="order?.payment_proof_image_url">
                <a :href="order.payment_proof_image_url" target="_blank" rel="noopener">
                  <ButtonComponent variant="solid" size="xs" textColor="black">
                    <FileUploadIcon class="size-5" />
                    <span>Lihat Bukti Pembayaran</span>
                  </ButtonComponent>
                </a>
              </template>
              <!-- Unggah Bukti Pembayaran -->
              <template v-else>
                <RouterLink :to="{ name: 'CustomerPayment', query: { orderId: order?.id } }">
                  <ButtonComponent variant="solid" size="xs" color="green" textColor="black">
                    <FileUploadIcon class="size-5" />
                    <span>Unggah Bukti Pembayaran</span>
                  </ButtonComponent>
                </RouterLink>
              </template>
              <!-- Lihat Akun -->
              <ButtonComponent variant="solid" size="xs" textColor="black">
                <EyeIcon class="size-5" />
                <span>Lihat Akun</span>
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
