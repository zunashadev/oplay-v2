<script setup>
import { ref, markRaw } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import AppsIcon from '@/components/icons/Apps.vue';
import BoxesIcon from '@/components/icons/Boxes.vue';
import UsersIcon from '@/components/icons/Users.vue';
import CircleUserIcon from '@/components/icons/CircleUser.vue';

import LogOutIcon from '@/components/icons/LogOut.vue';

// Data menu
const menuItems = ref([
  { name: 'Beranda', link: 'AdminDashboardHome', icon: markRaw(AppsIcon) },
  {
    name: 'Produk',
    submenu: [
      { name: 'Produk', link: 'AdminDashboardProducts', icon: markRaw(BoxesIcon) },
      // { name: 'Category', link: '' },
    ],
  },
  { name: 'User', link: 'AdminDashboardUsers', icon: markRaw(UsersIcon) },
  { name: 'Profil', link: 'AdminDashboardProfile', icon: markRaw(CircleUserIcon) },
]);

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

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
  <div class="flex h-screen flex-col justify-between border-e border-gray-800 bg-gray-900">
    <div class="px-4 py-6">
      <!-- START : BRAND -->
      <div class="flex">
        <RouterLink
          :to="{ name: 'PublicHome' }"
          class="flex items-center space-x-1 px-2 sm:space-x-2"
        >
          <img src="/app-logo.png" class="h-6 w-auto" />
          <p class="text-xl font-semibold text-white sm:text-2xl">OPLAY</p>
        </RouterLink>
      </div>
      <!-- END : BRAND -->

      <ul class="mt-6 space-y-1">
        <li v-for="(menu, index) in menuItems" :key="index">
          <details v-if="menu.submenu" class="group [&_summary::-webkit-details-marker]:hidden">
            <summary
              class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-white hover:bg-gray-800"
            >
              <span class="text-sm font-medium">{{ menu.name }}</span>

              <span class="shrink-0 transition duration-300 group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </summary>

            <ul class="mt-2 space-y-1 ps-4">
              <li v-for="(sub, subIndex) in menu.submenu" :key="subIndex">
                <RouterLink :to="{ name: sub.link }">
                  <div
                    class="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    :class="[
                      route.name === sub.link
                        ? 'bg-lightning-yellow-400 text-black'
                        : 'text-white hover:bg-gray-800',
                    ]"
                  >
                    <component :is="sub.icon" class="size-4" />
                    <span>
                      {{ sub.name }}
                    </span>
                  </div>
                </RouterLink>
              </li>
            </ul>
          </details>

          <RouterLink v-else :to="{ name: menu.link }">
            <span
              class="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all"
              :class="[
                route.name === menu.link
                  ? 'bg-lightning-yellow-400 text-black'
                  : 'text-white hover:bg-gray-800',
              ]"
            >
              <component :is="menu.icon" class="size-4" />
              <span>
                {{ menu.name }}
              </span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div
      v-if="authStore.isAuthenticated"
      class="sticky inset-x-0 bottom-0 flex flex-col space-y-3 border-t border-gray-800 p-4"
    >
      <a href="#" class="flex w-full items-center gap-2">
        <img
          alt="User Avatar"
          :src="authStore.user.avatar_url || '/images/avatar.jpg'"
          class="size-10 rounded-full object-cover"
        />

        <div>
          <p class="text-xs">
            <strong class="block font-medium">{{ authStore.userName }}</strong>
            <strong class="block font-medium">{{ authStore.userRole }}</strong>
            <span>{{ authStore.user?.email }}</span>
          </p>
        </div>
      </a>

      <div class="">
        <button
          @click="handleLogout"
          class="flex w-full items-center justify-center space-x-3 rounded-md bg-red-700 px-6 py-1.5 text-sm text-white transition-all hover:cursor-pointer hover:bg-red-800"
        >
          <span> Logout </span>
          <LogOutIcon class="size-4 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>
