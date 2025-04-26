<script setup>
import { RouterView } from 'vue-router';

import NavBarPartial from '@/components/navbars/NavBar.vue';
</script>

<template>
  <div class="text-white">
    <!-- START : NAVBAR -->
    <div class="fixed top-0 left-0 z-50 w-full sm:px-12 md:px-24 lg:px-32 xl:px-36 2xl:px-40">
      <NavBarPartial />
    </div>
    <!-- END : NAVBAR -->

    <!-- START : MAIN CONTENT -->
    <div class="page-padding-x pt-20 sm:pt-28">
      <RouterView />
    </div>
    <!-- END : MAIN CONTENT -->

    <!-- START : FOOTER -->
    <!-- ! Belum bikin footer -->
    <!-- END : FOOTER -->
  </div>
</template>
