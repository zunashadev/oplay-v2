<script setup>
import { ref, onMounted } from 'vue';
import { motion } from 'motion-v';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
</script>

<template>
  <!-- 📌 Background -> Pattern -->
  <div class="absolute inset-0 -z-10 h-[720px]">
    <div class="bg-pattern relative h-full w-full">
      <div class="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-gray-950"></div>
      <div class="absolute inset-0 z-10 bg-gradient-to-t from-transparent to-gray-950"></div>
    </div>
  </div>

  <!-- 📌 Main Content -->
  <div class="relative h-[2000px] space-y-24 px-12 py-16 sm:space-y-32 sm:px-24 sm:py-24">
    <!-- 📌 Hero Section -->
    <div class="flex flex-col items-center space-y-16">
      <div class="flex flex-col items-center space-y-12">
        <div class="flex flex-col items-center space-y-4">
          <!-- 📌 ... -->
          <p class="text-2xl font-semibold text-yellow-500">OPLAY, Our Play!</p>
          <!-- 📌 ... -->
          <div class="relative">
            <div
              class="bg-gradient-to-tl from-yellow-200 to-cyan-200 bg-clip-text text-center text-3xl/10 font-bold text-transparent sm:text-4xl/12 md:text-5xl/16 lg:text-6xl/18"
            >
              Dapatkan Akun Premium dengan Harga Terjangkau
            </div>

            <img
              src="/images/illustrations/cloud.png"
              class="absolute top-1/2 -left-6 h-auto w-4 translate-y-5 sm:-left-12 sm:w-6 xl:w-8 xl:-translate-y-1/2"
            />
            <img
              src="/images/illustrations/cloud.png"
              class="absolute top-1/2 -right-6 h-auto w-4 translate-y-5 sm:-right-12 sm:w-6 xl:w-8 xl:translate-y-1/2"
            />
          </div>
        </div>
        <p class="text-center">
          🚀 Netflix, Spotify, YouTube, dan Lainnya - Langganan Tanpa Ribet, Langsung Aktif!
        </p>
      </div>
      <!-- 📌 ... -->
      <div class="">
        <div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <motion.div
            drag
            :whileHover="{ scale: 1.1 }"
            :whilePress="{ scale: 0.95 }"
            class="w-full flex-none sm:w-1/2"
          >
            <ButtonComponent color="gray" textColor="black" class="w-full"
              >Hubungi Penjual</ButtonComponent
            >
          </motion.div>

          <motion.div
            drag
            :whileHover="{ scale: 1.1 }"
            :whilePress="{ scale: 0.95 }"
            class="w-full flex-none sm:w-1/2"
          >
            <ButtonComponent color="yellow" textColor="black" class="w-full"
              >Telusuri Produk</ButtonComponent
            >
          </motion.div>
        </div>
      </div>
    </div>

    <!-- 📌 App -->
    <div
      class="-mx-12 flex flex-wrap items-center justify-center gap-6 bg-gray-900 px-12 py-4 sm:-mx-24 sm:flex-nowrap sm:gap-24"
    >
      <!-- Netflix -->
      <div
        class="group flex items-center gap-3 grayscale transition-all hover:cursor-pointer hover:grayscale-0"
      >
        <img src="/images/app-logo/Netflix.png" alt="" class="size-6 sm:size-8" />
        <p class="text-xs font-medium text-gray-500 group-hover:text-yellow-500 sm:text-sm">
          Netflix
        </p>
      </div>
      <!-- Spotify -->
      <div
        class="group flex items-center gap-3 grayscale transition-all hover:cursor-pointer hover:grayscale-0"
      >
        <img src="/images/app-logo/Spotify.png" alt="" class="size-6 sm:size-8" />
        <p class="text-xs font-medium text-gray-500 group-hover:text-yellow-500 sm:text-sm">
          Spotify
        </p>
      </div>
      <!-- Canva -->
      <div
        class="group flex items-center gap-3 grayscale transition-all hover:cursor-pointer hover:grayscale-0"
      >
        <img src="/images/app-logo/Canva.png" alt="" class="size-6 sm:size-8" />
        <p class="text-xs font-medium text-gray-500 group-hover:text-yellow-500 sm:text-sm">
          Canva
        </p>
      </div>
      <!-- Chat GPT -->
      <div
        class="group flex items-center gap-3 grayscale transition-all hover:cursor-pointer hover:grayscale-0"
      >
        <img src="/images/app-logo/ChatGPT.png" alt="" class="size-6 sm:size-8" />
        <p class="text-xs font-medium text-gray-500 group-hover:text-yellow-500 sm:text-sm">
          Chat GPT
        </p>
      </div>
      <!-- More -->
      <div
        class="group flex items-center gap-3 grayscale transition-all hover:cursor-pointer hover:grayscale-0"
      >
        <img src="/images/app-logo/More.png" alt="" class="size-6 sm:size-8" />
        <p class="text-xs font-medium text-gray-500 group-hover:text-yellow-500 sm:text-sm">
          And More!
        </p>
      </div>
    </div>

    <!-- 📌 ... -->
    <div></div>
  </div>
</template>

<style scoped>
.bg-pattern {
  background-image: url('/images/patterns/graph-paper.svg');
  background-repeat: repeat;
  background-size: auto; /* bisa diubah jadi 'contain', 'cover', atau ukuran tertentu */
  background-position: center;
}

.fade-bottom {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 60%, white 100%);
  /* Ubah `white` sesuai warna latar belakang utama kamu */
  height: 100%;
  width: 100%;
}
</style>
