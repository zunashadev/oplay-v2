<script setup>
const testimonials = [
  {
    message: 'Pelayanan sangat cepat, akun langsung aktif setelah pembayaran!',
    author: 'Rizky A.',
  },
  {
    message: 'Harga murah tapi kualitas premium. Mantap!',
    author: 'Dewi S.',
  },
  {
    message: 'Customer service responsif dan membantu sekali.',
    author: 'Andi P.',
  },
  {
    message: 'Pengalaman yang luar biasa, sangat memuaskan!',
    author: 'Budi W.',
  },
  {
    message: 'Akun langsung aktif tanpa kendala, sangat cepat.',
    author: 'Lina M.',
  },
  {
    message: 'Harga terjangkau, sangat worth it untuk premium.',
    author: 'Fahmi K.',
  },
  {
    message: 'Pelayanan yang sangat baik, sangat direkomendasikan!',
    author: 'Siti A.',
  },
  {
    message: 'Proses transaksi cepat dan mudah, akun langsung digunakan.',
    author: 'Eka T.',
  },
  {
    message: 'Sangat aman dan terpercaya, saya sudah berlangganan di sini.',
    author: 'Rina N.',
  },
  {
    message: 'Kualitas akun premium sangat bagus, tidak ada masalah.',
    author: 'Hendra S.',
  },
  {
    message: 'Harga kompetitif, dan layanan customer service sangat membantu.',
    author: 'Indra F.',
  },
  {
    message: 'Terima kasih, sangat memuaskan dan sangat mudah digunakan.',
    author: 'Lita P.',
  },
  {
    message: 'Tidak perlu khawatir soal keamanan, semuanya terjamin.',
    author: 'Toni Y.',
  },
];
</script>

<template>
  <div class="reset-page-padding-x page-padding-x bg-gray-900 py-16">
    <div class="flex flex-col gap-12 rounded-2xl border border-gray-500 px-5 py-5">
      <div class="flex flex-col justify-between gap-1 sm:flex-row">
        <div class="text-xl font-medium sm:text-2xl md:text-3xl">Testimoni</div>
        <p class="text-sm text-gray-500">Beberapa ulasan dari para pelanggan</p>
      </div>

      <!-- Testimonial Scroll -->
      <div class="scrollbar-hidden overflow-x-auto py-4">
        <div class="flex gap-6 whitespace-nowrap">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="flex min-w-96 flex-col gap-3 rounded-xl bg-gray-800 px-5 py-5"
          >
            <div class="w-full">
              <p class="text-sm font-medium text-yellow-500">{{ testimonial.author }}</p>
            </div>
            <div class="w-full text-wrap">
              <p class="text-sm text-gray-100">"{{ testimonial.message }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
