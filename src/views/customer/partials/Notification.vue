<script setup>
import CrossIcon from '@/components/icons/Cross.vue';
</script>

<template>
  <div class="rounded-md border border-red-500 bg-red-500/10 px-5 py-3 text-red-500">
    <div class="flex items-center justify-between gap-5">
      <p class="text-sm">Akun xxxxxx akan berakhir pada 2 hari lagi.</p>
      <div class="transition-all hover:cursor-pointer hover:text-red-600">
        <CrossIcon class="size-5" />
      </div>
    </div>
  </div>
</template>
