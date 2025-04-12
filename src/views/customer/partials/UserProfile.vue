<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import ButtonComponent from '@/components/buttons/Button.vue';

import LogOutIcon from '@/components/icons/LogOut.vue';

const router = useRouter();
const authStore = useAuthStore();

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
  <div class="flex items-center justify-between gap-5 rounded-xl bg-gray-900 px-8 py-8">
    <div class="flex items-center gap-10">
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
            <p class="text-2xl font-semibold">{{ authStore.profile?.name || 'Guest' }}</p>
          </div>
          <RouterLink
            :to="{ name: 'CustomerDashboardEditProfile' }"
            class="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold transition-all hover:cursor-pointer hover:bg-gray-600"
          >
            Edit Profile
          </RouterLink>
        </div>
        <div class="flex items-center gap-10">
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

    <ButtonComponent @click="handleLogout" color="red">
      <span> Logout </span>
      <LogOutIcon class="size-4 text-white" />
    </ButtonComponent>
  </div>
</template>
