<script setup>
import { ref, onMounted } from 'vue';

// 📌 Components
import MyProductCardComponent from '../components/MyProductCard.vue';

// 📌 Stores
import { useProductDeliveryStore } from '@/stores/productDeliveryStore';

// 📌 Inisialisasi Store
const productDeliveryStore = useProductDeliveryStore();

onMounted(() => {
  productDeliveryStore.fetchProductDeliveriesByUser('delivered');
});

// 📌 Konfirmasi Pengiriman Produk
const confirmProductDelivery = async (id) => {
  const result = await productDeliveryStore.confirmProductDelivery(id);

  if (result) {
    await productDeliveryStore.fetchProductDeliveriesByUser(); // refresh data
  }
};
</script>

<template>
  <div class="flex h-full flex-col gap-5 rounded-xl bg-gray-900 px-5 py-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-6 w-1 rounded-md bg-yellow-500"></div>
        <p class="text-xl font-medium">Produk Baru Kamu</p>
      </div>
      <RouterLink :to="{ name: 'CustomerDashboardMyProduct' }">
        <div
          class="text-sm text-gray-500 transition-all hover:cursor-pointer hover:text-yellow-500"
        >
          Lihat semua produk
        </div>
      </RouterLink>
    </div>

    <div class="flex flex-col gap-3">
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
          <MyProductCardComponent
            v-for="productDelivery in productDeliveryStore.productDeliveries"
            :key="productDelivery.id"
            :delivery="productDelivery"
            :onConfirm="confirmProductDelivery"
          />
        </template>
        <!-- END : Active Product -->
      </template>
      <!-- END : Loading Done -->
    </div>
  </div>
</template>
