<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterView } from 'vue-router';
import { useNavbarPadding } from '@/utils/useNavbarPadding';

// 📌 Components
// ...

// 📌 Logos
import InstagramLogo from '@/components/icons/social-media/Instagram.vue';
import WhatsAppLogo from '@/components/icons/social-media/WhatsApp.vue';
import YouTubeLogo from '@/components/icons/social-media/YouTube.vue';

// 📌 Partials
import NavBarPartial from '@/components/navbars/NavBar.vue';

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
      <div class="page-padding-x flex flex-col gap-5 bg-yellow-500 px-3 py-8">
        <div class="flex">
          <!-- START : Left -->
          <div class="flex flex-1/2 flex-col gap-5">
            <div class="flex items-center gap-3">
              <RouterLink
                :to="{ name: 'PublicHome' }"
                class="flex items-center space-x-1 sm:space-x-2"
              >
                <div class="rounded-md bg-gray-950 p-1.5">
                  <img src="/app-logo.png" class="h-5 w-auto" />
                </div>
                <p class="text-xl font-semibold text-gray-950 sm:text-2xl">OPLAY</p>
              </RouterLink>
            </div>
            <div>
              <div class="flex flex-col text-sm text-gray-950">
                <span class="font-semibold">OPLAY, Our Play!</span>
                <span> Dapatkan Akun Premium dengan Harga Terjangkau. </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <InstagramLogo class="size-5 text-gray-950" />
              <WhatsAppLogo class="size-5 text-gray-950" />
              <YouTubeLogo class="size-5 text-gray-950" />
            </div>
          </div>
          <!-- END : Left -->

          <!-- START : Right -->
          <div class="flex flex-1/2">
            <!-- Navigation -->
            <div class="flex flex-col gap-3">
              <p class="text-base font-semibold text-gray-950">Page</p>
              <div class="flex flex-col gap-1">
                <p class="text-sm text-yellow-900">Home</p>
                <p class="text-sm text-yellow-900">Produk</p>
                <p class="text-sm text-yellow-900">FAQ</p>
                <p class="text-sm text-yellow-900">Contact</p>
              </div>
            </div>
            <!--  -->
            <div></div>
            <!--  -->
            <div></div>
          </div>
          <!-- END : Right -->
        </div>

        <hr class="rounded-full border-yellow-300" />

        <div>
          <div class="text-sm text-gray-950">© 2025 OPLAY. All rights reserved.</div>
        </div>
      </div>
    </div>
    <!-- END : Footer -->
  </div>
</template>
