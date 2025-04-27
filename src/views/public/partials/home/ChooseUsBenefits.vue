<script setup>
// 📌 Icons
import CheapDollarIcon from '@/components/icons/CheapDollar.vue';
import RocketLunchIcon from '@/components/icons/RocketLunch.vue';
import ShieldCheckIcon from '@/components/icons/ShieldCheck.vue';
import CreditCardIcon from '@/components/icons/CreditCard.vue';

// 📌 Data list
const items = [
  {
    icon: CheapDollarIcon,
    title: 'Harga Terjangkau',
    description:
      'Kami menawarkan harga terbaik untuk akun-akun premium tanpa mengorbankan kualitas. Dapatkan akses premium dengan biaya yang ramah di kantong.',
  },
  {
    icon: RocketLunchIcon,
    title: 'Proses Cepat',
    description:
      'Nikmati pengalaman belanja yang cepat dan mudah. Setelah pembayaran dikonfirmasi, akun Anda langsung dikirim tanpa perlu menunggu lama.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Garansi Keamanan',
    description:
      'Keamanan Anda prioritas kami. Kami menjamin setiap akun yang Anda beli aman digunakan, serta dilindungi dengan garansi penggantian jika terjadi kendala.',
  },
  {
    icon: CreditCardIcon,
    title: 'Beragam Metode Pembayaran',
    description:
      'Kami mendukung berbagai metode pembayaran mulai dari transfer bank, e-wallet, hingga pembayaran digital lainnya — memudahkan Anda memilih sesuai kebutuhan.',
  },
];
</script>

<template>
  <div class="flex gap-24">
    <div class="flex w-1/2 flex-none flex-col gap-10">
      <div class="text-5xl/16 font-medium">Kenapa harus memilih kami?</div>

      <div class="flex flex-col gap-5">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="group flex flex-col gap-3 transition-all hover:cursor-pointer"
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <div
                class="rounded-md border border-gray-500/50 p-2 transition-all group-hover:border-yellow-500/50"
              >
                <component
                  :is="item.icon"
                  class="size-5 text-gray-500 transition-all group-hover:text-yellow-500"
                />
              </div>
              <p class="text-xl text-gray-500 transition-all group-hover:text-yellow-500">
                {{ item.title }}
              </p>
            </div>
            <p class="text-sm text-gray-500 transition-all group-hover:text-gray-400">
              {{ item.description }}
            </p>
          </div>
          <hr class="rounded-full text-gray-500/50 transition-all group-hover:text-yellow-500/50" />
        </div>
      </div>
    </div>

    <div class="flex w-1/2 items-center justify-center">
      <img src="/images/illustrations/public-home/UndrawGoals.svg" class="max-w-[28rem]" />
    </div>
  </div>
</template>
