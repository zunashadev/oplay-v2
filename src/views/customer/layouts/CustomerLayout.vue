<script setup>
import { RouterView } from 'vue-router';

import NavBarPartial from '@/components/navbars/NavBar.vue';
</script>

<template>
  <div class="bg-gray-950 text-white">
    <!-- START : NAVBAR -->
    <div class="fixed top-0 left-0 z-50 w-full">
      <NavBarPartial />
    </div>
    <!-- END : NAVBAR -->

    <!-- START : MAIN CONTENT -->
    <div class="pt-20 sm:pt-28">
      <RouterView />
    </div>
    <!-- END : MAIN CONTENT -->

    <!-- START : FOOTER -->
    <!-- ! Belum bikin footer -->
    <!-- END : FOOTER -->
  </div>
</template>
