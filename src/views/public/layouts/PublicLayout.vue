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
    <div ref="navbarRef" class="fixed top-0 left-0 z-50 w-full">
      <NavBarPartial />
    </div>
    <!-- END : NavBar -->

    <!-- START : Main Content -->
    <div class="pt-16 sm:pt-28">
      <RouterView />
    </div>
    <!-- END : Main Content -->

    <!-- START : Footer -->
    <!-- END : Footer -->
  </div>
</template>
