<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import LogOutIcon from '@/components/icons/LogOut.vue';

// Data menu
const menuItems = ref([
  { name: 'Home', link: 'AdminDashboardHome' },
  {
    name: 'Products',
    submenu: [
      { name: 'Products', link: 'AdminDashboardProducts' },
      { name: 'Category', link: '' },
    ],
  },
  { name: 'Users', link: 'AdminDashboardUsers' },
  { name: 'Profile', link: 'AdminDashboardProfile' },
]);

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
  <div class="flex h-screen flex-col justify-between border-e border-gray-800 bg-gray-900">
    <div class="px-4 py-6">
      <span
        class="grid h-10 w-32 place-content-center rounded-lg bg-gray-800 text-lg font-bold text-white"
      >
        🍅 OPLAY
      </span>

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

            <ul class="mt-2 space-y-1 px-4">
              <li v-for="(sub, subIndex) in menu.submenu" :key="subIndex">
                <RouterLink
                  :to="{ name: sub.link }"
                  class="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  {{ sub.name }}
                </RouterLink>
              </li>
            </ul>
          </details>

          <RouterLink
            v-else
            :to="{ name: menu.link }"
            class="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {{ menu.name }}
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
          src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
