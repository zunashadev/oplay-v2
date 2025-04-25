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
          <p class="text-lightning-yellow-400 text-2xl font-semibold">OPLAY, Our Play!</p>
          <div
            class="from-lightning-yellow-200 to-firefly-200 bg-gradient-to-tl bg-clip-text text-center text-3xl/10 font-bold text-transparent sm:text-4xl/12 md:text-5xl/16 lg:text-6xl/18"
          >
            Dapatkan Akun Premium dengan Harga Terjangkau
          </div>
        </div>
        <p>🚀 Netflix, Spotify, YouTube, dan Lainnya - Langganan Tanpa Ribet, Langsung Aktif!</p>
      </div>
      <div class="flex space-x-4">
        <ButtonComponent color="firefly">Hubungi Penjual</ButtonComponent>
        <ButtonComponent color="lightning-yellow">Telusuri Produk</ButtonComponent>
      </div>
    </div>
  </div>
</template>
