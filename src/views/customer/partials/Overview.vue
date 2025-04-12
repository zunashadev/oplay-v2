<script setup>
import ButtonComponent from '@/components/buttons/Button.vue';
</script>

<template>
  <div class="flex w-full items-stretch gap-5">
    <!-- START : Jumlah Akun Aktif -->
    <div class="flex w-full flex-1 items-center justify-between rounded-xl bg-gray-900 px-5 py-5">
      <!-- Left -->
      <div class="flex items-center gap-3">
        <div class="text-2xl">🔒</div>
        <p class="font-medium text-white">Akun Aktif</p>
      </div>
      <!-- Right -->
      <div class="text-end">
        <p class="text-xl font-medium text-white">12</p>
        <p class="text-xs text-gray-500">Akun</p>
      </div>
    </div>
    <!-- END : Jumlah Akun Aktif -->

    <!-- START : Jumlah Refferal -->
    <div class="flex w-full flex-1 items-center justify-between rounded-xl bg-gray-900 px-5 py-5">
      <!-- Left -->
      <div class="flex items-center gap-3">
        <div class="text-2xl">👨‍👩‍👧‍👦</div>
        <p class="font-medium text-white">Jumlah Refferal</p>
      </div>
      <!-- Right -->
      <div class="text-end">
        <p class="text-xl font-medium text-white">12</p>
        <p class="text-xs text-gray-500">Akun</p>
      </div>
    </div>
    <!-- END : Jumlah Refferal -->

    <!-- START : Saldo -->
    <div class="flex w-full flex-1 items-center justify-between rounded-xl bg-gray-900 px-5 py-5">
      <!-- Left -->
      <div class="flex items-center gap-2">
        <div class="text-2xl">💰</div>
        <p class="font-medium text-white">Saldo</p>
      </div>
      <!-- Right -->
      <div class="flex items-center gap-5">
        <p class="text-lightning-yellow-400 text-xl font-medium">Rp. 12.000</p>
        <ButtonComponent textColor="black" size="sm">Gunakan</ButtonComponent>
      </div>
    </div>
    <!-- END : Saldo -->
  </div>
</template>
