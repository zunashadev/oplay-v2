<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

// Icons
import BarsStaggeredIcon from '../icons/BarsStaggered.vue';

const router = useRouter();
const route = useRoute();

// START : Menu
const menuItems = ref([
  { name: 'Beranda', link: 'PublicHome' },
  { name: 'Produk', link: 'PublicProducts' },
  { name: 'FAQ', link: 'PublicFAQ' },
  { name: 'About', link: '' },
  { name: 'Menu Lain', link: '' },
]);
// END : Menu
</script>

<template>
  <!-- START : Responsive : Mobile -->
  <div class="block md:hidden">
    <Popover class="relative flex flex-none items-center">
      <!-- Button -->
      <PopoverButton class="hover:cursor-pointer focus-visible:outline-none">
        <div class="">
          <BarsStaggeredIcon class="size-5 text-white" />
        </div>
      </PopoverButton>

      <!-- Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-[-10px] opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-[-10px] opacity-0"
      >
        <PopoverPanel
          class="fixed top-20 right-12 left-12 z-50 transform rounded-lg bg-gray-800 px-5 py-8 text-center shadow-lg"
        >
          <div class="flex flex-col items-center gap-3">
            <div v-for="(menu, index) in menuItems" :key="index" class="flex w-full">
              <RouterLink
                :to="{ name: menu.link }"
                class="hover:text-lightning-yellow-400 w-full px-4 py-1.5 text-sm font-medium transition-all hover:cursor-pointer"
                :class="
                  route.name === menu.link
                    ? 'rounded-2xl bg-white/10 text-white'
                    : 'rounded-md text-white'
                "
              >
                {{ menu.name }}
              </RouterLink>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
  <!-- END : Responsive : Mobile -->

  <!-- START : Responsive : Desktop -->
  <div class="hidden items-center gap-2 md:flex">
    <div v-for="(menu, index) in menuItems" :key="index">
      <RouterLink
        :to="{ name: menu.link }"
        class="hover:text-lightning-yellow-400 block w-full px-4 py-1.5 text-center font-medium transition-all hover:cursor-pointer"
        :class="
          route.name === menu.link ? 'rounded-2xl bg-white/10 text-white' : 'rounded-md text-white'
        "
      >
        {{ menu.name }}
      </RouterLink>
    </div>
  </div>
  <!-- END : Responsive : Desktop -->
</template>
