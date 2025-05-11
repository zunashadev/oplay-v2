<script setup>
// 📌 Icons
import OrderHistoryIcon from '@/components/icons/OrderHistory.vue';
import ShippingFastIcon from '@/components/icons/ShippingFast.vue';
</script>

<template>
  <div class="relative w-full">
    <!-- Scrollable area -->
    <div class="scrollbar-hidden page-padding-x overflow-x-auto">
      <!-- Isi konten -->
      <div class="mx-auto flex w-max items-center justify-start gap-2 sm:gap-5">
        <!-- Pengiriman Produk -->
        <div class="flex shrink-0 flex-col items-center justify-start gap-2">
          <div
            class="flex size-24 items-center justify-center rounded-md bg-gray-900 px-2 py-2 sm:size-28"
          >
            <div class="flex flex-col items-center gap-2">
              <div class="p-1">
                <ShippingFastIcon class="size-6 text-blue-500" />
              </div>
              <p class="text-center text-xs">Pengiriman Produk</p>
            </div>
          </div>
        </div>
        <!-- Riwayat Transaksi -->
        <div class="flex shrink-0 flex-col items-center justify-start gap-2">
          <div
            class="flex size-24 items-center justify-center rounded-md bg-gray-900 px-2 py-2 sm:size-28"
          >
            <div class="flex flex-col items-center gap-2">
              <div class="p-1">
                <OrderHistoryIcon class="size-6 text-yellow-500" />
              </div>
              <p class="text-center text-xs">Riwayat Transaksi</p>
            </div>
          </div>
        </div>
        <!-- Refferal -->
        <div class="flex shrink-0 flex-col items-center justify-start gap-2">
          <div
            class="flex size-24 items-center justify-center rounded-md bg-gray-900 px-2 py-2 sm:size-28"
          >
            <div class="flex flex-col items-center gap-2">
              <div class="p-1">
                <OrderHistoryIcon class="size-6 text-yellow-500" />
              </div>
              <p class="text-center text-xs">Refferal</p>
            </div>
          </div>
        </div>
        <!-- ! Nanti hapus -->
        <div
          v-for="x in 10"
          :key="x"
          class="flex shrink-0 flex-col items-center justify-start gap-2"
        >
          <div class="size-24 rounded-md bg-gray-900 sm:size-28">
            <div>
              <p class="text-center text-xs sm:text-sm">Menu {{ x }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
