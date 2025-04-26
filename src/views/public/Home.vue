<script setup>
import { ref, onMounted } from 'vue';
import { motion } from 'motion-v';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
</script>

<template>
  <div class="h-[2000px] px-12 py-24 sm:px-24">
    <div class="flex flex-col items-center space-y-16">
      <div class="flex flex-col items-center space-y-12">
        <div class="flex flex-col items-center space-y-4">
          <p class="text-2xl font-semibold text-yellow-500">OPLAY, Our Play!</p>
          <div class="relative">
            <div
              class="bg-gradient-to-tl from-yellow-200 to-cyan-200 bg-clip-text text-center text-3xl/10 font-bold text-transparent sm:text-4xl/12 md:text-5xl/16 lg:text-6xl/18"
            >
              Dapatkan Akun Premium dengan Harga Terjangkau
            </div>

            <img
              src="/images/illustrations/cloud.png"
              class="absolute top-1/2 -left-6 h-auto w-3 translate-y-5 sm:-left-8 sm:w-5 md:-left-14 lg:-left-24 xl:-left-28 xl:w-8 xl:-translate-y-1/2"
            />
            <img
              src="/images/illustrations/cloud.png"
              class="absolute top-1/2 -right-6 h-auto w-3 translate-y-5 sm:-right-8 sm:w-5 md:-right-14 lg:-right-24 xl:-right-28 xl:w-8 xl:translate-y-1/2"
            />
          </div>
        </div>
        <p>🚀 Netflix, Spotify, YouTube, dan Lainnya - Langganan Tanpa Ribet, Langsung Aktif!</p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <motion.div drag :whileHover="{ scale: 1.1 }" :whilePress="{ scale: 0.95 }" class="w-full">
          <ButtonComponent color="gray" textColor="black" class="w-full"
            >Hubungi Penjual</ButtonComponent
          >
        </motion.div>

        <motion.div drag :whileHover="{ scale: 1.1 }" :whilePress="{ scale: 0.95 }" class="w-full">
          <ButtonComponent color="yellow" textColor="black" class="w-full"
            >Telusuri Produk</ButtonComponent
          >
        </motion.div>
      </div>
    </div>
  </div>
</template>
