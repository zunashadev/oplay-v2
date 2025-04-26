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
  <div class="text-white">
    <!-- START : NavBar -->
    <div ref="navbarRef" class="fixed top-0 left-0 z-50 w-full sm:px-12 md:px-24 lg:px-32 xl:px-36">
      <NavBarPartial />
    </div>
    <!-- END : NavBar -->

    <!-- START : Main Content -->
    <div class="px-3 pt-20 sm:px-12 sm:pt-28 md:px-24 lg:px-32 xl:px-36">
      <RouterView />
    </div>
    <!-- END : Main Content -->

    <!-- START : Footer -->
    <!-- END : Footer -->
  </div>
</template>
