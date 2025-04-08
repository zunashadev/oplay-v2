<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';

import TransactionHistoryPartial from './partials/TransactionHistory.vue';

import ButtonComponent from '@/components/buttons/Button.vue';

import LogOutIcon from '@/components/icons/LogOut.vue';

const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrdersByUser();
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push({ name: 'AuthLogin' });
  } catch (error) {
    console.error('Logout gagal');
    console.error(error);
  }
};
</script>

<template>
  <div class="flex h-[2000px] flex-col gap-5 px-24 py-0">
    <div class="flex gap-5">
      <!-- START : ... -->
      <div
        class="w-3/4 overflow-hidden rounded-xl bg-gradient-to-b from-gray-200/50 via-gray-400/50 to-gray-600/50 p-[1px]"
      >
        <div
          class="flex items-start justify-between gap-6 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 px-8 py-8"
        >
          <div class="flex gap-10">
            <div class="flex-none">
              <img
                v-if="authStore.profile && authStore.profile?.avatar_url"
                alt="User Avatar"
                :src="authStore.profile?.avatar_url"
                class="size-24 rounded-full object-cover"
              />
              <img
                v-else
                alt="User Avatar"
                src="/images/avatar.jpg"
                class="size-24 rounded-full object-cover"
              />
            </div>
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-5">
                <div class="flex-none border-l-4 ps-4">
                  <p class="text-4xl font-semibold">{{ authStore.profile?.name || 'Guest' }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="flex w-full items-center justify-center space-x-3 rounded-md bg-red-700 px-6 py-1.5 text-sm text-white transition-all hover:cursor-pointer hover:bg-red-800"
                >
                  <span> Logout </span>
                  <LogOutIcon class="size-4 text-white" />
                </button>
              </div>
              <div class="flex flex-col gap-2">
                <!-- Username -->
                <div class="flex flex-col">
                  <p class="text-sm font-normal text-gray-400">Username</p>
                  <p class="text-base font-normal">{{ authStore.profile?.username || '-' }}</p>
                </div>
                <!-- Email -->
                <div class="flex flex-col">
                  <p class="text-sm font-normal text-gray-400">Email</p>
                  <p class="text-base font-normal">{{ authStore.user?.email || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
          <RouterLink
            :to="{ name: 'CustomerDashboardEditProfile' }"
            class="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold transition-all hover:cursor-pointer hover:bg-gray-600"
          >
            Edit Profile
          </RouterLink>
        </div>
      </div>
      <!-- END : ... -->

      <!-- START : ... -->
      <div class="relative w-1/4">
        <!-- Back Card -->
        <div
          class="from-lightning-yellow-500/80 to-lightning-yellow-600/80 absolute top-0 right-4 bottom-4 left-4 h-full rounded-xl bg-gradient-to-b"
        ></div>
        <!-- Main Card -->
        <div
          class="from-lightning-yellow-400 to-lightning-yellow-500 absolute top-2 right-0 bottom-0 left-0 flex flex-col gap-6 rounded-xl bg-gradient-to-b px-6 py-6 text-black"
        >
          <div class="flex h-full w-full flex-col justify-between">
            <div class="flex justify-between">
              <p>💰 Reward</p>
              <button
                class="bg-lightning-yellow-300 hover:bg-lightning-yellow-200 rounded-md px-3 py-2 text-sm font-semibold transition-all hover:cursor-pointer"
              >
                Gunakan
              </button>
            </div>
            <p class="text-3xl font-semibold">Rp.500.000</p>
          </div>
        </div>
      </div>
      <!-- END : ... -->
    </div>

    <!-- START : Riwayat Transaksi -->
    <div class="w-full">
      <TransactionHistoryPartial />
    </div>
    <!-- END : Riwayat Transaksi -->
  </div>
</template>
