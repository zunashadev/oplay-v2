<script setup></script>

<template>
  <div class="flex h-24 w-52 items-end justify-center">
    <div
      v-for="(bar, index) in 4"
      :key="index"
      class="animate-wave mx-[5px] h-2 w-4 rounded-full bg-yellow-500"
      :style="{ animationDelay: `${index * 0.1}s` }"
    ></div>
  </div>
</template>

<style scoped>
@keyframes wave {
  0% {
    height: 0.5rem;
  }
  50% {
    height: 3.125rem;
  }
  100% {
    height: 0.5rem;
  }
}

.animate-wave {
  animation: wave 1s ease-in-out infinite;
}
</style>
