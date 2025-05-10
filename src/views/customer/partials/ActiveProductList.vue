<script setup>
import { ref, onMounted } from 'vue';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Stores
import { useProductDeliveryStore } from '@/stores/productDeliveryStore';

// 📌 Inisialisasi Store
const productDeliveryStore = useProductDeliveryStore();

onMounted(() => {
  productDeliveryStore.fetchProductDeliveriesByUser();
});

// 📌 Format Key
const formatKey = (key) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>

<template>
  <div class="flex h-full flex-col gap-5 rounded-xl bg-gray-900 px-5 py-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-6 w-1 rounded-md bg-yellow-500"></div>
        <p class="text-xl font-medium">Produk Aktif</p>
      </div>
      <!-- <div>tools</div> -->
    </div>

    <div class="flex flex-col gap-1">
      <!-- START : Loading -->
      <template v-if="productDeliveryStore.loading">
        <div
          v-for="x in 2"
          :key="x"
          class="flex animate-pulse items-center justify-between gap-3 rounded-lg bg-gray-800 px-4 py-2 sm:px-5 sm:py-2.5"
        >
          <div class="flex items-center gap-3">
            <div class="flex-none">
              <div class="size-6 rounded-full bg-gray-600 sm:size-8"></div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="h-4 w-16 rounded bg-gray-600 sm:w-20"></div>
              <div class="h-3 w-24 rounded bg-gray-700 sm:w-28"></div>
            </div>
          </div>
        </div>
      </template>
      <!-- END : Loading -->

      <!-- START : Loading Done -->
      <template v-else>
        <!-- START : No Active Product -->
        <template
          v-if="
            !productDeliveryStore.productDeliveries ||
            productDeliveryStore.productDeliveries.length === 0
          "
        >
          <div class="flex flex-col items-center justify-center gap-1">
            <p class="text-sm text-gray-500">Belum ada produk yang aktif ☹️</p>
          </div>
        </template>
        <!-- END : No Active Product -->

        <!-- START : Active Product -->
        <template v-else>
          <template
            v-for="productDelivery in productDeliveryStore.productDeliveries"
            :key="productDelivery.id"
          >
            <!-- Customer to Admin -->
            <div
              class="flex flex-col gap-3 bg-gray-800 px-4 py-3 first:rounded-t-lg last:rounded-b-lg sm:px-5 sm:py-5"
            >
              <div class="flex items-center justify-between">
                <p class="font-medium">{{ productDelivery.delivery_types.label }}</p>
                <div
                  class="rounded-full px-2.5 py-1 text-xs capitalize"
                  :class="{
                    'bg-yellow-500/10 text-yellow-500': productDelivery.status === 'pending',
                    'bg-blue-500/10 text-blue-500': productDelivery.status === 'delivered',
                    'bg-green-500/10 text-green-500': productDelivery.status === 'confirmed',
                    'bg-red-500/10 text-red-500': productDelivery.status === 'failed',
                    'bg-gray-500/10 text-gray-500': ![
                      'pending',
                      'delivered',
                      'confirmed',
                      'failed',
                    ].includes(productDelivery.status),
                  }"
                >
                  {{ productDelivery.status }}
                </div>
              </div>

              <hr class="rounded-full border-gray-700" />

              <div class="flex flex-col gap-1">
                <div
                  v-for="[key, value] in Object.entries(productDelivery?.metadata || {})"
                  :key="key"
                >
                  <div class="flex items-center gap-1">
                    <p class="text-sm text-gray-500 capitalize">{{ formatKey(key) }} :</p>
                    <p v-if="value" class="text-sm">{{ value }}</p>
                    <p v-else class="text-sm text-red-500">Belum tersedia</p>
                  </div>
                </div>
              </div>

              <hr class="rounded-full border-gray-700" />

              <div class="flex flex-col items-center justify-end gap-1 sm:flex-row sm:gap-3">
                <ButtonComponent size="xs" color="green" textColor="black" class="w-full sm:w-1/2">
                  Konfirmasi Produk
                </ButtonComponent>
                <ButtonComponent size="xs" color="red" textColor="black" class="w-full sm:w-1/2">
                  Ajukan Pengembalian
                </ButtonComponent>
              </div>
            </div>
          </template>
        </template>
        <!-- END : Active Product -->
      </template>
      <!-- END : Loading Done -->
    </div>
  </div>
</template>
