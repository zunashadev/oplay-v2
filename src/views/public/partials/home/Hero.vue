<script setup>
import { ref, onMounted } from 'vue';
import { motion } from 'motion-v';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
</script>

<template>
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
            class="absolute top-1/2 -left-0 h-auto w-4 translate-y-5 sm:-left-12 sm:w-6 xl:w-8 xl:-translate-y-1/2"
          />
          <img
            src="/images/illustrations/cloud.png"
            class="absolute top-1/2 -right-0 h-auto w-4 translate-y-5 sm:-right-12 sm:w-6 xl:w-8 xl:translate-y-1/2"
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
</template>
