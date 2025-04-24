<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';

// 📌 Stores
import { useWalletStore } from '@/stores/walletStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 ...
const walletStore = useWalletStore();

onMounted(() => {
  walletStore.fetchWalletByUser();
});
</script>

<template>
  <div class="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:gap-5">
    <!-- START : Jumlah Akun Aktif -->
    <div class="flex w-full flex-1 items-center justify-between rounded-xl bg-gray-900 px-5 py-5">
      <!-- Left -->
      <div class="flex items-center gap-4">
        <img src="/images/apps.png" class="h-8 w-auto sm:h-10" />
        <p class="font-medium text-white">Akun Aktif</p>
      </div>
      <!-- Right -->
      <div class="text-end">
        <p class="text-xl font-medium text-white">12</p>
        <p class="text-xs text-gray-500">Akun</p>
      </div>
    </div>
    <!-- END : Jumlah Akun Aktif -->

    <!-- START : Jumlah Refferal -->
    <div class="flex w-full flex-1 items-center justify-between rounded-xl bg-gray-900 px-5 py-5">
      <!-- Left -->
      <div class="flex items-center gap-4">
        <img src="/images/referral.png" class="h-8 w-auto sm:h-10" />
        <p class="font-medium text-white">Jumlah Refferal</p>
      </div>
      <!-- Right -->
      <div class="text-end">
        <p class="text-xl font-medium text-white">12</p>
        <p class="text-xs text-gray-500">Akun</p>
      </div>
    </div>
    <!-- END : Jumlah Refferal -->

    <!-- START : Saldo -->
    <div
      class="flex w-full flex-1 flex-col items-center justify-between gap-4 rounded-xl bg-gray-900 px-5 py-5 sm:flex-row sm:gap-3"
    >
      <!-- Left -->
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center gap-4">
          <img src="/images/money-bag.png" class="h-8 w-auto sm:h-10" />
          <p class="font-medium text-white">Saldo</p>
        </div>
        <div>
          <p v-if="walletStore.loading" class="text-center text-white">Memuat wallet...</p>
          <p
            v-else-if="walletStore.currentWallet"
            class="text-lightning-yellow-400 text-xl font-semibold"
          >
            {{ formatRupiah(walletStore.currentWallet?.balance) }}
          </p>
          <p v-else class="text-sm text-red-500">Saldo tidak tersedia 😢</p>
        </div>
      </div>
      <!-- Right -->
      <ButtonComponent textColor="black" size="sm" class="w-full sm:w-min">Gunakan</ButtonComponent>
    </div>
    <!-- END : Saldo -->
  </div>
</template>
