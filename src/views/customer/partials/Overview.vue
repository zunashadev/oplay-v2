<script setup>
import { ref, onMounted } from 'vue';
import { formatRupiah } from '@/utils/format';

// 📌 Stores
import { useWalletStore } from '@/stores/walletStore';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Icons
import ArrowUpRightIcon from '@/components/icons/ArrowUpRight.vue';

// 📌 ...
const walletStore = useWalletStore();

onMounted(() => {
  walletStore.fetchWalletByUser();
});
</script>

<template>
  <div class="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:gap-5">
    <!-- 📌 START : Jumlah Akun -->
    <div
      class="bg-blue-charcoal-700 flex w-full flex-1 flex-col items-start justify-between gap-3 rounded-xl px-5 py-5"
    >
      <!-- Top -->
      <div class="flex w-full justify-between">
        <div class="flex items-center gap-4">
          <div class="bg-blue-charcoal-500 flex-none rounded-xl p-3">
            <img src="/images/apps.png" class="h-6 w-auto sm:h-8" />
          </div>
          <p class="font-medium text-white">Akun</p>
        </div>
        <div>
          <div class="rounded-full border border-gray-700 p-2">
            <ArrowUpRightIcon class="size-2.5 text-gray-500" />
          </div>
        </div>
      </div>
      <!-- Bottom -->
      <div class="w-full text-end">
        <p class="text-3xl font-medium text-white">12</p>
        <p class="text-xs text-gray-500">Akun</p>
      </div>
    </div>
    <!-- 📌 END : Jumlah Akun -->

    <!-- 📌 START : Jumlah Referral -->
    <div
      class="bg-blue-charcoal-500 flex w-full flex-1 flex-col items-start justify-between gap-3 rounded-xl px-5 py-5"
    >
      <!-- Top -->
      <div class="flex w-full justify-between">
        <div class="flex items-center gap-4">
          <div class="flex-none rounded-xl bg-gray-800 p-3">
            <img src="/images/referral.png" class="h-6 w-auto sm:h-8" />
          </div>
          <p class="font-medium text-white">Referral</p>
        </div>
        <div>
          <div class="rounded-full border border-gray-700 p-2">
            <ArrowUpRightIcon class="size-2.5 text-gray-500" />
          </div>
        </div>
      </div>
      <!-- Bottom -->
      <div class="w-full text-end">
        <p class="text-3xl font-medium text-white">8</p>
        <p class="text-xs text-gray-500">Pengguna</p>
      </div>
    </div>
    <!-- 📌 END : Jumlah Referral -->

    <!-- 📌 START : Saldo -->
    <div
      class="bg-blue-charcoal-500 flex w-full flex-1 flex-col items-start justify-between gap-3 rounded-xl px-5 py-5"
    >
      <!-- Top -->
      <div class="flex w-full justify-between">
        <div class="flex items-center gap-4">
          <div class="flex-none rounded-xl bg-gray-800 p-3">
            <img src="/images/money-bag.png" class="h-6 w-auto sm:h-8" />
          </div>
          <p class="font-medium text-white">Saldo</p>
        </div>
        <div>
          <div class="rounded-full border border-gray-700 p-2">
            <ArrowUpRightIcon class="size-2.5 text-gray-500" />
          </div>
        </div>
      </div>
      <!-- Bottom -->
      <div class="flex w-full flex-col items-center justify-end gap-3 text-end sm:flex-row">
        <!-- Saldo -->
        <div class="">
          <p v-if="walletStore.loading" class="text-center text-white">Memuat wallet...</p>
          <p
            v-else-if="walletStore.currentWallet"
            class="text-lightning-yellow-400 text-2xl font-semibold"
          >
            {{ formatRupiah(walletStore.currentWallet?.balance) }}
          </p>
          <p v-else class="text-sm text-red-500">Saldo tidak tersedia 😢</p>
        </div>
        <!-- Button -->
        <ButtonComponent textColor="black" size="sm" class="w-full sm:w-min">
          Gunakan
        </ButtonComponent>
      </div>
    </div>
    <!-- 📌END : Saldo -->
  </div>
</template>
