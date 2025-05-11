<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';

// 📌 Stores
import { useWalletStore } from '@/stores/walletStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Icons
import ArrowUpRightIcon from '@/components/icons/ArrowUpRight.vue';

// 📌 Decorations
import DecorationOneDecoration from '@/components/decorations/DecorationOne.vue';

// 📌 ...
const walletStore = useWalletStore();

onMounted(() => {
  walletStore.fetchWalletByUser();
});
</script>

<template>
  <div class="flex w-full flex-col items-stretch gap-2 sm:gap-5 xl:flex-row">
    <div class="flex w-full flex-1 gap-2 sm:gap-5">
      <!-- 📌 START : Jumlah Akun -->
      <div
        class="flex w-full flex-1 flex-col items-start justify-between gap-2 rounded-xl bg-gray-900 px-3 py-3 sm:gap-3 sm:px-5 sm:py-5"
      >
        <!-- Top -->
        <div class="flex w-full justify-between">
          <div class="flex items-center gap-2 sm:gap-4">
            <div
              class="flex size-10 flex-none items-center justify-center rounded-xl bg-gray-800 sm:size-14"
            >
              <img src="/images/apps.png" class="h-6 w-auto sm:h-8" />
            </div>
            <p class="text-sm font-medium text-white sm:text-base">Produk Aktif</p>
          </div>
          <div>
            <RouterLink :to="{ name: 'CustomerDashboardMyProduct' }">
              <div
                class="group rounded-full border border-gray-700 p-1.5 transition-all hover:cursor-pointer hover:border-yellow-500 sm:p-2"
              >
                <ArrowUpRightIcon
                  class="size-2 text-gray-500 transition-all group-hover:text-yellow-500 sm:size-2.5"
                />
              </div>
            </RouterLink>
          </div>
        </div>
        <!-- Bottom -->
        <div class="w-full text-end">
          <div class="space-x-1 text-2xl font-medium text-white sm:text-3xl">
            <span>12</span>
            <span class="text-sm text-gray-500">/</span>
            <span class="text-sm text-gray-500">20</span>
          </div>
          <p class="text-xs text-gray-500">Produk</p>
        </div>
      </div>
      <!-- 📌 END : Jumlah Akun -->

      <!-- 📌 START : Jumlah Referral -->
      <div
        class="flex w-full flex-1 flex-col items-start justify-between gap-2 rounded-xl bg-gray-900 px-3 py-3 sm:gap-3 sm:px-5 sm:py-5"
      >
        <!-- Top -->
        <div class="flex w-full justify-between">
          <div class="flex items-center gap-2 sm:gap-4">
            <div
              class="flex size-10 flex-none items-center justify-center rounded-xl bg-gray-800 sm:size-14"
            >
              <img src="/images/referral.png" class="h-7 w-auto sm:h-9" />
            </div>
            <p class="text-sm font-medium text-white sm:text-base">Referral</p>
          </div>
          <div>
            <div
              class="group rounded-full border border-gray-700 p-1.5 transition-all hover:cursor-pointer hover:border-yellow-500 sm:p-2"
            >
              <ArrowUpRightIcon
                class="size-2 text-gray-500 transition-all group-hover:text-yellow-500 sm:size-2.5"
              />
            </div>
          </div>
        </div>
        <!-- Bottom -->
        <div class="w-full text-end">
          <p class="text-2xl font-medium text-white sm:text-3xl">8</p>
          <p class="text-xs text-gray-500">Pengguna</p>
        </div>
      </div>
      <!-- 📌 END : Jumlah Referral -->
    </div>

    <!-- 📌 START : Saldo -->
    <div
      class="relative flex w-full flex-1 flex-col items-start justify-between gap-2 overflow-hidden rounded-xl bg-gray-900 px-3 py-3 sm:gap-3 sm:px-5 sm:py-5"
    >
      <DecorationOneDecoration class="absolute -bottom-16 -left-10 w-32 text-gray-800" />
      <!-- Top -->
      <div class="z-10 flex w-full justify-between">
        <div class="flex items-center gap-2 sm:gap-4">
          <div
            class="flex size-10 flex-none items-center justify-center rounded-xl bg-gray-800 sm:size-14"
          >
            <img src="/images/money-bag.png" class="h-6 w-auto sm:h-8" />
          </div>
          <p class="text-sm font-medium text-white sm:text-base">Saldo</p>
        </div>
        <div>
          <div
            class="group rounded-full border border-gray-700 p-1.5 transition-all hover:cursor-pointer hover:border-yellow-500 sm:p-2"
          >
            <ArrowUpRightIcon
              class="size-2 text-gray-500 transition-all group-hover:text-yellow-500 sm:size-2.5"
            />
          </div>
        </div>
      </div>
      <!-- Bottom -->
      <div class="z-10 flex w-full flex-col items-center justify-end gap-3 text-end sm:flex-row">
        <!-- Saldo -->
        <div class="">
          <p v-if="walletStore.loading" class="text-center text-white">Memuat wallet...</p>
          <p v-else-if="walletStore.currentWallet" class="text-2xl font-semibold text-yellow-500">
            {{ formatRupiah(walletStore.currentWallet?.balance) }}
          </p>
          <p v-else class="text-sm text-red-500">Saldo tidak tersedia 😢</p>
        </div>
        <!-- Button -->
        <ButtonComponent textColor="black" size="xs" class="w-full sm:w-min">
          Gunakan
        </ButtonComponent>
      </div>
    </div>
    <!-- 📌END : Saldo -->
  </div>
</template>
