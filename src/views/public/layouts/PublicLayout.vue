<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterView } from 'vue-router';
import { useNavbarPadding } from '@/utils/useNavbarPadding';

import NavBarPartial from '@/components/navbars/NavBar.vue';

// Set NavBar Padding
const navbarRef = ref(null);

useNavbarPadding(navbarRef);
</script>

<template>
  <div class="relative min-h-screen text-white">
    <!-- START : NavBar -->
    <div
      ref="navbarRef"
      class="fixed top-0 left-0 z-50 w-full sm:px-12 md:px-24 lg:px-32 xl:px-36 2xl:px-40"
    >
      <NavBarPartial />
    </div>
    <!-- END : NavBar -->

    <!-- START : Main Content -->
    <div class="page-padding pt-20 sm:pt-28">
      <RouterView />
    </div>
    <!-- END : Main Content -->

    <!-- START : Footer -->
    <div class="absolute bottom-0 w-full">
      <div class="bg-yellow-500 px-3 py-2 sm:px-12 md:px-24 lg:px-32 xl:px-36 2xl:px-40">
        <p class="font-bold text-gray-950">OPLAY.ID</p>
      </div>
    </div>
    <!-- END : Footer -->
  </div>
</template>
