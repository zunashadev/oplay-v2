<script setup>
// 📌 Partials
import HeroPartial from './partials/home/Hero.vue';
import AppShowcasePartial from './partials/home/AppShowcase.vue';
import ChooseUsBenefitsPartial from './partials/home/ChooseUsBenefits.vue';
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
    <!-- 📌 Hero -->
    <div class="py-20">
      <HeroPartial />
    </div>

    <!-- 📌 App Showcase -->
    <div class="reset-padding-x">
      <AppShowcasePartial />
    </div>

    <!-- 📌 Choose Us Benefits ... -->
    <div>
      <ChooseUsBenefitsPartial />
    </div>

    <!-- 📌 Testimonials -->
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
