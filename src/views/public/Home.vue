<script setup>
import { ref, onMounted } from 'vue';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';
</script>

<template>
  <div class="h-[2000px] px-24 py-24">
    <div class="flex flex-col items-center space-y-16">
      <div class="flex flex-col items-center space-y-12">
        <div class="flex flex-col items-center space-y-4">
          <p class="text-2xl font-semibold text-yellow-500">OPLAY, Our Play!</p>
          <div
            class="bg-gradient-to-tl from-yellow-200 to-cyan-200 bg-clip-text text-center text-3xl/10 font-bold text-transparent sm:text-4xl/12 md:text-5xl/16 lg:text-6xl/18"
          >
            Dapatkan Akun Premium dengan Harga Terjangkau
          </div>
        </div>
        <p>🚀 Netflix, Spotify, YouTube, dan Lainnya - Langganan Tanpa Ribet, Langsung Aktif!</p>
      </div>
      <div class="flex space-x-4">
        <ButtonComponent color="red" textColor="black">Hubungi Penjual</ButtonComponent>
        <ButtonComponent color="yellow" textColor="black">Telusuri Produk</ButtonComponent>
      </div>
    </div>
  </div>
</template>
