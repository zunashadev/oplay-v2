<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { getPublicImageUrl } from '@/utils/storageHelper';

// Stores
import { useAuthStore } from '@/stores/authStore';

// Components
import ButtonComponent from '@/components/buttons/Button.vue';

// Icons
import LogOutIcon from '@/components/icons/LogOut.vue';
import AppsIcon from '@/components/icons/Apps.vue';
import UserIcon from '../icons/User.vue';
import SettingsIcon from '../icons/Settings.vue';

const router = useRouter();
const route = useRoute();
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
  <Popover class="relative flex-none">
    <PopoverButton class="hover:cursor-pointer focus-visible:outline-none">
      <div class="flex w-full items-center gap-3">
        <div class="w-full">
          <p class="text-end text-xs">
            <strong class="block font-medium text-white">{{ authStore.userName }}</strong>
            <strong class="block font-normal text-gray-400">{{ authStore.userRole }}</strong>
          </p>
        </div>
        <img
          alt="User Avatar"
          :src="getPublicImageUrl(authStore.profile.avatar_image_path, 'avatar')"
          class="size-10 flex-none rounded-full object-cover"
        />
      </div>
    </PopoverButton>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-[-10px] opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-[-10px] opacity-0"
    >
      <PopoverPanel class="absolute top-12 right-0 z-50 mt-5 w-screen max-w-60 transform">
        <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
          <div class="relative bg-gray-800">
            <div class="flex flex-col px-3 py-3">
              <!-- Dashboard -->
              <RouterLink
                :to="{ name: 'CustomerDashboardHome' }"
                class="flex items-center gap-2 rounded-md px-3 py-2 transition-all hover:cursor-pointer hover:bg-gray-700"
              >
                <div><AppsIcon class="size-4 text-gray-500" /></div>
                <p class="text-sm font-normal">Dashboard</p>
              </RouterLink>
              <!-- Profil -->
              <RouterLink
                :to="{ name: 'CustomerDashboardEditProfile' }"
                class="flex items-center gap-2 rounded-md px-3 py-2 transition-all hover:cursor-pointer hover:bg-gray-700"
              >
                <div><UserIcon class="size-4 text-gray-500" /></div>
                <p class="text-sm font-normal">Profil</p>
              </RouterLink>
              <!-- Pengaturan -->
              <RouterLink
                :to="{ name: '' }"
                class="flex items-center gap-2 rounded-md px-3 py-2 transition-all hover:cursor-pointer hover:bg-gray-700"
              >
                <div><SettingsIcon class="size-4 text-gray-500" /></div>
                <p class="text-sm font-normal">Pengaturan</p>
              </RouterLink>
            </div>
          </div>
          <div class="border-t border-gray-700 bg-gray-800 px-3 py-3">
            <ButtonComponent @click="handleLogout" color="red" size="xs" class="w-full">
              <LogOutIcon class="size-4 text-white" />
              <span> Logout </span>
            </ButtonComponent>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
