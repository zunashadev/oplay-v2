<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import LogOutIcon from '@/components/icons/LogOut.vue';

const authStore = useAuthStore();
const router = useRouter();

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
        class="flex w-3/4 items-start justify-between gap-6 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 px-8 py-8"
      >
        <div class="flex gap-10">
          <div class="flex-none">
            <img
              alt="User Avatar"
              src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
                <p class="text-sm font-normal text-gray-500">Username</p>
                <p class="text-base font-normal">{{ authStore.profile?.username || '-' }}</p>
              </div>
              <!-- Email -->
              <div class="flex flex-col">
                <p class="text-sm font-normal text-gray-500">Email</p>
                <p class="text-base font-normal">{{ authStore.user?.email || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold transition-all hover:cursor-pointer hover:bg-gray-600"
        >
          Edit Data
        </div>
      </div>
      <!-- END : ... -->
      <!-- START : ... -->
      <div
        class="from-lightning-yellow-400 to-lightning-yellow-500 flex w-1/4 flex-col gap-6 rounded-2xl bg-gradient-to-b px-6 py-6 text-black"
      >
        <div class="flex h-full w-full flex-col justify-between">
          <div class="flex justify-between">
            <p>💰 Reward</p>
            <div
              class="bg-lightning-yellow-300 hover:bg-lightning-yellow-200 rounded-md px-3 py-2 text-sm font-semibold transition-all hover:cursor-pointer"
            >
              Gunakan
            </div>
          </div>
          <p class="text-3xl font-semibold">Rp.500.000</p>
        </div>
      </div>
      <!-- END : ... -->
    </div>

    <!-- START : ... -->
    <div>riwayat pembelian</div>
    <!-- END : ... -->
  </div>
</template>
