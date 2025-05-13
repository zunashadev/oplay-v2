<script setup></script>

<template>
  <div class="space-y-12">
    <div class="bg-pink-500 px-5 py-5">
      <button v-print="'#print-area'" class="rounded-full bg-yellow-500 p-2">Cetak</button>
    </div>

    <!-- PRINT -->
    <div id="print-area" class="p-5">
      <div class="flex flex-col gap-5 bg-red-500 p-5">
        <div>JUDUL HALAMAN</div>
        <div class="flex flex-col gap-2">
          <div v-for="x in 10" :key="x" class="rounded-lg bg-green-500 p-3">Item {{ x }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
