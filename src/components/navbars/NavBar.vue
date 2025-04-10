<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';

import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// START : MENU
const menuItems = ref([
  { name: 'Beranda', link: 'PublicHome' },
  { name: 'Produk', link: 'PublicProducts' },
  { name: 'FAQ', link: 'PublicFAQ' },
]);
// END : MENU
</script>

<template>
  <nav class="w-full sm:px-12 sm:pt-4 md:px-20 md:pt-6">
    <div class="bg-gray-600/25 px-4 py-3 shadow-md backdrop-blur-sm sm:rounded-full">
      <div class="flex items-center justify-between">
        <!-- START : BRAND -->
        <div class="flex w-60 justify-start">
          <RouterLink
            :to="{ name: 'PublicHome' }"
            class="flex items-center space-x-1 px-2 sm:space-x-2"
          >
            <img src="/app-logo.png" class="h-6 w-auto" />
            <p class="text-xl font-semibold text-white sm:text-2xl">OPLAY</p>
          </RouterLink>
        </div>
        <!-- END : BRAND -->

        <!-- START : MENU CONTENT -->
        <div class="flex items-center gap-2">
          <div v-for="(menu, index) in menuItems" :key="index">
            <RouterLink
              :to="{ name: menu.link }"
              class="hover:text-lightning-yellow-400 px-4 py-1.5 font-medium transition-all hover:cursor-pointer"
              :class="
                route.name === menu.link
                  ? 'rounded-2xl bg-white/10 text-white'
                  : 'rounded-md text-white'
              "
            >
              {{ menu.name }}
            </RouterLink>
          </div>
        </div>
        <!-- END : MENU CONTENT -->

        <!-- START : AUTH -->
        <div class="flex w-60 justify-end">
          <div v-if="authStore.isAuthenticated" class="flex flex-col space-y-3">
            <div class="flex w-full items-center gap-3">
              <div class="w-full">
                <p class="text-end text-xs">
                  <strong class="block font-medium text-white">{{ authStore.userName }}</strong>
                  <strong class="block font-normal text-gray-400">{{ authStore.userRole }}</strong>
                </p>
              </div>

              <RouterLink :to="{ name: 'AdminDashboardHome' }" class="flex-none">
                <img
                  v-if="authStore.profile && authStore.profile?.avatar_url"
                  alt="User Avatar"
                  :src="authStore.profile.avatar_url"
                  class="size-10 rounded-full object-cover"
                />
                <img
                  v-else
                  alt="User Avatar"
                  src="/images/avatar.jpg"
                  class="size-10 rounded-full object-cover"
                />
              </RouterLink>
            </div>
          </div>
          <div v-else>
            <div class="flex items-center gap-2">
              <RouterLink :to="{ name: 'AuthRegister' }">
                <button
                  type="button"
                  class="hover:text-lightning-yellow-400 inline-flex items-center gap-x-2 rounded-2xl border border-transparent px-4 py-2 text-sm font-normal text-white transition-all hover:cursor-pointer focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                >
                  Register
                </button>
              </RouterLink>
              <RouterLink :to="{ name: 'AuthLogin' }">
                <button
                  type="button"
                  class="bg-lightning-yellow-400 hover:bg-lightning-yellow-500 focus:bg-lightning-yellow-500 inline-flex items-center gap-x-2 rounded-2xl border border-transparent px-4 py-1.5 text-sm font-medium text-black transition-all hover:cursor-pointer focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                >
                  Login
                </button>
              </RouterLink>
            </div>
          </div>
        </div>
        <!-- END : AUTH -->
      </div>
    </div>
  </nav>
</template>
