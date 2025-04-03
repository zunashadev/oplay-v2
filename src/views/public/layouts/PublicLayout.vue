<script setup>
import { RouterView } from 'vue-router';
import NavBarPartial from '../partials/NavBar.vue';
</script>

<template>
  <div class="bg-black text-white">
    <!-- START : NAVBAR -->
    <div class="fixed top-0 left-0 z-50 w-full">
      <NavBarPartial />
    </div>
    <!-- END : NAVBAR -->

    <!-- START : MAIN CONTENT -->
    <div class="pt-28">
      <RouterView />
    </div>
    <!-- END : MAIN CONTENT -->

    <!-- START : FOOTER -->
    <!-- END : FOOTER -->
  </div>
</template>
