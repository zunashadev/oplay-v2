<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';

// Partials
import SideBarPartial from '../partials/SideBar.vue';
import NavBarPartial from '../partials/NavBar.vue';

// Components
import ToastListComponent from '@/components/toasts/ToastList.vue';

// State untuk mengecek apakah user sudah scroll
const isScrolled = ref(false);
const mainContent = ref(null); // Referensi ke elemen utama yang bisa di-scroll

const handleScroll = () => {
  if (mainContent.value) {
    isScrolled.value = mainContent.value.scrollTop > 0; // Cek posisi scroll
  }
};

// Tambahkan event listener saat komponen dipasang
onMounted(() => {
  if (mainContent.value) {
    mainContent.value.addEventListener('scroll', handleScroll);
  }
});

// Hapus event listener saat komponen di-unmount
onUnmounted(() => {
  if (mainContent.value) {
    mainContent.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<template>
  <ToastListComponent />

  <div class="flex h-screen bg-black text-white">
    <!-- Sidebar -->
    <div class="h-screen w-full max-w-72 flex-none bg-black">
      <SideBarPartial />
    </div>

    <!-- Konten Utama -->
    <div ref="mainContent" class="flex flex-1 flex-col overflow-y-auto">
      <!-- Navbar dengan sticky -->
      <div
        class="sticky top-0 z-50 border-b bg-black transition-all duration-150"
        :class="{ 'border-gray-800': isScrolled, 'border-transparent': !isScrolled }"
      >
        <NavBarPartial />
      </div>

      <!-- Konten -->
      <div class="p-6">
        <div class="">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
