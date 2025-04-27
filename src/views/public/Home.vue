<script setup>
import { ref, onMounted } from 'vue';
import { motion } from 'motion-v';

// 📌 Components
import ButtonComponent from '@/components/buttons/Button.vue';

// 📌 Icons
import CheapDollarIcon from '@/components/icons/CheapDollar.vue';
import RocketLunchIcon from '@/components/icons/RocketLunch.vue';
import ShieldCheckIcon from '@/components/icons/ShieldCheck.vue';
import CreditCardIcon from '@/components/icons/CreditCard.vue';
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
  <div class="relative space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 xl:space-y-32">
    <!-- 📌 Hero Section -->
    <div class="py-32">
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
    </div>

    <!-- 📌 App -->
    <div class="reset-padding-x">
      <div
        class="flex w-full flex-wrap items-center justify-center gap-6 bg-gray-900 px-12 py-4 sm:gap-12 md:gap-16 lg:gap-20"
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
    </div>

    <!-- 📌 Why Us? ... -->
    <div>
      <div class="flex gap-24">
        <div class="flex w-1/2 flex-col gap-10">
          <div class="text-5xl/16 font-medium">Kenapa harus memilih kami?</div>
          <div class="flex flex-col gap-5">
            <!-- 1 -->
            <div class="group flex flex-col gap-3 transition-all hover:cursor-pointer">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                  <div
                    class="rounded-md border border-gray-500/50 p-2 transition-all group-hover:border-yellow-500/50"
                  >
                    <CheapDollarIcon
                      class="size-5 text-gray-500 transition-all group-hover:text-yellow-500"
                    />
                  </div>
                  <p class="text-xl text-gray-500 transition-all group-hover:text-yellow-500">
                    Harga Terjangkau
                  </p>
                </div>
                <p class="text-sm text-gray-500 transition-all group-hover:text-gray-400">
                  Kami menawarkan harga terbaik untuk akun-akun premium tanpa mengorbankan kualitas.
                  Dapatkan akses premium dengan biaya yang ramah di kantong.
                </p>
              </div>
              <hr
                class="rounded-full text-gray-500/50 transition-all group-hover:text-yellow-500/50"
              />
            </div>

            <!-- 2 -->
            <div class="group flex flex-col gap-3 transition-all hover:cursor-pointer">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                  <div
                    class="rounded-md border border-gray-500/50 p-2 transition-all group-hover:border-yellow-500/50"
                  >
                    <RocketLunchIcon
                      class="size-5 text-gray-500 transition-all group-hover:text-yellow-500"
                    />
                  </div>
                  <p class="text-xl text-gray-500 transition-all group-hover:text-yellow-500">
                    Proses Cepat
                  </p>
                </div>
                <p class="text-sm text-gray-500 transition-all group-hover:text-gray-400">
                  Nikmati pengalaman belanja yang cepat dan mudah. Setelah pembayaran dikonfirmasi,
                  akun Anda langsung dikirim tanpa perlu menunggu lama.
                </p>
              </div>
              <hr
                class="rounded-full text-gray-500/50 transition-all group-hover:text-yellow-500/50"
              />
            </div>

            <!-- 3 -->
            <div class="group flex flex-col gap-3 transition-all hover:cursor-pointer">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                  <div
                    class="rounded-md border border-gray-500/50 p-2 transition-all group-hover:border-yellow-500/50"
                  >
                    <ShieldCheckIcon
                      class="size-5 text-gray-500 transition-all group-hover:text-yellow-500"
                    />
                  </div>
                  <p class="text-xl text-gray-500 transition-all group-hover:text-yellow-500">
                    Garansi Keamanan
                  </p>
                </div>
                <p class="text-sm text-gray-500 transition-all group-hover:text-gray-400">
                  Keamanan Anda prioritas kami. Kami menjamin setiap akun yang Anda beli aman
                  digunakan, serta dilindungi dengan garansi penggantian jika terjadi kendala.
                </p>
              </div>
              <hr
                class="rounded-full text-gray-500/50 transition-all group-hover:text-yellow-500/50"
              />
            </div>

            <!-- 4 -->
            <div class="group flex flex-col gap-3 transition-all hover:cursor-pointer">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                  <div
                    class="rounded-md border border-gray-500/50 p-2 transition-all group-hover:border-yellow-500/50"
                  >
                    <CreditCardIcon
                      class="size-5 text-gray-500 transition-all group-hover:text-yellow-500"
                    />
                  </div>
                  <p class="text-xl text-gray-500 transition-all group-hover:text-yellow-500">
                    Beragam Metode Pembayaran
                  </p>
                </div>
                <p class="text-sm text-gray-500 transition-all group-hover:text-gray-400">
                  Kami mendukung berbagai metode pembayaran mulai dari transfer bank, e-wallet,
                  hingga pembayaran digital lainnya — memudahkan Anda memilih sesuai kebutuhan.
                </p>
              </div>
              <hr
                class="rounded-full text-gray-500/50 transition-all group-hover:text-yellow-500/50"
              />
            </div>
          </div>
        </div>
        <div class="w-1/2 bg-pink-500">asd</div>
      </div>
    </div>
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
