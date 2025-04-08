<script setup>
import { ref, onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { formatRupiah } from '@/utils/format';
import { calculateFinalPrice } from '@/utils/priceCalculator';

import ButtonComponent from '@/components/buttons/Button.vue';

import FileUploadIcon from '@/components/icons/FileUpload.vue';
import EyeIcon from '@/components/icons/Eye.vue';

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrdersByUser();
});
</script>

<template>
  <div
    class="overflow-hidden rounded-xl bg-gradient-to-b from-gray-200/50 via-gray-400/50 to-gray-600/50 p-[1px]"
  >
    <div
      class="flex flex-col gap-5 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 px-5 py-5"
    >
      <div>
        <p class="flex gap-3 text-xl font-normal">
          <span>🧾</span>
          <span>Riwayat Transaksi</span>
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <template v-for="order in orderStore.orders" :key="order.id">
          <div class="flex flex-col overflow-hidden rounded-xl bg-gray-700">
            <div class="flex items-center justify-between px-5 py-5">
              <div class="flex items-center gap-5">
                <!--  -->
                <div class="flex w-60">
                  <div class="flex items-center gap-2">
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
                  <p class="text-sm font-normal text-gray-400">Paket</p>
                  <p class="text-sm font-medium text-white">{{ order.product_package_name }}</p>
                </div>
                <!--  -->
                <div class="flex w-72 flex-col gap-1">
                  <p class="text-sm font-normal text-gray-400">Harga</p>

                  <!-- Discount -->
                  <template
                    v-if="
                      order.product_package_discount_type &&
                      order.product_package_discount_type !== '' &&
                      order.product_package_discount_value > 0
                    "
                  >
                    <div class="flex items-center gap-1">
                      <p class="text-sm font-normal text-gray-400 line-through">
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
                      <p class="text-base font-normal text-gray-200">
                        {{ formatRupiah(order.product_package_price) }}
                      </p>
                    </div>
                  </template>
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
              <div class="flex w-24 flex-col items-end gap-1">
                <p class="text-sm font-normal text-gray-400">Status</p>
                <template v-if="order.status">
                  <p
                    v-if="order.status === 'pending'"
                    class="text-lightning-yellow-400 text-sm font-medium capitalize"
                  >
                    {{ order.status }}
                  </p>
                  <p
                    v-else-if="order.status === 'dibayar'"
                    class="text-sm font-medium text-blue-500 capitalize"
                  >
                    {{ order.status }}
                  </p>
                  <p
                    v-else-if="order.status === 'selesai'"
                    class="text-sm font-medium text-green-500 capitalize"
                  >
                    {{ order.status }}
                  </p>
                  <p
                    v-else-if="order.status === 'gagal'"
                    class="text-sm font-medium text-red-500 capitalize"
                  >
                    {{ order.status }}
                  </p>
                </template>
              </div>
            </div>
            <div class="flex justify-end bg-gray-600 px-5 py-3">
              <div class="flex items-center gap-2">
                <ButtonComponent variant="solid" size="sm" color="green" textColor="black">
                  <FileUploadIcon class="size-5" />
                  <span>Unggah Bukti Pembayaran</span>
                </ButtonComponent>
                <ButtonComponent variant="solid" size="sm" textColor="black">
                  <EyeIcon class="size-5" />
                  <span>Lihat Akun</span>
                </ButtonComponent>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
