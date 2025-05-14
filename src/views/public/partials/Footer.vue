<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';

// 📌 Logos
import InstagramLogo from '@/components/icons/social-media/Instagram.vue';
import WhatsAppLogo from '@/components/icons/social-media/WhatsApp.vue';
import YouTubeLogo from '@/components/icons/social-media/YouTube.vue';

// 📌 Constants
import { menuItems } from '@/constants/menuItems';

const router = useRouter();
const route = useRoute();

const navbarMenuItems = menuItems.footer;
</script>

<template>
  <div class="page-padding-x relative flex flex-col overflow-hidden bg-yellow-500">
    <!-- START : Background -->
    <div class="absolute -right-4 -bottom-24 sm:-right-8 sm:-bottom-28">
      <img src="/app-logo.png" class="h-64 w-auto sm:h-80" />
    </div>
    <!-- END : Background -->

    <div class="relative flex flex-col gap-5 py-8 sm:flex-row">
      <!-- START : Left -->
      <div class="flex flex-1/2 flex-col justify-between gap-5">
        <div class="flex flex-col gap-5">
          <div class="flex items-center gap-3">
            <RouterLink
              :to="{ name: 'PublicHome' }"
              class="flex items-center space-x-2 sm:space-x-3"
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
          <p class="text-base font-semibold text-gray-950">Halaman</p>
          <div class="grid grid-cols-4 gap-x-8 gap-y-1 sm:grid-cols-1">
            <div v-for="(menu, index) in navbarMenuItems" :key="index">
              <RouterLink
                :to="{ name: menu.link }"
                class="text-sm text-yellow-700 transition-all hover:text-yellow-800"
              >
                {{ menu.name }}
              </RouterLink>
            </div>
          </div>
        </div>
        <!--  -->
        <div></div>
        <!--  -->
        <div></div>
      </div>
      <!-- END : Right -->
    </div>

    <hr class="relative rounded-full border-yellow-300" />

    <div class="relative py-5">
      <div class="text-sm text-gray-950">© 2025 OPLAY. All rights reserved.</div>
    </div>
  </div>
</template>
