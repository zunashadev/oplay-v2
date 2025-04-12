<script setup>
// Stores
import { useAuthStore } from '@/stores/authStore';

// Components
import NavbarMenuComponent from './NavbarMenu.vue';
import NavBarProfileComponent from './NavBarProfile.vue';

const authStore = useAuthStore();
</script>

<template>
  <nav class="w-full sm:px-12 sm:pt-4 md:px-20 md:pt-6">
    <div class="bg-black/25 px-4 py-3 shadow-md backdrop-blur-sm sm:rounded-full">
      <div class="flex items-center justify-between">
        <!-- START : Brand -->
        <div class="order-2 ml-3 flex w-60 justify-start md:order-1 md:ml-0">
          <RouterLink
            :to="{ name: 'PublicHome' }"
            class="flex items-center space-x-1 px-2 sm:space-x-2"
          >
            <img src="/app-logo.png" class="h-6 w-auto" />
            <p class="text-xl font-semibold text-white sm:text-2xl">OPLAY</p>
          </RouterLink>
        </div>
        <!-- END : Brand -->

        <!-- START : Menu -->
        <div class="order-1 md:order-2">
          <NavbarMenuComponent />
        </div>
        <!-- END : Menu -->

        <!-- START : Auth -->
        <div class="order-3 flex w-60 justify-end">
          <!-- Authenticated -->
          <template v-if="authStore.isAuthenticated">
            <!-- START : Profile Popover -->
            <NavBarProfileComponent />
            <!-- END : Profile Popover -->
          </template>
          <!-- Not Authenticated -->
          <template v-else>
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
          </template>
        </div>
        <!-- END : Auth -->
      </div>
    </div>
  </nav>
</template>
