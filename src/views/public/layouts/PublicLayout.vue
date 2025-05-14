<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterView } from 'vue-router';
import { useNavbarPadding } from '@/utils/useNavbarPadding';

// 📌 Components
// ...

// 📌 Partials
import NavBarPartial from '@/components/navbars/NavBar.vue';
import FooterPartial from '../partials/Footer.vue';

// Set NavBar Padding
const navbarRef = ref(null);

useNavbarPadding(navbarRef);
</script>

<template>
  <div class="relative min-h-screen text-white">
    <!-- START : NavBar -->
    <div ref="navbarRef" class="fixed top-0 right-0 left-0 z-50 w-full">
      <div class="public-navbar-padding-x w-full">
        <NavBarPartial />
      </div>
    </div>
    <!-- END : NavBar -->

    <!-- START : Main Content -->
    <div class="page-padding-x page-padding-y">
      <RouterView />
    </div>
    <!-- END : Main Content -->

    <!-- START : Footer -->
    <div class="absolute bottom-0 w-full">
      <FooterPartial />
    </div>
    <!-- END : Footer -->
  </div>
</template>
